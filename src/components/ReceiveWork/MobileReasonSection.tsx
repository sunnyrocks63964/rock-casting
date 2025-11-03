"use client";

import React from "react";

const MobileReasonSection = () => {
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
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "28px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Reason for choosing
        </h2>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            color: "black",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          ロックキャスティングが選ばれる理由
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {reasons.map((reason) => (
            <div
              key={reason.id}
              style={{
                backgroundColor: "#2c2c2c",
                borderRadius: "30px",
                padding: "30px 20px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                {reason.title}
              </h3>
              <p
                style={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "16px",
                  fontWeight: "normal",
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

export default MobileReasonSection;

