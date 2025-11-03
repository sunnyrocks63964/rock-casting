"use client";

import React from "react";

const MobileCastCountSection = () => {
  return (
    <section
      style={{
        backgroundColor: "#060606",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
          }}
        >
          登録キャスト数
        </p>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "14px 20px",
            minWidth: "101px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#d70202",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            100
          </span>
        </div>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: "bold",
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

export default MobileCastCountSection;

