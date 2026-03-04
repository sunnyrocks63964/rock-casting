"use client";

import React from "react";

const MobilePrivacyPolicy = () => {
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
          プライバシーポリシー
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
            株式会社SUNNY ROCKS（以下「弊社」といいます。）は、弊社の保有するお客様を識別できる情報（以下「個人情報」といいます。）を適正に取り扱うことが企業の重要な社会的責務であると認識し、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）その他関連法令等を遵守することをここに表明するとともに、以下のとおり個人情報保護に関する基本方針を定めます。
          </p>
          <p style={{ marginBottom: "1rem" }}>
            詳細なプライバシーポリシーについては、デスクトップ版をご覧ください。
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobilePrivacyPolicy;
