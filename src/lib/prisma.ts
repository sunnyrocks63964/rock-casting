/**
 * Prisma Client Singleton
 * Next.jsのホットリロードで複数のPrismaクライアントが作成されるのを防ぐ
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 環境変数のチェック
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL環境変数が設定されていません");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

