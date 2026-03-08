/**
 * tRPC初期化とコンテキスト設定
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";

/**
 * tRPCコンテキスト
 * 各リクエストで利用可能なデータ
 */
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  // 認証トークンを取得
  const authHeader = opts.req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  return {
    req: opts.req,
    prisma,
    token,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * tRPCインスタンス初期化
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const isProduction = process.env.NODE_ENV === "production";
    let message = shape.message;
    
    // Zodエラーの場合、最初のエラーメッセージを取得
    if (error.cause instanceof ZodError) {
      const flattened = error.cause.flatten();
      
      // フィールドエラーから最初のメッセージを取得
      const fieldErrors = flattened.fieldErrors;
      if (fieldErrors) {
        const entries = Object.entries(fieldErrors);
        for (const [, messages] of entries) {
          if (Array.isArray(messages) && messages.length > 0) {
            message = messages[0];
            break;
          }
        }
      }
      
      // フィールドエラーが見つからない場合、フォームエラーから取得
      if (message === shape.message && flattened.formErrors.length > 0) {
        message = flattened.formErrors[0];
      }
    }
    
    // 本番環境では詳細なエラー情報を隠す
    const errorCode = error instanceof TRPCError ? error.code : null;
    const safeMessage = isProduction && errorCode === "INTERNAL_SERVER_ERROR"
      ? "サーバーエラーが発生しました。しばらくしてから再度お試しください。"
      : message;
    
    return {
      ...shape,
      message: safeMessage,
      data: {
        ...shape.data,
        // 本番環境ではZodエラーの詳細を隠す
        zodError:
          error.cause instanceof ZodError && !isProduction
            ? error.cause.flatten()
            : null,
        // 本番環境ではスタックトレースを隠す
        stack: isProduction ? undefined : shape.data.stack,
      },
    };
  },
});

/**
 * tRPC Router と Procedure のエクスポート
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * 認証が必要なプロシージャ
 * Supabase認証トークンを検証し、ユーザー情報をコンテキストに追加
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const { token } = ctx;

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "認証が必要です。ログインしてください。",
    });
  }

  try {
    // Supabaseでトークンを検証
    const { getServerSupabaseClient } = await import("@/lib/supabase");
    const supabase = getServerSupabaseClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "認証トークンが無効です。再度ログインしてください。",
      });
    }

    // ユーザー情報をPrismaから取得
    const dbUser = await ctx.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        casterProfile: true,
        ordererProfile: true,
      },
    });

    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "ユーザーが見つかりません。",
      });
    }

    // 認証済みユーザー情報をコンテキストに追加
    return next({
      ctx: {
        ...ctx,
        user: dbUser,
        userId: user.id,
      },
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("認証エラー:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "認証処理中にエラーが発生しました。",
    });
  }
});

