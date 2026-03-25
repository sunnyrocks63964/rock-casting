/**
 * Next.js Middleware
 * API ルートのみに適用：レート制限・CORS
 * セキュリティヘッダーは next.config.js に集約（ページ遷移のオーバーヘッド削減）
 */

import { NextRequest, NextResponse } from "next/server";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 100,
};

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  if (realIp) return realIp;
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) return false;

  record.count += 1;
  return true;
}

function cleanupRateLimitStore() {
  const now = Date.now();
  const keysToDelete: string[] = [];
  rateLimitStore.forEach((record, ip) => {
    if (now > record.resetTime) keysToDelete.push(ip);
  });
  keysToDelete.forEach((ip) => rateLimitStore.delete(ip));
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // レート制限
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const record = rateLimitStore.get(ip);
  if (record) {
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT.maxRequests));
    response.headers.set(
      "X-RateLimit-Remaining",
      String(RATE_LIMIT.maxRequests - record.count)
    );
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(record.resetTime / 1000))
    );
  }

  // CORS
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "https://rock-casting-tawny.vercel.app",
  ].filter(Boolean) as string[];

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

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

// API ルートのみに限定することでページ遷移時のエッジ処理を省略
export const config = {
  matcher: ["/api/:path*"],
};
