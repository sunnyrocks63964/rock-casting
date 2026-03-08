/**
 * Next.js Middleware
 * セキュリティヘッダー、CORS、レート制限などを設定
 */

import { NextRequest, NextResponse } from "next/server";

// レート制限用の簡易ストア（本番環境ではRedisなどを推奨）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// レート制限の設定
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1分
  maxRequests: 100, // 1分間に100リクエストまで
};

/**
 * IPアドレスを取得（プロキシ経由の場合も考慮）
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  
  if (realIp) {
    return realIp;
  }
  
  return "unknown";
}

/**
 * レート制限チェック
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * 古いレート制限レコードをクリーンアップ
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitStore.forEach((record, ip) => {
    if (now > record.resetTime) {
      keysToDelete.push(ip);
    }
  });
  
  keysToDelete.forEach((ip) => {
    rateLimitStore.delete(ip);
  });
}

// 定期的にクリーンアップ（5分ごと）
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // セキュリティヘッダーの設定
  const securityHeaders = {
    // XSS保護
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    
    // HSTS（HTTPS強制）
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    
    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Permissions Policy
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    
    // Content Security Policy（環境に応じて調整）
    "Content-Security-Policy": (() => {
      const isProduction = process.env.NODE_ENV === "production";
      const isVercelDev = process.env.VERCEL_ENV === "development" || process.env.VERCEL_ENV === "preview";
      
      // Next.jsが生成するインラインスクリプトのhash一覧
      const nextJsHashes = [
        "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='",
        "'sha256-OSYsABjAoTdJBId8xAhS/uGJRTqwFxENkhPFODAMyoY='",
        "'sha256-pnMCWOqBc/6fr0ulcv+NeBQGtzMHHwQA7OYmQyG4rtc='",
        "'sha256-tZSPRudZaPs9uiS0qvpmxcPBsRZ35D3s+qQjrxvu4Xk='",
        "'sha256-7Ne3mvvwxp9HWnb+s3j7tFoakHpseU16jQDJLko6DcE='",
        "'sha256-KhPFbeaWl+j9Y3VzA9tdSoMDXoImOsk5YpaEK2FMXls='",
        "'sha256-uyKQdw6ugSjH1Czufw9FYXsorwaFFQSfKeKyNHyYglY='",
        "'sha256-oY/645YNniIz2j02YqDv54lUER2HbHWJaYCXOjS1SOk='",
      ].join(" ");
      
      // script-srcの設定
      let scriptSrc: string;
      if (isProduction && !isVercelDev) {
        // 本番環境: hashのみ許可（セキュリティ強化）
        scriptSrc = `script-src 'self' ${nextJsHashes}`;
      } else if (isVercelDev) {
        // Vercel dev/preview環境: Vercel Liveを許可
        scriptSrc = `script-src 'self' ${nextJsHashes} https://vercel.live`;
      } else {
        // ローカル開発環境
        scriptSrc = "script-src 'self' 'unsafe-eval' 'unsafe-inline'";
      }
      
      const policies = [
        "default-src 'self'",
        scriptSrc,
        "style-src 'self' 'unsafe-inline'", // Ant Design用（必要）
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.supabase.co https://*.stripe.com",
        "frame-src https://*.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ];

      // HTTPS強制（本番環境のみ）
      if (isProduction) {
        policies.push("upgrade-insecure-requests");
      }

      return policies.join("; ");
    })(),
  };

  // セキュリティヘッダーを追加
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // APIエンドポイントへのレート制限
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = getClientIp(request);
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // レート制限ヘッダーを追加
    const record = rateLimitStore.get(ip);
    if (record) {
      response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT.maxRequests));
      response.headers.set("X-RateLimit-Remaining", String(RATE_LIMIT.maxRequests - record.count));
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(record.resetTime / 1000)));
    }
  }

  // CORS設定（APIエンドポイント用）
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      "http://localhost:3000",
      "https://rock-casting-tawny.vercel.app",
    ].filter(Boolean) as string[];

    // 本番環境では特定のオリジンのみ許可
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
    }

    // OPTIONSリクエストの処理
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * 以下をマッチ:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
