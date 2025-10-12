"use client";

import React, { useState } from "react";
// @ts-ignore
import castBg from "./images/cast_bg.png";

const Cast = () => {
  const [activeTab, setActiveTab] = useState("photographer");

  const tabs = [
    { id: "photographer", label: "フォトグラファー" },
    { id: "model", label: "モデル" },
    { id: "artist", label: "アーティスト" },
    { id: "creator", label: "クリエイター" },
  ];

  const casts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `名前名前`,
    description:
      "モデル歴14年のフリーモデル。室内から外まで対応します。年間200本以上を撮影いたします。広告の仕事を上達継続していい、広告やポートレイト",
    image: "/api/placeholder/200/200",
  }));

  return (
    <section
      style={{
        padding: "5rem 0",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
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
              color: "black",
              marginBottom: "1rem",
            }}
          >
            CAST
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4b5563",
            }}
          >
            キャスト
          </p>
        </div>

        <div
          style={{
            backgroundImage: `url(${castBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            margin: "0 auto",
            marginBottom: "3rem",
            width: "80%",
            padding: "2rem",
          }}
        >
          {/* タブナビゲーション */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "3rem",
              borderBottom: "2px solid #3b82f6",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.75rem 1.5rem",
                  margin: "0 0.5rem 0.5rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: activeTab === tab.id ? "#000000" : "#808080",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    const target = e.target as HTMLElement;
                    target.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    const target = e.target as HTMLElement;
                    target.style.backgroundColor = "#808080";
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* キャストグリッド */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {casts.map((cast) => (
              <div
                key={cast.id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    height: "12rem",
                    background:
                      "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{
                      width: "4rem",
                      height: "4rem",
                      color: "white",
                    }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    padding: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.125rem",
                      marginBottom: "0.5rem",
                      color: "black",
                    }}
                  >
                    {cast.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#4b5563",
                      lineHeight: "1.625",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cast.description}
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
            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#3b82f6";
              }}
            >
              もっと見る
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cast;
