/**
 * 環境変数の検証と型安全な取得
 * アプリケーション起動時に必須環境変数を検証
 */

/**
 * 必須環境変数の定義
 */
const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
} as const;

/**
 * 環境変数を検証
 * 本番環境では起動時にエラーを投げる
 */
export function validateEnvVars() {
  const missingVars: string[] = [];
  const nodeEnv = process.env.NODE_ENV || "development";

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    const errorMessage = `以下の環境変数が設定されていません: ${missingVars.join(", ")}`;
    
    if (nodeEnv === "production") {
      throw new Error(errorMessage);
    } else {
      console.warn(`⚠️  ${errorMessage}`);
    }
  }
}

/**
 * 環境変数を型安全に取得
 */
export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,

  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL!,

  // Optional
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// サーバーサイドでのみ環境変数を検証
if (typeof window === "undefined") {
  validateEnvVars();
}
