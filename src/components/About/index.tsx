"use client";

import React from "react";
import Link from "next/link";
import aboutBg from "./images/about_bg.png";
import about01 from "./images/about_01.png";
import about02 from "./images/about_02.png";
import about03 from "./images/about_03.png";

const About = () => {
  const features = [
    {
      title: "厳選されたクリエイターのみ所属",
      description:
        "いったん弊社でクリエイターのオーディションを開催し、実績・コーディング・技術のヒアリングを行い担当者で社内会議を設定しているので、クオリティクリエイターのみを受け持ち、品質を確保していきます。",
      image: about01.src,
    },
    {
      title: "ご予算に応じた最適なマッチング",
      description:
        "ベンチャー・スタートアップから名刺者・マーケティング・医療・タオルス・クライアントの業界とクリエイターをマッチングします。",
      image: about02.src,
    },
    {
      title: "満足保証・無料でやり直しマッチング",
      description:
        "サービスに満足いただけなかった場合でも、追加料金なくクリエイターを再マッチングいたします。",
      image: about03.src,
    },
  ];

  return (
    <section
      style={{
        padding: "5rem 0",
        backgroundColor: "#111827",
        backgroundImage: `url(${aboutBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* 背景オーバーレイ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            ABOUT
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#d1d5db",
              fontFamily: "Noto Sans JP",
            }}
          >
            わたしたちが選ばれる理由
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                overflow: "hidden",
                fontFamily: "Noto Sans JP",
              }}
            >
              <div
                style={{
                  height: "12rem",
                  backgroundImage: `url(${feature.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <div
                style={{
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "0.75rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    lineHeight: "1.625",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <Link
            href="/register"
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "1rem 2rem",
              fontSize: "1.125rem",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.3s ease",
              border: "1px solid #333",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
              borderRadius: "100px",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#b91c1c";
              target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#dc2626";
              target.style.transform = "scale(1)";
            }}
          >
            新規登録はこちら
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
