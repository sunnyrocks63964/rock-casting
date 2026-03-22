import React from "react";
import type { Metadata } from "next";

/**
 * /top 配下のページに canonical タグを設定
 * 「重複しています。ユーザーにより、正規ページとして選択されていません」の解消のため
 * https://support.google.com/webmasters/answer/7440203#duplicate_page_without_canonical_tag
 */
export const metadata: Metadata = {
  alternates: {
    canonical: "./",
  },
};

export default function TopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
