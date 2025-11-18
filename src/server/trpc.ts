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
  return {
    req: opts.req,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * tRPCインスタンス初期化
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
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
 * 認証が必要なプロシージャ（将来実装）
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // TODO: Supabase認証チェックをここに実装
  // 現在はスキップ
  return next({
    ctx: {
      ...ctx,
    },
  });
});

