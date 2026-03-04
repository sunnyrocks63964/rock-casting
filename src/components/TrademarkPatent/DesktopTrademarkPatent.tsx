"use client";

import React from "react";
import Link from "next/link";

const DesktopTrademarkPatent = () => {
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
            商標・特許
          </h1>
          <p
            style={{
              fontSize: "1rem",
            }}
          >
            商標・特許に関するお問い合わせ
          </p>
        </div>

        {/* 本文 */}
        <div
          style={{
            fontSize: "0.9rem",
            lineHeight: "1.8",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ marginBottom: "1rem" }}>
              商標や特許などございますでしょうか？
            </p>
            <p>
              詳細については、以下のリンクをご確認ください。
            </p>
          </div>

          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
            }}
          >
            <Link
              href="https://guide.cloudcasting.jp/ip/?_gl=1*q5ymfz*_gcl_au*MTAwNTM0MzI0Ni4xNzY3NzgyNDM5*_ga*NDcwNzc4OTk0LjE3Njc3ODI0Mzk.*_ga_98LWM979KL*czE3NzA5NTY4NjEkbzMkZzAkdDE3NzA5NTY5MDIkajE5JGwwJGgw*_ga_XEKZP49NF6*czE3NzA5NTY4NjEkbzMkZzEkdDE3NzA5NTY4NjEkajYwJGwwJGgw"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                backgroundColor: "#FF6D00",
                color: "white",
                textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e55a00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FF6D00";
              }}
            >
              詳細を確認する
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesktopTrademarkPatent;
