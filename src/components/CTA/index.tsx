"use client";

import React from "react";
// @ts-ignore
import bannerPc from "./images/banner_pc.png";

const CTA = () => {
  return (
    <section
      style={{
        padding: "80px 0",
        backgroundColor: "#000000",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <img
          src={bannerPc.src}
          alt="ROCK CASTING - 今すぐ無料登録！必要なキャストがすぐに揃います"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
};

export default CTA;
