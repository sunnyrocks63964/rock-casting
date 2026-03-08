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

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000, // 5秒
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: typeof window !== "undefined" 
            ? `${window.location.origin}/api/trpc`
            : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trpc`,
          transformer: superjson,
          async headers() {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };

            // クライアントサイドでSupabaseセッションからトークンを取得
            if (typeof window !== "undefined") {
              try {
                const { supabase } = await import("@/lib/supabase");
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.access_token) {
                  headers["Authorization"] = `Bearer ${session.access_token}`;
                }
              } catch (error) {
                // エラーが発生してもリクエストは続行
                console.error("認証トークンの取得に失敗:", error);
              }
            }

            return headers;
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

