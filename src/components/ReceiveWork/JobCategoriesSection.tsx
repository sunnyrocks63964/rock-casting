"use client";

import React from "react";
// アイコン画像は後で追加
// Figmaから提供されたURLは7日間で期限切れになるため、
// 実際の画像は別途準備が必要です

const JobCategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: "フォトグラファー",
      iconUrl: "https://www.figma.com/api/mcp/asset/fc1fe123-14c2-4467-95fd-8180685bebaa",
    },
    {
      id: 2,
      name: "スタイリスト",
      iconUrl: "https://www.figma.com/api/mcp/asset/17649c6a-e6f8-41ff-b8dc-d596c8e07eda",
    },
    {
      id: 3,
      name: "ヘアメイク",
      iconUrl: "https://www.figma.com/api/mcp/asset/da50e0fb-b997-475d-8744-c3016cd55385",
    },
  ];

  return (
    <section
      style={{
        backgroundColor: "#060606",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#2c2c2c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={category.iconUrl}
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  margin: 0,
                }}
              >
                {category.name}
              </p>
              <div
                style={{
                  width: "35px",
                  height: "10px",
                  backgroundColor: "#ff6d00",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategoriesSection;

