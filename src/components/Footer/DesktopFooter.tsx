"use client";

import React from "react";
import Link from "next/link";

const DesktopFooter = () => {
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
                  href="/"
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
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  仕事を受ける
                </Link>
                <Link
                  href="/user_register"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  会員登録
                </Link>
                <Link
                  href="#"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  キャスト一覧
                </Link>
                <Link
                  href="/login"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                >
                  ログイン
                </Link>
                <Link
                  href="#"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  料金
                </Link>
                <Link
                  href="/reset-password"
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
                  href="#"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  利用規約
                </Link>
                <Link
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  外部送信規律に関する公表事項
                </Link>
                <Link
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  商標・特許
                </Link>
                <Link
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  特定商取引法に基づく表示
                </Link>
                <Link
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  プライバシーポリシー
                </Link>
                <Link
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  企業情報
                </Link>
                <Link
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#d1d5db",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    cursor: "not-allowed",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  情報セキュリティーポリシー
                </Link>
                <Link
                  href="#"
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

