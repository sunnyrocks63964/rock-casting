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
      const isProduction = process.env.NODE_ENV === "production";
      
      // エラーログを出力（本番環境では詳細を制限）
      if (isProduction) {
        // 本番環境では簡潔なログのみ
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.code} - ${error.message}`
        );
      } else {
        // 開発環境では詳細なログ
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          error.cause ? `\nCause: ${error.cause}` : "",
          error.stack ? `\nStack: ${error.stack}` : ""
        );
      }
      
      // セキュリティ関連のエラーは必ずログに記録
      if (error.code === "UNAUTHORIZED" || error.code === "FORBIDDEN") {
        const forwarded = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const clientIp = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
        console.warn(`⚠️  Security event: ${error.code} on ${path} from IP: ${clientIp}`);
      }
    },
  });

export { handler as GET, handler as POST };

