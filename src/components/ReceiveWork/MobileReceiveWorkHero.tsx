"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import heroImage from "./images/request-a-job_kv.png";

const MobileReceiveWorkHero = () => {
  return (
    <section
      style={{
        paddingTop: "30px",
        position: "relative",
        height: "250px",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* 背景画像 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "250px",
        }}
      >
        <Image
          src={heroImage}
          alt=""
          fill
          style={{
            objectFit: "cover",
          }}
          priority
        />
      </div>

      {/* オーバーレイ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "250px",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        }}
      />

      {/* コンテンツ */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "250px",
          padding: "0 40px",
          gap: "20px",
        }}
      >
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          \クリエイターのための仕事マッチング/
        </p>
        <h1
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "24px",
            fontWeight: "900",
            color: "white",
            lineHeight: "1.5",
            margin: 0,
            textAlign: "center",
          }}
        >
          好きな仕事で、
          <br />
          自分らしく働く。
        </h1>
        <Link
          href="/register/cast"
          style={{
            backgroundColor: "#d70202",
            color: "white",
            padding: "12px 48px",
            borderRadius: "90px",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "Noto Sans JP",
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          新規登録はこちら
        </Link>
      </div>
    </section>
  );
};

export default MobileReceiveWorkHero;

