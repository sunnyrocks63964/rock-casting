import React from "react";
import type { Metadata } from "next";
import { Inter, RocknRoll_One, Noto_Sans_JP } from "next/font/google";
import "../styles/globals.css";
import { TRPCProvider } from "@/lib/trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ROCK CASTING - キャスティングマッチングプラットフォーム",
  description:
    "クリエイター特化型人材マッチングプラットフォーム「ROCK CASTING」- キャスト選びを「運任せ」にしない、プロフェッショナルなキャスティングサービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
