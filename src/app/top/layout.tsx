import React from "react";

/**
 * /top/order, /top/caster のレイアウト
 * トップページはルート(/)で配信するため、/top は / へリダイレクト
 */
export default function TopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
