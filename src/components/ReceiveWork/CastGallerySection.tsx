"use client";

import React from "react";
// @ts-ignore
import castImage from "../Cast/images/cast_01.png";
// @ts-ignore
import castBg from "../Cast/images/cast_bg.png";

const CastGallerySection = () => {
  // 12人のキャストデータ
  const casts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: "名前名前",
    description:
      "モデル歴14年のフリーモデル、宮下ゆりかと申します。\n年間200本以上撮影を行い、広告やCMを中心に...",
    image: castImage,
  }));

  const categories = [
    "フォトグラファー",
    "モデル",
    "アーティスト",
    "クリエイター",
  ];

  return (
    <section
      style={{
        backgroundColor: "white",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "55px",
            fontWeight: "400",
            color: "black",
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "RocknRoll One, sans-serif",
          }}
        >
          Cast
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "400",
            color: "black",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          登録キャスト
        </p>

        {/* カテゴリータブ */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "40px",
          }}
        >
          {categories.map((category, index) => (
            <div
              key={category}
              style={{
                backgroundColor: index === 0 ? "black" : "grey",
                color: "white",
                padding: "18px 40px",
                fontSize: "24px",
                borderTopLeftRadius: index === 0 ? "10px" : "0",
                borderTopRightRadius:
                  index === categories.length - 1 ? "10px" : "0",
                textAlign: "center",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                if (index !== 0) e.currentTarget.style.backgroundColor = "#555";
              }}
              onMouseLeave={(e) => {
                if (index !== 0) e.currentTarget.style.backgroundColor = "grey";
              }}
            >
              {category}
            </div>
          ))}
        </div>

        {/* 背景画像 */}
        <div
          style={{
            position: "relative",
            marginBottom: "40px",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            overflow: "hidden",
          }}
        >
          <img
            src={castBg?.src || "/placeholder.jpg"}
            alt=""
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* キャストカード */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "30px",
            marginTop: "-600px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {casts.map((cast) => (
            <div
              key={cast.id}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                overflow: "hidden",
              }}
            >
              <img
                src={cast.image?.src || "/placeholder.jpg"}
                alt={cast.name}
                style={{
                  width: "100%",
                  height: "187px",
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />
              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "black",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {cast.name}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: "black",
                    lineHeight: "1.6",
                    whiteSpace: "pre-line",
                  }}
                >
                  {cast.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CastGallerySection;

