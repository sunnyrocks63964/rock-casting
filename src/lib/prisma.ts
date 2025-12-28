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

// Prismaクライアントの設定
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// シングルトンインスタンスの作成
export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

// 開発環境ではグローバルに保存してホットリロード時の重複を防ぐ
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// アプリケーション終了時のクリーンアップ処理
if (typeof window === "undefined") {
  // サーバーサイドのみで実行
  const cleanup = async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error("Prismaクライアントの切断エラー:", error);
    }
  };

  // プロセス終了時のクリーンアップ
  process.on("beforeExit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

export default prisma;

