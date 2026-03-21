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
  poweredByHeader: false, // X-Powered-Byヘッダーを削除
  
  // 本番環境でのソースマップ無効化（セキュリティ向上）
  productionBrowserSourceMaps: false,
  
  // コンパイラオプション
  compiler: {
    // 本番環境でのconsole.log削除
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // ヘッダー設定（middleware.tsでも設定しているが、ここでも設定）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
