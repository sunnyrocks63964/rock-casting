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
import { sendPasswordResetEmail } from "@/lib/email";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createWorkAreas, type TransactionClient } from "./workAreas";

type BaseRegisterInput = z.infer<typeof BaseRegisterSchema>;

// CasterJobTypeとCasterJobSkill用の型安全なアクセス用型
type JobTypeClient = {
  casterJobType: {
    create: <T extends {
      data: {
        casterProfileId: string;
        jobType: "photographer" | "model" | "artist" | "creator";
      };
    }>(
      args: T
    ) => Promise<{ id: string }>;
  };
  casterJobSkill: {
    create: <T extends {
      data: {
        jobTypeId: string;
        category: string;
        value: string;
      };
    }>(
      args: T
    ) => Promise<void>;
  };
};

// 型ガード: casterJobTypeプロパティが存在し、createメソッドを持つかチェック
function hasCasterJobTypeCreateMethod(
  prop: unknown
): prop is {
  create: (args: {
    data: {
      casterProfileId: string;
      jobType: "photographer" | "model" | "artist" | "creator";
    };
  }) => Promise<{ id: string }>;
} {
  return (
    typeof prop === "object" &&
    prop !== null &&
    "create" in prop &&
    typeof (prop as { create: unknown }).create === "function"
  );
}

// 型ガード: casterJobSkillプロパティが存在し、createメソッドを持つかチェック
function hasCasterJobSkillCreateMethod(
  prop: unknown
): prop is {
  create: (args: {
    data: {
      jobTypeId: string;
      category: string;
      value: string;
    };
  }) => Promise<void>;
} {
  return (
    typeof prop === "object" &&
    prop !== null &&
    "create" in prop &&
    typeof (prop as { create: unknown }).create === "function"
  );
}

// PrismaClientとTransactionClientをJobTypeClientに変換するヘルパー関数
// 型ガードを使用して型安全にアクセス
function toJobTypeClient(client: PrismaClient | TransactionClient): JobTypeClient {
  // プロパティの存在を確認
  if (!("casterJobType" in client) || !("casterJobSkill" in client)) {
    throw new Error("Invalid Prisma client type: missing casterJobType or casterJobSkill");
  }

  // プロパティを安全に取得
  const casterJobType = (client as { casterJobType?: unknown }).casterJobType;
  const casterJobSkill = (client as { casterJobSkill?: unknown }).casterJobSkill;

  // 型ガードで各プロパティを検証
  if (!hasCasterJobTypeCreateMethod(casterJobType)) {
    throw new Error("Invalid Prisma client type: casterJobType.create is not a function");
  }

  if (!hasCasterJobSkillCreateMethod(casterJobSkill)) {
    throw new Error("Invalid Prisma client type: casterJobSkill.create is not a function");
  }

  // 型ガードにより、TypeScriptは各プロパティが正しい型であることを認識
  return {
    casterJobType: {
      create: (args: {
        data: {
          casterProfileId: string;
          jobType: "photographer" | "model" | "artist" | "creator";
        };
      }) => casterJobType.create(args),
    },
    casterJobSkill: {
      create: (args: {
        data: {
          jobTypeId: string;
          category: string;
          value: string;
        };
      }) => casterJobSkill.create(args),
    },
  };
}

/**
 * jobTypeDataからCasterJobTypeとCasterJobSkillを作成するヘルパー関数
 */
async function createJobTypes({
  prisma,
  casterProfileId,
  jobTypeData,
}: {
  prisma: PrismaClient | TransactionClient;
  casterProfileId: string;
  jobTypeData: NonNullable<BaseRegisterInput["jobTypeData"]>;
}) {
  // 型安全なクライアントに変換
  const client = toJobTypeClient(prisma);
  
  // 各職種について処理
  for (const selectedJobType of jobTypeData.selectedJobTypes) {
    // CasterJobTypeを作成
    const casterJobType = await client.casterJobType.create({
      data: {
        casterProfileId,
        jobType: selectedJobType.jobType,
      },
    });

    // 各スキルカテゴリについて処理
    for (const skill of selectedJobType.skills) {
      // カテゴリ内の各値をCasterJobSkillとして作成
      for (const value of skill.values) {
        await client.casterJobSkill.create({
          data: {
            jobTypeId: casterJobType.id,
            category: skill.category,
            value: value,
          },
        });
      }
    }
  }
}

