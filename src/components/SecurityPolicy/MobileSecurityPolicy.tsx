"use client";

import React from "react";

const MobileSecurityPolicy = () => {
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
          情報セキュリティポリシー
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
          2026年2月13日制定
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
            株式会社SUNNY ROCKS（以下「弊社」といいます。）は、情報セキュリティ管理の徹底が重要な経営課題であることを認識し、お客様に安心して弊社のサービスをご利用いただくために、関連する法令等を遵守することをここに表明するとともに、以下のとおり情報セキュリティ管理に関する基本方針を定めます。
          </p>
          <p style={{ marginBottom: "1rem" }}>
            詳細な情報セキュリティポリシーについては、デスクトップ版をご覧ください。
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileSecurityPolicy;
