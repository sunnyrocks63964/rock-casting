"use client";

/**
 * tRPC Provider
 * アプリ全体でtRPCとReact Queryを使用可能にする
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./client";

// ---------------------------------------------------------------------------
// モジュールレベルのトークンキャッシュ（同一セッション内でのオーバーヘッド削減）
// 同時に複数のtRPCバッチリクエストが飛んでも getSession() は1回だけ呼ぶ
// ---------------------------------------------------------------------------
type TokenCache = { value: string; expiresAt: number };
let _cachedToken: TokenCache | null = null;
let _pendingTokenPromise: Promise<string | null> | null = null;

async function getAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (_cachedToken && now < _cachedToken.expiresAt) {
    return _cachedToken.value;
  }
  if (_pendingTokenPromise) {
    return _pendingTokenPromise;
  }
  _pendingTokenPromise = (async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token ?? null;
      _cachedToken = token
        ? { value: token, expiresAt: Date.now() + 30_000 }
        : null;
      return token;
    } finally {
      _pendingTokenPromise = null;
    }
  })();
  return _pendingTokenPromise;
}

/** ログアウト後などにキャッシュを明示的にクリアするユーティリティ */
export function clearAccessTokenCache() {
  _cachedToken = null;
  _pendingTokenPromise = null;
}

// ---------------------------------------------------------------------------

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url:
            typeof window !== "undefined"
              ? `${window.location.origin}/api/trpc`
              : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trpc`,
          transformer: superjson,
          async headers() {
            const token = await getAccessToken();
            const baseHeaders: Record<string, string> = {
              "Content-Type": "application/json",
            };
            if (token) {
              baseHeaders["Authorization"] = `Bearer ${token}`;
            }
            return baseHeaders;
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
