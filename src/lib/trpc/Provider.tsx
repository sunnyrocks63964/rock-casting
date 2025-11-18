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
          headers() {
            return {
              "Content-Type": "application/json",
            };
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

