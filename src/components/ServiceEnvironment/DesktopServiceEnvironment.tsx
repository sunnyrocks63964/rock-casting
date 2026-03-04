"use client";

import React from "react";

const DesktopServiceEnvironment = () => {
  return (
    <section
      style={{
        padding: "8rem 0 5rem",
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {/* タイトル */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
            }}
          >
            サービス利用環境
          </h1>
        </div>

        {/* 本文 */}
        <div
          style={{
            fontSize: "0.9rem",
            lineHeight: "1.8",
          }}
        >
          <p style={{ marginBottom: "2rem" }}>
            ROCK CASTINGご利用時の推奨環境は以下の通りです。
          </p>
          <p style={{ marginBottom: "2rem" }}>
            記載ブラウザのいずれも最新版でご利用ください。
          </p>

          {/* 推奨動作環境 */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                paddingBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <svg
                width="5"
                height="29"
                viewBox="0 0 5 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="2.5"
                  y1="29"
                  x2="2.5"
                  stroke="#FF6D00"
                  strokeWidth="5"
                />
              </svg>
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

export default DesktopServiceEnvironment;
