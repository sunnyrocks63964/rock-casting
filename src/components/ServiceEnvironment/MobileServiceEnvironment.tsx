"use client";

import React from "react";

const MobileServiceEnvironment = () => {
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
            marginBottom: "2rem",
          }}
        >
          サービス利用環境
        </h1>

        {/* 本文 */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
            fontFamily: "Noto Sans JP",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            ROCK CASTINGご利用時の推奨環境は以下の通りです。
          </p>
          <p style={{ marginBottom: "2rem" }}>
            記載ブラウザのいずれも最新版でご利用ください。
          </p>

          {/* 推奨動作環境 */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              推奨動作環境
            </h2>
            <ul
              style={{
                listStyle: "none",
                paddingLeft: "0",
              }}
            >
              <li
                style={{
                  marginBottom: "0.5rem",
                  paddingLeft: "1.5rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                  }}
                >
                  •
                </span>
                Google Chrome
              </li>
              <li
                style={{
                  marginBottom: "0.5rem",
                  paddingLeft: "1.5rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                  }}
                >
                  •
                </span>
                Firefox
              </li>
              <li
                style={{
                  marginBottom: "0.5rem",
                  paddingLeft: "1.5rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                  }}
                >
                  •
                </span>
                Safari
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileServiceEnvironment;
