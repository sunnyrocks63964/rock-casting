/**
 * tRPC API Route Handler
 * Next.js App RouterでtRPCを使用するためのエンドポイント
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError: ({ path, error }) => {
      // 本番環境でもエラーログを出力（Vercelのログで確認可能）
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
        error.cause ? `\nCause: ${error.cause}` : "",
        error.stack ? `\nStack: ${error.stack}` : ""
      );
    },
  });

export { handler as GET, handler as POST };

