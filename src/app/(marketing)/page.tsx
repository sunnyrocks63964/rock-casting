import HomePage from "@/components/HomePage";
import { getServerAppUrl } from "@/lib/utils/url";
import type { Metadata } from "next";

/**
 * ルートURL（https://www.rock-casting.com/）でトップページのコンテンツを配信
 * 「クロール済み - インデックス未登録」対策：リダイレクトではなくコンテンツを直接配信し、
 * 正規URLを明確にすることでGoogleのインデックス登録を促進する
 * https://support.google.com/webmasters/answer/7440203#crawled
 */
export const metadata: Metadata = {
  alternates: {
    canonical: getServerAppUrl(),
  },
};

export default function RootPage() {
  return <HomePage />;
}
