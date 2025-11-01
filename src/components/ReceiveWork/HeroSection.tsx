"use client";

import React from "react";
import Link from "next/link";
// @ts-ignore
import heroImage1 from "../Hero/images/kv_slide_01.png";
// @ts-ignore
import heroImage2 from "../Hero/images/kv_slide_02.png";
// @ts-ignore
import heroImage3 from "../Hero/images/kv_slide_03.png";
// @ts-ignore
import heroImage4 from "../Hero/images/kv_slide_08.png";

const HeroSection = () => {
  return (
    <section
      style={{
        position: "relative",
        height: "408px",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* 背景画像グループ */}
      <div
        style={{
          position: "absolute",
          top: "87px",
          left: 0,
          width: "100%",
          height: "408px",
          display: "flex",
        }}
      >
        {/* 画像は実際のデザインでは4つの画像が重なっています */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "25%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={heroImage1?.src || "/placeholder.jpg"}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "25%",
            width: "25%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={heroImage2?.src || "/placeholder.jpg"}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            width: "25%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={heroImage3?.src || "/placeholder.jpg"}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "75%",
            width: "25%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={heroImage4?.src || "/placeholder.jpg"}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* オーバーレイ */}
      <div
        style={{
          position: "absolute",
          top: "87px",
          left: 0,
          width: "100%",
          height: "408px",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        }}
      />

      {/* コンテンツ */}
      <div
        style={{
          position: "relative",
          top: "87px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "408px",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          \クリエイターのための仕事マッチング/
        </p>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "white",
            textAlign: "center",
            marginBottom: "40px",
            lineHeight: "1.2",
          }}
        >
          好きな仕事で、自分らしく働く。
        </h1>
        <Link
          href="/register/cast"
          style={{
            backgroundColor: "#d70202",
            color: "white",
            padding: "20px 60px",
            borderRadius: "90px",
            fontSize: "24px",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
            textDecoration: "none",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b00101";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#d70202";
          }}
        >
          新規登録はこちら
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

