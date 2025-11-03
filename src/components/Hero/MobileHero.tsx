import React from "react";
import { RocknRoll_One } from "next/font/google";
import heroBackground from "./images/hero_top_background_1.png";
import redBorder from "./images/red_border.png";

const rocknrollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
});

interface MobileHeroProps {
  slides: Array<{
    src: string;
    alt: string;
  }>;
}

const MobileHero = ({ slides }: MobileHeroProps) => {
  // ループ用に画像を2セット作成
  const duplicatedSlides = [...slides, ...slides];

  return (
    <>
      <style jsx>{`
        @keyframes scrollHorizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-225px * 4 - 1rem * 4));
          }
        }
      `}</style>
      <section
        style={{
          position: "relative",
          minHeight: "646px",
          display: "flex",
          alignItems: "flex-start",
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

        {/* スマホレイアウト */}
        <div
          style={{
            width: "100%",
            position: "relative",
            zIndex: 3,
            padding: "80px 16px 0",
          }}
        >
          {/* メインコピー */}
          <p
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            キャスト選びを「運任せ」にしない
          </p>

          {/* サブタイトル */}
          <h1
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "32px",
              fontWeight: 900,
              marginBottom: "1.5rem",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            クリエイター特化型
            <br />
            人材マッチング
          </h1>

          {/* ROCK CASTING with underline */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                fontFamily: rocknrollOne.style.fontFamily,
                fontSize: "24px",
                color: "white",
              }}
            >
              ROCK CASTING
            </div>
            <img
              src={redBorder.src}
              alt="red border"
              style={{
                width: "236px",
                height: "auto",
                marginTop: "0.25rem",
              }}
            />
          </div>

          {/* 横スクロール画像コンテナ - 上段 */}
          <div
            style={{
              overflow: "hidden",
              width: "100vw",
              marginLeft: "calc(-16px)",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                animation: "scrollHorizontal 20s linear infinite",
              }}
            >
              {duplicatedSlides.map((slide, index) => (
                <div
                  key={`top-${index}`}
                  style={{
                    width: "225px",
                    height: "150px",
                    borderRadius: "8px",
                    overflow: "hidden",
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

          {/* 横スクロール画像コンテナ - 下段（逆方向） */}
          <div
            style={{
              overflow: "hidden",
              width: "100vw",
              marginLeft: "calc(-16px)",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                animation: "scrollHorizontal 20s linear infinite reverse",
              }}
            >
              {duplicatedSlides.map((slide, index) => (
                <div
                  key={`bottom-${index}`}
                  style={{
                    width: "225px",
                    height: "150px",
                    borderRadius: "8px",
                    overflow: "hidden",
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
      </section>
    </>
  );
};

export default MobileHero;

