import React from "react";
import type { Metadata } from "next";
import { Inter, RocknRoll_One, Noto_Sans_JP } from "next/font/google";
import "../styles/globals.css";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { getServerAppUrl } from "@/lib/utils/url";

const inter = Inter({ subsets: ["latin"] });

const SITE_TITLE = "ROCK CASTING - キャスティングマッチングプラットフォーム";
const SITE_DESCRIPTION =
  "クリエイター特化型人材マッチングプラットフォーム「ROCK CASTING」- キャスト選びを「運任せ」にしない、プロフェッショナルなキャスティングサービス";

function buildMetadata(): Metadata {
  const baseUrl = getServerAppUrl();

  const metadata: Metadata = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: "ROCK CASTING",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: baseUrl,
    },
    twitter: {
      card: "summary",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (googleVerification) {
    metadata.verification = {
      google: googleVerification,
    };
  }

  return metadata;
}

export const metadata = buildMetadata();

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