// 企業情報をフィルタリング（空文字列をnullに変換）
const filterOrganizationData = (organizationData: NonNullable<BaseRegisterInput["organizationData"]>) => ({
  companyName: organizationData.companyName?.trim() || null,
  industry: organizationData.industry?.trim() || null,
  companyOverview: organizationData.companyOverview?.trim() || null,
  websiteUrl: organizationData.websiteUrl?.trim() || null,
  desiredWorkAreas: organizationData.desiredWorkAreas?.filter((area: string) => area.trim() !== "") || [],
  desiredOccupations: organizationData.desiredOccupations?.filter((occ: string) => occ.trim() !== "") || [],
});

// Supabaseで作成したユーザーを削除（ロールバック）
const rollbackSupabaseUser = async (supabase: SupabaseClient, userId: string) => {
  try {
    await supabase.auth.admin.deleteUser(userId);
  } catch (deleteError) {
    console.error("ユーザー削除エラー（ロールバック）:", deleteError);
  }
};

// Organization作成データを準備
const prepareOrganizationData = ({
  registrationType,
  filteredOrgData,
}: {
  registrationType: BaseRegisterInput["registrationType"];
  filteredOrgData: ReturnType<typeof filterOrganizationData>;
}) => {
  if (registrationType === "company-receive") {
    return {
      companyName: filteredOrgData.companyName,
      industry: filteredOrgData.industry,
      companyOverview: filteredOrgData.companyOverview,
      websiteUrl: filteredOrgData.websiteUrl,
      desiredWorkAreas: [],
      desiredOccupations: [],
    };
  }
  return filteredOrgData;
};

// User作成データを準備（企業登録用）
const prepareCompanyUserData = ({
  authUserId,
  email,
  registrationType,
  filteredOrgData,
  organizationId,
  workAreaData,
}: {
  authUserId: string;
  email: string;
  registrationType: BaseRegisterInput["registrationType"];
  filteredOrgData: ReturnType<typeof filterOrganizationData>;
  organizationId: string;
  workAreaData?: BaseRegisterInput["workAreaData"];
}) => {
  const baseData = {
    id: authUserId,
    email,
    organizationId,
  };

  if (registrationType === "company-receive") {
    return {
      ...baseData,
      casterProfile: {
        create: {
          area: filteredOrgData.desiredWorkAreas?.[0] || null,
          occupation: filteredOrgData.desiredOccupations?.[0] || null,
          onlineAvailable: workAreaData?.onlineAvailable ?? false,
        },
      },
    };
  }

  if (registrationType === "company-order") {
    return {
      ...baseData,
      ordererProfile: {
        create: {
          desiredWorkAreas: filteredOrgData.desiredWorkAreas || [],
          desiredOccupations: filteredOrgData.desiredOccupations || [],
        },
      },
    };
  }

  return baseData;
};

// 企業登録のトランザクション処理
const createCompanyRegistration = async ({
  prisma,
  authUserId,
  email,
  registrationType,
  filteredOrgData,
  workAreaData,
  jobTypeData,
}: {
  prisma: PrismaClient;
  authUserId: string;
  email: string;
  registrationType: BaseRegisterInput["registrationType"];
  filteredOrgData: ReturnType<typeof filterOrganizationData>;
  workAreaData?: BaseRegisterInput["workAreaData"];
  jobTypeData?: BaseRegisterInput["jobTypeData"];
}) => {
  return await prisma.$transaction(async (tx) => {
    const orgDataForCreate = prepareOrganizationData({ registrationType, filteredOrgData });
    const organization = await tx.organization.create({
      data: orgDataForCreate,
    });

    const userData = prepareCompanyUserData({
      authUserId,
      email,
      registrationType,
      filteredOrgData,
      organizationId: organization.id,
      workAreaData,
    });

    const user = await tx.user.create({
      data: userData,
      include: {
        organization: true,
        casterProfile: true,
        ordererProfile: true,
      },
    });

    // 企業として受注する場合、活動エリアと職種情報を作成
    if (registrationType === "company-receive" && user.casterProfile) {
      if (workAreaData) {
        await createWorkAreas({
          prisma: tx,
          casterProfileId: user.casterProfile.id,
          workAreas: workAreaData.workAreas,
          travelAreas: workAreaData.travelAreas,
        });
      }
      if (jobTypeData && jobTypeData.selectedJobTypes.length > 0) {
        await createJobTypes({
          prisma: tx,
          casterProfileId: user.casterProfile.id,
          jobTypeData,
        });
      }
    }

    return { user, organization };
  });
};

