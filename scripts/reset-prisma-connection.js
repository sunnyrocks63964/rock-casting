/**
 * Prismaクライアントの接続を明示的に切断するスクリプト
 * 開発環境でprepared statementエラーが発生した際に使用
 */

const { PrismaClient } = require("@prisma/client");

async function resetConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log("🔄 Prismaクライアントの接続を切断中...");
    await prisma.$disconnect();
    console.log("✅ 接続を切断しました");
    console.log("\n💡 次のステップ:");
    console.log("   1. 開発サーバーを再起動してください: npm run dev");
    console.log("   2. それでもエラーが続く場合は、PostgreSQLサーバーを再起動してください");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
  }
}

resetConnection();

