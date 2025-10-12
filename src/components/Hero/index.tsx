"use client";

import React from "react";
import Link from "next/link";
import { RocknRoll_One } from "next/font/google";
// @ts-ignore
import heroBackground from "./images/hero_top_background_1.png";
// @ts-ignore
import redBorder from "./images/red_border.png";
// @ts-ignore
import kvSlide01 from "./images/kv_slide_01.png";
// @ts-ignore
import kvSlide02 from "./images/kv_slide_02.png";
// @ts-ignore
import kvSlide03 from "./images/kv_slide_03.png";
// @ts-ignore
import kvSlide08 from "./images/kv_slide_08.png";

const rocknrollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
});

const Hero = () => {
  const slides = [
    {
      src: kvSlide01.src,
      alt: "KV Slide 1",
    },
    {
      src: kvSlide02.src,
      alt: "KV Slide 2",
    },
    {
      src: kvSlide03.src,
      alt: "KV Slide 3",
    },
    {
      src: kvSlide08.src,
      alt: "KV Slide 4",
    },
  ];

  // ループ用に画像を2セット作成
  const duplicatedSlides = [...slides, ...slides];

  return (
    <>
      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${heroBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 背景オーバーレイ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        ></div>

        {/* 背景のアクセント */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "25%",
              right: "-8rem",
              width: "24rem",
              height: "24rem",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "50%",
              filter: "blur(48px)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "25%",
              left: "-8rem",
              width: "24rem",
              height: "24rem",
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              borderRadius: "50%",
              filter: "blur(48px)",
            }}
          ></div>
        </div>

        <div
          style={{
            maxWidth: "1400px",
            margin: "0",
            padding: "0 1rem",
            position: "relative",
            zIndex: 3,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "7fr 3fr",
              gap: "4rem",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            {/* 左側のテキストコンテンツ */}
            <div style={{ marginLeft: "0px" }}>
              {/* メインコピー */}
              <h1
                style={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "48px",
                  fontWeight: "bold",
                  marginBottom: "2rem",
                  lineHeight: 1.2,
                }}
              >
                キャスト選びを「運任せ」にしない
              </h1>

              {/* サブタイトル */}
              <h2
                style={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "60px",
                  fontWeight: "bold",
                  marginBottom: "2rem",
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                クリエイター特化型
                <br />
                人材マッチング
              </h2>

              {/* ROCK CASTING with underline */}
              <div style={{ marginBottom: "3rem" }}>
                <div
                  style={{
                    fontFamily: rocknrollOne.style.fontFamily,
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  ROCK CASTING
                </div>
                <img
                  src={redBorder.src}
                  alt="red border"
                  style={{
                    width: "20rem",
                    height: "auto",
                    marginTop: "-0.35px",
                  }}
                />
              </div>

              {/* CTAボタン */}
              <div style={{ display: "flex" }}>
                <Link
                  href="/register"
                  style={{
                    fontFamily: "Noto Sans JP",
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "9999px",
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
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

            {/* 右側の自動スクロール画像コンテナ */}
            <div>
              <div
                style={{
                  marginLeft: "auto",
                  height: "100vh",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    animation: "scrollUp 20s linear infinite",
                  }}
                >
                  {duplicatedSlides.map((slide, index) => (
                    <div
                      key={index}
                      style={{
                        aspectRatio: "4/3",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
