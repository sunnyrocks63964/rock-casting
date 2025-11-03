"use client";

import React from "react";

const DesktopCastCountSection = () => {
  return (
    <section
      style={{
        backgroundColor: "#060606",
        padding: "60px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <p
          style={{
            fontSize: "41.442px",
            fontWeight: "700",
            color: "white",
            margin: 0,
          }}
        >
          登録キャスト数
        </p>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "20px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "153.774px",
              fontWeight: "700",
              color: "#d70202",
              lineHeight: "1",
            }}
          >
            100
          </span>
        </div>
        <p
          style={{
            fontSize: "41.442px",
            fontWeight: "700",
            color: "white",
            margin: 0,
          }}
        >
          名突破！！
        </p>
      </div>
    </section>
  );
};

export default DesktopCastCountSection;

