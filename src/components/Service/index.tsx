"use client";

import React from "react";
// @ts-ignore
import lawsuitBg from "./images/lawsuit_bg_pc.png";

const Service = () => {
  return (
    <section
      style={{
        padding: "5rem 0",
        backgroundColor: "#1f2937",
        backgroundImage: `url(${lawsuitBg.src})`,
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
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            color: "white",
            marginBottom: "1rem",
            fontFamily: "RocknRoll One",
          }}
        >
          SERVICE
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#d1d5db",
            fontFamily: "Noto Sans JP",
          }}
        >
          優良サービス
        </p>

        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              borderRadius: "0.5rem",
              padding: "2rem",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  marginRight: "1rem",
                  fontFamily: "Noto Sans JP",
                }}
              >
                依頼料金
              </span>
              <span
                style={{
                  backgroundColor: "white",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "#dc2626",
                  fontFamily: "Noto Sans Gujarati UI",
                }}
              >
                10,000
              </span>
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  marginLeft: "1rem",
                  fontFamily: "Noto Sans JP",
                }}
              >
                円から
              </span>
            </div>

            <div
              style={{
                marginTop: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "1rem",
                  fontFamily: "Noto Sans JP",
                }}
              >
                精鋭キャスト
              </h3>
              <p
                style={{
                  color: "white",
                  lineHeight: "1.625",
                  fontFamily: "Noto Sans JP",
                }}
              >
                モデル・カメラマン・スタイリスト・ヘアメイク・クリエイター
                <br />
                ご予算に応じて最適な人材がすべて揃います
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
