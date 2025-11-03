"use client";

import React from "react";
import Link from "next/link";

const MobileFooter = () => {
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
              href="/"
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
              href="/price"
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
              href="/casts"
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
              href="/register/cast"
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
              href="/register/company"
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
              href="/register"
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
              href="/terms"
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
              href="/trademark"
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
              href="/privacy"
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
              href="/security"
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
              href="/external-transmission"
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
              href="/commercial-law"
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
              href="/company"
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
              href="/environment"
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
            href="/contact"
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

