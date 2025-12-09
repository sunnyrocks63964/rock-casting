/**
 * 認証関連のtRPC Router
 * ユーザー登録、ログイン、パスワードリセットなど
 */

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  BaseRegisterSchema,
  LoginSchema,
  ResetPasswordRequestSchema,
} from "@/lib/validations/authSchema";
import { getServerSupabaseClient } from "@/lib/supabase";

export const authRouter = createTRPCRouter({
  /**
   * ユーザー新規登録（役割ベース）
   * 企業登録と個人登録の両方に対応
   */
  register: publicProcedure
    .input(BaseRegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, role, registrationType, organizationData } = input;

      try {
        // 環境変数のチェック
        const requiredEnvVars = {
          DATABASE_URL: process.env.DATABASE_URL,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        };

        const missingEnvVars = Object.entries(requiredEnvVars)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

        if (missingEnvVars.length > 0) {
          console.error("環境変数が設定されていません:", missingEnvVars);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `環境変数が設定されていません: ${missingEnvVars.join(", ")}`,
          });
        }

        // 既存ユーザーチェック
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "このメールアドレスは既に登録されています",
          });
        }

        // Supabaseでユーザー作成
        const supabase = getServerSupabaseClient();

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // 開発環境ではメール確認をスキップ
        });

        if (authError || !authData.user) {
          console.error("Supabase認証エラー:", authError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `ユーザー登録に失敗しました: ${authError?.message || "不明なエラー"}`,
          });
        }

        // 企業登録の場合
        const isCompanyRegistration =
          registrationType === "company-order" || registrationType === "company-receive";

        if (isCompanyRegistration) {
          if (!organizationData) {
            // Supabaseで作成したユーザーを削除（ロールバック）
            try {
              await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteError) {
              console.error("ユーザー削除エラー（ロールバック）:", deleteError);
            }
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "企業登録の場合、企業情報が必要です",
            });
          }

          // 企業情報をフィルタリング（空文字列をnullに変換）
          const filteredOrgData = {
            companyName: organizationData.companyName?.trim() || null,
            industry: organizationData.industry?.trim() || null,
            companyOverview: organizationData.companyOverview?.trim() || null,
            websiteUrl: organizationData.websiteUrl?.trim() || null,
            desiredWorkAreas: organizationData.desiredWorkAreas?.filter((area) => area.trim() !== "") || [],
            desiredOccupations: organizationData.desiredOccupations?.filter((occ) => occ.trim() !== "") || [],
          };

          // トランザクションでOrganizationとUserを作成
          const result = await ctx.prisma.$transaction(async (tx) => {
            // Organizationを作成
            // 企業として受注する場合は、desiredWorkAreasとdesiredOccupationsはOrganizationに保存しない
            const orgDataForCreate =
              registrationType === "company-receive"
                ? {
                    companyName: filteredOrgData.companyName,
                    industry: filteredOrgData.industry,
                    companyOverview: filteredOrgData.companyOverview,
                    websiteUrl: filteredOrgData.websiteUrl,
                    desiredWorkAreas: [],
                    desiredOccupations: [],
                  }
                : filteredOrgData;

            const organization = await tx.organization.create({
              data: orgDataForCreate,
            });

            // Userを作成（organizationIdを設定）
            const user = await tx.user.create({
              data: {
                id: authData.user.id,
                email,
                organizationId: organization.id,
                // 企業として受注する場合はCasterProfileも作成（希望稼働エリアと職種を保存）
                ...(registrationType === "company-receive"
                  ? {
                      casterProfile: {
                        create: {
                          // 最初の希望稼働エリアを保存（複数ある場合は最初の1つ）
                          area: filteredOrgData.desiredWorkAreas?.[0] || null,
                          // 最初の職種を保存（複数ある場合は最初の1つ）
                          occupation: filteredOrgData.desiredOccupations?.[0] || null,
                        },
                      },
                    }
                  : {}),
                // 企業として発注する場合はOrdererProfileも作成（希望稼働エリアと職種を保存）
                ...(registrationType === "company-order"
                  ? {
                      ordererProfile: {
                        create: {
                          desiredWorkAreas: filteredOrgData.desiredWorkAreas || [],
                          desiredOccupations: filteredOrgData.desiredOccupations || [],
                        },
                      },
                    }
                  : {}),
              },
              include: {
                organization: true,
                casterProfile: true,
                ordererProfile: true,
              },
            });

            return { user, organization };
          }).catch(async (prismaError) => {
            console.error("Prismaエラー:", prismaError);
            // Supabaseで作成したユーザーを削除（ロールバック）
            try {
              await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteError) {
              console.error("ユーザー削除エラー（ロールバック）:", deleteError);
            }
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `データベースへの登録に失敗しました: ${prismaError instanceof Error ? prismaError.message : "不明なエラー"}`,
            });
          });

          return {
            success: true,
            user: {
              id: result.user.id,
              email: result.user.email,
              organizationId: result.user.organizationId,
              hasCasterProfile: !!result.user.casterProfile,
              hasOrdererProfile: !!result.user.ordererProfile,
            },
            organization: {
              id: result.organization.id,
              companyName: result.organization.companyName,
            },
          };
        } else {
          // 個人登録の場合（既存のロジック）
          const user = await ctx.prisma.user.create({
            data: {
              id: authData.user.id,
              email,
              // 役割に応じてプロフィールを作成
              ...(role === "caster" || role === "both"
                ? { casterProfile: { create: {} } }
                : {}),
              ...(role === "orderer" || role === "both"
                ? { ordererProfile: { create: {} } }
                : {}),
            },
            include: {
              casterProfile: true,
              ordererProfile: true,
            },
          }).catch(async (prismaError) => {
            console.error("Prismaエラー:", prismaError);
            // Supabaseで作成したユーザーを削除（ロールバック）
            try {
              await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteError) {
              console.error("ユーザー削除エラー（ロールバック）:", deleteError);
            }
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `データベースへの登録に失敗しました: ${prismaError instanceof Error ? prismaError.message : "不明なエラー"}`,
            });
          });

          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              hasCasterProfile: !!user.casterProfile,
              hasOrdererProfile: !!user.ordererProfile,
            },
          };
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("登録エラー:", error);
        const errorMessage = error instanceof Error ? error.message : "不明なエラー";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `ユーザー登録中にエラーが発生しました: ${errorMessage}`,
        });
      }
    }),

  /**
   * ログイン
   */
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      try {
        // Supabaseでログイン
        const supabase = getServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "メールアドレスまたはパスワードが間違っています",
          });
        }

        // ユーザー情報を取得
        const user = await ctx.prisma.user.findUnique({
          where: { id: data.user.id },
          include: {
            casterProfile: true,
            ordererProfile: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ユーザーが見つかりません",
          });
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            hasCasterProfile: !!user.casterProfile,
            hasOrdererProfile: !!user.ordererProfile,
          },
          session: data.session,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("ログインエラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ログイン中にエラーが発生しました",
        });
      }
    }),

  /**
   * パスワードリセットリクエスト
   */
  requestPasswordReset: publicProcedure
    .input(ResetPasswordRequestSchema)
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`,
        });

        if (error) {
          console.error("パスワードリセットエラー:", error);
          // セキュリティのため、メールアドレスが存在しない場合でも成功を返す
        }

        return {
          success: true,
          message: "パスワードリセットメールを送信しました",
        };
      } catch (error) {
        console.error("パスワードリセットエラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "パスワードリセット中にエラーが発生しました",
        });
      }
    }),

  /**
   * ログアウト
   */
  logout: publicProcedure.mutation(async () => {
    try {
      const supabase = getServerSupabaseClient();
      await supabase.auth.signOut();

      return {
        success: true,
        message: "ログアウトしました",
      };
    } catch (error) {
      console.error("ログアウトエラー:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ログアウト中にエラーが発生しました",
      });
    }
  }),
});

