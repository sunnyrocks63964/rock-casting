"use client";

import React from "react";

const DesktopReasonSection = () => {
  const reasons = [
    {
      id: 1,
      title: "1. 適正価格で受注できる",
      description:
        "報酬は一方的に決められるのではなく、クライアントとの相談で決定します。\n自分のスキルや経験に見合った適正な報酬を提案でき、納得した上で仕事を受けられます。",
    },
    {
      id: 2,
      title: "2. 住まいに近い案件を自動マッチング",
      description:
        "登録した住所をもとに、活動エリア内で募集中のおすすめ案件を通知します。案件探しと移動の手間を省き、無理なく効率的に仕事を受けられます。",
    },
    {
      id: 3,
      title: "3. プロフィールで自分をアピール",
      description:
        "ポートフォリオやスキル、得意ジャンルを詳しく登録できるので、自分に合った案件が見つかりやすくなります。実績を積むほど評価が高まり、より良い条件の案件に出会えるチャンスが広がります。",
    },
  ];

  return (
    <section
      style={{
        backgroundColor: "white",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "55px",
            fontWeight: "400",
            color: "black",
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "RocknRoll One, sans-serif",
          }}
        >
          Reason for choosing
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "400",
            color: "black",
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          ロックキャスティングが選ばれる理由
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "40px",
          }}
        >
          {reasons.map((reason, index) => (
            <div
              key={reason.id}
              style={{
                backgroundColor: "#2c2c2c",
                borderRadius: "30px",
                padding: "40px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                gridColumn: index === 2 ? "1 / -1" : "auto",
                maxWidth: index === 2 ? "600px" : "none",
                margin: index === 2 ? "0 auto" : "0",
                width: "100%",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                {reason.title}
              </h3>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "400",
                  color: "white",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                }}
              >
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesktopReasonSection;

