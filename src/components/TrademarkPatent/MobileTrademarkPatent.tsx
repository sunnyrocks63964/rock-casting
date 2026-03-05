"use client";

import React from "react";
import Link from "next/link";

const MobileTrademarkPatent = () => {
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
            fontSize: "28px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          商標・特許
        </h1>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            color: "black",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          商標・特許に関するお問い合わせ
        </p>

        {/* 本文 */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
            fontFamily: "Noto Sans JP",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            商標や特許などございますでしょうか？
          </p>
          <p style={{ marginBottom: "2rem" }}>
            詳細については、以下のリンクをご確認ください。
          </p>

          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
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
                fontSize: "14px",
                fontWeight: "600",
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

export default MobileTrademarkPatent;
