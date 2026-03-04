"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";

const DesktopFooter = () => {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  // ユーザーIDを取得
  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    getUserId();
  }, []);

  // 現在のユーザー情報を取得
  const { data: userData } = trpc.auth.getCurrentUser.useQuery(
    { userId: userId! },
    {
      enabled: !!userId,
      retry: false,
    }
  );

  // トップページへの遷移先を決定（パスベースの判定）
  const getTopPath = (): string => {
    // パスベースの判定（優先度：高）
    if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
      return "/top/caster";
    }
    if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
      return "/top/order";
    }

    // ユーザーデータベースの判定（フォールバック）
    if (userData) {
      if (userData.hasCasterProfile && !userData.hasOrdererProfile) {
        return "/top/caster";
      }
      if (userData.hasOrdererProfile && !userData.hasCasterProfile) {
        return "/top/order";
      }
      if (userData.hasCasterProfile && userData.hasOrdererProfile) {
        // 両方持っている場合は、パスに基づいて判定（デフォルトはorder）
        return "/top/order";
      }
    }

    // デフォルト（ログインしていない場合も含む）
    return "/";
  };
  return (
    <footer style={{ borderTop: "1px solid #1f2937" }}>
      {/* 上部セクション（グレー背景） */}
      <div style={{ backgroundColor: "#3F3F3F" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1rem" }}
        >
          {/* ROCK CASTING タイトル */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "400",
              color: "white",
              textAlign: "center",
              marginBottom: "3rem",
              letterSpacing: "0.05em",
            }}
          >
            ROCK CASTING
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* サービス */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "1rem",
                }}
              >
                サービス
              </h3>
              <nav
                style={{
                  fontSize: "12px",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.5rem",
                }}
              >
                <Link
                  href={getTopPath()}
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  トップページ
                </Link>
                <Link
                  href="/order-work"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  仕事を依頼する
                </Link>
                <Link
                  href="/receive-work"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  仕事を受ける
                </Link>
                <Link
                  href="/interview_schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  会員登録
                </Link>
                <Link
                  href="/top#casts"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  キャスト一覧
                </Link>
                <Link
                  href="/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  ログイン
                </Link>
                <Link
                  href="/usage_guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  料金
                </Link>
                <Link
                  href="/reset-password"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  パスワード再設定
                </Link>
              </nav>
            </div>

            {/* 規約・運営・その他 */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "1rem",
                }}
              >
                規約・運営・その他
              </h3>
              <nav
                style={{
                  fontSize: "12px",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.5rem",
                }}
              >
                <Link
                  href="/terms_of_service"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  利用規約
                </Link>
                <Link
                  href="/external_transmission"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  外部送信規律に関する公表事項
                </Link>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/trademark_patent"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  商標・特許
                </Link>
                <Link
                  href="/commercial_law"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  特定商取引法に基づく表示
                </Link>
                <Link
                  href="/privacy_policy"
                  target="_blank"

                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  プライバシーポリシー
                </Link>
                <Link
                  href="https://sunnyrocks32169.com/aboutus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  企業情報
                </Link>
                <Link
                  href="/security_policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  情報セキュリティーポリシー
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  サービス利用環境
                </Link>
              </nav>
            </div>

            {/* お問い合わせ */}
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "40px" }}>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-block",
                    transition: "background-color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  お問い合わせはこちら
                </Link>
              </div>
              <div>
                <Link
                  href="/usage_guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#f97316",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-block",
                    transition: "background-color 0.3s",
                  }}
                >
                  ヘルプ・ご利用ガイド
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下部セクション（黒背景） */}
      <div
        style={{ backgroundColor: "#000000", borderTop: "1px solid #1f2937" }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "2px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
            © 2025 SUNNY ROCKS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;

