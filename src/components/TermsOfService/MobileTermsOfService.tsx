"use client";

import React from "react";

const MobileTermsOfService = () => {
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
            fontFamily: "RocknRoll One",
            fontSize: "28px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          利用規約
        </h1>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            color: "black",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          ロックキャスティング利用規約
        </p>

        {/* 本文 */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
            fontFamily: "Noto Sans JP",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            本利用規約は、株式会社SUNNY ROCKS（以下「弊社」といいます）が運営するウェブサイト「ROCK CASTING（ロックキャスティング）」（以下、当該ウェブサイト又は当該ウェブサイトで提供されるサービスを「本サービス」といいます）を利用するキャスト、クライアント及びプロダクション（以下あわせて「ユーザー」といいます）が遵守すべき事項を定めたものです。ユーザーは、本利用規約に従い、本サービスを利用するものとします。
          </p>
          <p style={{ marginBottom: "1rem" }}>
            詳細な利用規約については、デスクトップ版をご覧ください。
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileTermsOfService;
