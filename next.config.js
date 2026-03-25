/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma をサーバーバンドルに取り込みすぎない（Vercel 本番での Query Engine 解決を安定させる）
  serverExternalPackages: ['@prisma/client'],

  // prebuilt / output file tracing 時に rhel 用エンジン等が .next 成果物から落ちないように含める
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/.prisma/client/**/*',
      './node_modules/@prisma/client/**/*',
    ],
  },

  images: {
    domains: ['localhost'],
    // 本番環境でのセキュリティ強化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // セキュリティ設定
  poweredByHeader: false,

  // 本番環境でのソースマップ無効化（セキュリティ向上）
  productionBrowserSourceMaps: false,

  // コンパイラオプション
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // セキュリティヘッダーをすべて next.config.js に集約
  // Middleware はページリクエストでは動かさず API 専用にすることで遷移オーバーヘッドを削減
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercelDev =
      process.env.VERCEL_ENV === 'development' ||
      process.env.VERCEL_ENV === 'preview';
    const isLocalDev = !isProduction && !isVercelDev;

    let scriptSrc;
    if (isVercelDev) {
      scriptSrc = "script-src 'self' 'unsafe-inline' https://vercel.live";
    } else if (isLocalDev) {
      // 開発環境: HMR のため unsafe-eval を許可
      scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
    } else {
      scriptSrc = "script-src 'self' 'unsafe-inline'";
    }

    const frameSrc = isVercelDev
      ? "frame-src https://*.stripe.com https://vercel.live"
      : "frame-src https://*.stripe.com";

    const cspPolicies = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.stripe.com",
      frameSrc,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ];
    if (isProduction) {
      cspPolicies.push("upgrade-insecure-requests");
    }

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: cspPolicies.join('; ') },
        ],
      },
    ];
  },
}

module.exports = nextConfig
