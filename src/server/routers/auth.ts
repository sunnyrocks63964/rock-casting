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
   */
  register: publicProcedure
    .input(BaseRegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, role } = input;

      try {
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
            message: "ユーザー登録に失敗しました",
          });
        }

        // Prismaでユーザーとプロフィール作成
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
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("登録エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ユーザー登録中にエラーが発生しました",
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

