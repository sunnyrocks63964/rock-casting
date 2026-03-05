"use client";

import React from "react";
import Link from "next/link";

const MobileCommercialLaw = () => {
  return (
    <section
      style={{
        paddingTop: "64px",
        paddingBottom: "2rem",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 16px",
        }}
      >
        {/* タイトル */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          特定商取引法に基づく表示
        </h1>

        {/* 本文 */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
            fontFamily: "Noto Sans JP",
          }}
        >
          {/* 対象サービス */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              対象サービス
            </h2>
            <p>ROCK CASTING（以下「本サービス」といいます）</p>
          </div>

          {/* 販売事業者名 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              販売事業者名
            </h2>
            <p>株式会社SUNNY ROCKS</p>
          </div>

          {/* 代表者 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              代表者
            </h2>
            <p>澤山勇士</p>
          </div>

          {/* 所在地 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              所在地
            </h2>
            <p>東京都渋谷区道玄坂1丁目10番8号渋谷道玄坂東急ビル2F-C</p>
          </div>

          {/* 連絡先 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              連絡先
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>
              電話番号：050-1724-3269
            </p>
            <p>
              受付時間：10:00～18:00（土・日・祝日・年末年始・夏季休暇を除く）
            </p>
          </div>

          {/* お問い合わせ先 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              お問い合わせ先
            </h2>
            <p>こちらのフォームよりお問い合わせください</p>
          </div>

          {/* ご利用代金 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              ご利用代金
            </h2>
            <p>本サービスのウェブサイトに掲載しています</p>
          </div>

          {/* お支払い方法及び時期 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              お支払い方法及び時期
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>
              クレジットカード（VISA / MASTER / JCB / American Express / Diners）
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              お客様の口座からのお引き落としは、ご利用クレジット会社が定める支払日となります。
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              請求書による銀行振込
            </p>
            <p>
              本サービスにおいて決済手続きをしていただいた日の翌月末日までに振込送金する方法にてお支払いください。なお、原則として、請求書はマネーフォワードケッサイ株式会社がPDFファイルにて発行（メール送信）いたします。郵送による請求書の発行の場合、1通につき200円（税別）の発行手数料をご負担いただきます。
            </p>
          </div>

          {/* ご利用代金以外に必要な料金 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              ご利用代金以外に必要な料金
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>
              銀行振込によるお支払いの場合：振込手数料
            </p>
            <p>
              請求書の郵送発行をご希望の場合：発行手数料
            </p>
          </div>

          {/* 消費税及び地方消費税 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              消費税及び地方消費税
            </h2>
            <p>（記載なし）</p>
          </div>

          {/* 販売数量 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              販売数量
            </h2>
            <p>数量の制限はありません</p>
          </div>

          {/* ご提供時期 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              ご提供時期
            </h2>
            <p>本サービスにおいて決定した出演日</p>
          </div>

          {/* キャンセルの可否及び条件 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              キャンセルの可否及び条件
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>
              出演前のキャンセルは可能です。
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              ただし、本サービスの利用規約に定めるキャンセル手数料をお支払いいただきます。
            </p>
            <p>
              取引の性質上、出演後のキャンセルはお受けしておりません。
            </p>
          </div>

          {/* 利用規約 */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              利用規約
            </h2>
            <p>
              本サービスの利用規約は、<Link href="/terms_of_service" style={{ color: "#FF6D00", textDecoration: "underline" }}>こちら</Link>をご確認ください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileCommercialLaw;
