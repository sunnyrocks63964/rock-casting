"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";

const MobileFooter = () => {
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
    <footer>
      {/* グレー背景セクション */}
      <div
        style={{
          backgroundColor: "#3f3f3f",
          padding: "2rem 1rem",
        }}
      >
        {/* ROCK CASTING タイトル */}
        <h2
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "18px",
            fontWeight: "normal",
            color: "white",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          ROCK CASTING
        </h2>

        {/* サービス */}
        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "13px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            サービス
          </h3>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <Link
              href={getTopPath()}
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              トップページ
            </Link>
            <Link
              href="/usage_guide"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              料金
            </Link>
            <Link
              href="/top#casts"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              キャスト一覧
            </Link>
            <Link
              href="/receive-work"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              仕事を受ける
            </Link>
            <Link
              href="/order-work"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              仕事を依頼する
            </Link>
            <Link
              href="/interview_schedule"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              会員登録
            </Link>
            <Link
              href="/login"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              ログイン
            </Link>
            <Link
              href="/reset-password"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              パスワード再設定
            </Link>
          </nav>
        </div>

        {/* 規約・運営・その他 */}
        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            規約・運営・その他
          </h3>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <Link
              href="/terms_of_service"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              利用規約
            </Link>
            <Link
              href="/external_transmission"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              外部送信規律に関する公表事項
            </Link>
            <Link
              href="/trademark_patent"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              商標・特許
            </Link>
            <Link
              href="/commercial_law"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              特定商取引法に基づく表示
            </Link>
            <Link
              href="/privacy_policy"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              プライバシーポリシー
            </Link>
            <Link
              href="https://sunnyrocks32169.com/aboutus/"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",

              }}
            >
              企業情報
            </Link>
            <Link
              href="/security_policy"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              情報セキュリティーポリシー
            </Link>
            <Link
              href="/service_environment"
              target="_blank"
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
              }}
            >
              サービス利用環境
            </Link>
          </nav>
        </div>

        {/* お問い合わせボタン */}
        <div style={{ marginBottom: "0.75rem" }}>
          <Link
            href="https://sunnyrocks32169.com/contact/"
            target="_blank"
            style={{
              display: "block",
              backgroundColor: "white",
              color: "black",
              padding: "10px 24px",
              borderRadius: "90px",
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              textDecoration: "none",
              transition: "background-color 0.3s",
            }}
          >
            お問い合わせはこちら
          </Link>
        </div>

        {/* ヘルプ・ご利用ガイドボタン */}
        <div>
          <Link
            href="/usage_guide"
            target="_blank"
            style={{
              display: "block",
              backgroundColor: "#ff6d00",
              color: "white",
              padding: "10px 24px",
              borderRadius: "90px",
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              textDecoration: "none",
              transition: "background-color 0.3s",
            }}
          >
            ヘルプ・ご利用ガイド
          </Link>
        </div>
      </div>

      {/* コピーライト */}
      <div
        style={{
          backgroundColor: "#3f3f3f",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #4a4a4a",
        }}
      >
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "10px",
            color: "white",
            textAlign: "center",
            margin: 0,
          }}
        >
          © 2025 <span style={{ fontWeight: "normal" }}>ROCK CASTING</span>
        </p>
      </div>
    </footer>
  );
};

export default MobileFooter;

