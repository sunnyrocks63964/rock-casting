import React from "react";
import lawsuitBg from "./images/lawsuit_bg_pc.png";

const MobileService = () => {
  return (
    <section
      style={{
        padding: "0",
        backgroundColor: "#1f2937",
        backgroundImage: `url(${lawsuitBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        height: "239px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "0 16px",
        }}
      >
        {/* 最低 + 10,000円〜 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
              marginTop: "40px",
            }}
          >
            最低
          </span>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "14px 0",
              width: "178px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#d70202",
                fontFamily: "Noto Sans JP",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              10,000円～
            </span>
          </div>
        </div>

        {/* 説明文 */}
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            lineHeight: "1.5",
            textAlign: "center",
            margin: "0 auto",
            maxWidth: "333px",
          }}
        >
          モデル・カメラマン・スタイリスト・
          <br />
          ヘアメイク・その他クリエイター
          <br />
          ご予算に合った最適な人材がすべて揃います
        </p>
      </div>
    </section>
  );
};

export default MobileService;

