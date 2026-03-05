/**
 * サーバーサイドでアプリケーションのベースURLを取得するユーティリティ
 * 
 * 優先順位:
 * 1. APP_URL (サーバーサイド専用環境変数、NEXT_PUBLIC_なし)
 * 2. VERCEL_URL (Vercelが自動設定する環境変数)
 * 3. NEXT_PUBLIC_APP_URL (フォールバック)
 * 4. http://localhost:3000 (開発環境のデフォルト)
 * 
 * @returns アプリケーションのベースURL
 */
export const getServerAppUrl = (): string => {
  // 1. サーバーサイド専用の環境変数（NEXT_PUBLIC_なし）
  if (process.env.APP_URL) {
    console.error("[getServerAppUrl] Using APP_URL:", process.env.APP_URL);
    return process.env.APP_URL;
  }

  // 2. Vercelが自動設定する環境変数
  // VERCEL_URLはプロトコルを含まない形式（例: rock-casting-tawny.vercel.app）
  if (process.env.VERCEL_URL) {
    const vercelUrl = `https://${process.env.VERCEL_URL}`;
    console.error("[getServerAppUrl] Using VERCEL_URL:", vercelUrl);
    return vercelUrl;
  }

  // 3. NEXT_PUBLIC_APP_URL（フォールバック、ビルド時に埋め込まれる可能性がある）
  if (process.env.NEXT_PUBLIC_APP_URL) {
    console.error("[getServerAppUrl] Using NEXT_PUBLIC_APP_URL (fallback):", process.env.NEXT_PUBLIC_APP_URL);
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 4. 開発環境のデフォルト
  console.error("[getServerAppUrl] Using default localhost:3000");
  return "http://localhost:3000";
};