// 個人登録の処理
const createIndividualRegistration = async ({
  prisma,
  authUserId,
  email,
  role,
  workAreaData,
  jobTypeData,
}: {
  prisma: PrismaClient;
  authUserId: string;
  email: string;
  role: BaseRegisterInput["role"];
  workAreaData?: BaseRegisterInput["workAreaData"];
  jobTypeData?: BaseRegisterInput["jobTypeData"];
}) => {
  return await prisma.$transaction(async (tx) => {
    const isCaster = role === "caster" || role === "both";
    const casterProfileData = isCaster
      ? {
          create: {
            onlineAvailable: workAreaData?.onlineAvailable ?? false,
          },
        }
      : undefined;

    const user = await tx.user.create({
      data: {
        id: authUserId,
        email,
        ...(casterProfileData ? { casterProfile: casterProfileData } : {}),
        ...(role === "orderer" || role === "both" ? { ordererProfile: { create: {} } } : {}),
      },
      include: {
        casterProfile: true,
        ordererProfile: true,
      },
    });

    // キャストプロフィールが作成された場合、活動エリアと職種情報を作成
    if (isCaster && user.casterProfile) {
      if (workAreaData) {
        await createWorkAreas({
          prisma: tx,
          casterProfileId: user.casterProfile.id,
          workAreas: workAreaData.workAreas,
          travelAreas: workAreaData.travelAreas,
        });
      }
      if (jobTypeData && jobTypeData.selectedJobTypes.length > 0) {
        await createJobTypes({
          prisma: tx,
          casterProfileId: user.casterProfile.id,
          jobTypeData,
        });
      }
    }

    return user;
  });
};

export const authRouter = createTRPCRouter({
  /**
   * ユーザー新規登録（役割ベース）
   * 企業登録と個人登録の両方に対応
   */
  register: publicProcedure
    .input(BaseRegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, role, registrationType, organizationData, workAreaData, jobTypeData } = input;

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

        // 企業登録の場合の処理
        const isCompanyRegistration =
          registrationType === "company-order" || registrationType === "company-receive";

        if (!isCompanyRegistration) {
          const user = await createIndividualRegistration({
            prisma: ctx.prisma,
            authUserId: authData.user.id,
            email,
            role,
            workAreaData,
            jobTypeData,
          }).catch(async (prismaError) => {
            console.error("Prismaエラー:", prismaError);
            await rollbackSupabaseUser(supabase, authData.user.id);
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

        // 企業登録の場合、企業情報が必要
        if (!organizationData) {
          await rollbackSupabaseUser(supabase, authData.user.id);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "企業登録の場合、企業情報が必要です",
          });
        }

        const filteredOrgData = filterOrganizationData(organizationData);

        const result = await createCompanyRegistration({
          prisma: ctx.prisma,
          authUserId: authData.user.id,
          email,
          registrationType,
          filteredOrgData,
          workAreaData,
          jobTypeData,
        }).catch(async (prismaError) => {
          console.error("Prismaエラー:", prismaError);
          await rollbackSupabaseUser(supabase, authData.user.id);
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
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      try {
        // Userテーブルでメールアドレスが登録されているかチェック
        const user = await ctx.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "そのメールアドレスは登録されていません",
          });
        }

        const supabase = getServerSupabaseClient();
        const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/password_reset`;

        // パスワードリセットリンクを生成（メールは送信しない）
        const { data, error } = await supabase.auth.admin.generateLink({
          type: "recovery",
          email,
          options: {
            redirectTo,
          },
        });

        if (error || !data) {
          console.error("パスワードリセットリンク生成エラー:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "パスワードリセットリンクの生成に失敗しました",
          });
        }

        // カスタムメールを送信
        try {
          await sendPasswordResetEmail({
            email,
            resetLink: data.properties.action_link,
          });
        } catch (emailError) {
          console.error("メール送信エラー:", emailError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "パスワードリセットメールの送信に失敗しました",
          });
        }

        return {
          success: true,
          message: "パスワードリセットメールを送信しました",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("パスワードリセットエラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "パスワードリセット中にエラーが発生しました",
        });
      }
    }),

  /**
   * 現在のセッションからユーザー情報を取得
   */
  getCurrentUser: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
          include: {
            casterProfile: true,
            ordererProfile: true,
            organization: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ユーザーが見つかりません",
          });
        }

        return {
          id: user.id,
          email: user.email,
          hasCasterProfile: !!user.casterProfile,
          hasOrdererProfile: !!user.ordererProfile,
          organizationId: user.organizationId,
          organization: user.organization,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("ユーザー情報取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ユーザー情報取得中にエラーが発生しました",
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

