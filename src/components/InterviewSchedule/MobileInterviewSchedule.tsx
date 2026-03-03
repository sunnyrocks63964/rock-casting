"use client";

import React from "react";

export default function MobileInterviewSchedule() {
    const handleReserveClick = () => {
        window.open("https://www.jicoo.com/t/BXDdpgGcV_8Z/e/fHKyvEkD", "_blank", "noopener,noreferrer");
    };

    return (
        <div
            style={{
                paddingTop: "87px",
                paddingBottom: "60px",
                backgroundColor: "#060606",
                minHeight: "100vh",
            }}
        >
            {/* タイトル */}
            <h1
                style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "clamp(24px, 6vw, 36px)",
                    fontWeight: "700",
                    lineHeight: "normal",
                    color: "white",
                    textAlign: "center",
                    marginBottom: "40px",
                    marginTop: "60px",
                    padding: "0 20px",
                }}
            >
                面接日程調整
            </h1>

            {/* 説明文 */}
            <div
                style={{
                    padding: "0 20px",
                    marginBottom: "40px",
                }}
            >
                <div
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "clamp(14px, 4vw, 20px)",
                        fontWeight: "400",
                        lineHeight: "1.6",
                        color: "white",
                    }}
                >
                    <p style={{ marginBottom: "16px" }}>
                        ロックキャスティングでは、すべてのキャストの方に対し、ご登録前の面談を実施しております。
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        ただし、スキルの優劣だけでご登録の可否を判断するわけではありません。面談の目的は、ご活動の内容やご経験、得意分野、働き方の希望などを事前に共有いただき、より適切なマッチングを行うことにあります。
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        キャスト一人ひとりの特性に合ったお仕事をご紹介することで、クライアントさまとのミスマッチを防ぎ、安心してプロジェクトに取り組んでいただけます。
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                        また、ロックキャスティングとキャストの方が事前にお話しすることで、登録後のやり取りや稼働もスムーズになります。
                    </p>
                    <p style={{ marginBottom: "0" }}>
                        面談からご登録までの流れは、下記の通りです。
                    </p>
                </div>
            </div>

            {/* 4つのステップ */}
            <div
                style={{
                    padding: "0 20px",
                    marginBottom: "40px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "30px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "40px",
                    }}
                >
                    {/* ステップ1 */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#ff6d00",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "18px",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "white",
                                }}
                            >
                                1
                            </span>
                        </div>
                        <h3
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(18px, 5vw, 24px)",
                                fontWeight: "700",
                                color: "black",
                                textAlign: "center",
                                marginBottom: "18px",
                            }}
                        >
                            面談予約
                        </h3>
                        <div
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(14px, 4vw, 20px)",
                                fontWeight: "400",
                                color: "black",
                                textAlign: "left",
                                lineHeight: "1.6",
                            }}
                        >
                            <p style={{ marginBottom: "8px" }}>
                                面談予約ページより、ご都合のよい日時を選択してご予約ください。
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                予約完了後、面談方法や当日の流れについてご案内いたします。
                            </p>
                        </div>
                    </div>

                    {/* ステップ2 */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#ff6d00",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "18px",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "white",
                                }}
                            >
                                2
                            </span>
                        </div>
                        <h3
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(18px, 5vw, 24px)",
                                fontWeight: "700",
                                color: "black",
                                textAlign: "center",
                                marginBottom: "18px",
                            }}
                        >
                            面談実施
                        </h3>
                        <div
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(14px, 4vw, 20px)",
                                fontWeight: "400",
                                color: "black",
                                textAlign: "left",
                                lineHeight: "1.6",
                            }}
                        >
                            <p style={{ marginBottom: "8px" }}>
                                オンラインにて、ロックキャスティング担当者と面談を行います。
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                これまでのご経験や活動内容、対応可能な業務、働き方のご希望などを中心にお伺いします。
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                形式張った面接ではなく、相互理解を目的とした面談ですので、リラックスしてお話しください。
                            </p>
                        </div>
                    </div>

                    {/* ステップ3 */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#ff6d00",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "18px",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "white",
                                }}
                            >
                                3
                            </span>
                        </div>
                        <h3
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(18px, 5vw, 24px)",
                                fontWeight: "700",
                                color: "black",
                                textAlign: "center",
                                marginBottom: "18px",
                            }}
                        >
                            採用有無のメール配信
                        </h3>
                        <div
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(14px, 4vw, 20px)",
                                fontWeight: "400",
                                color: "black",
                                textAlign: "left",
                                lineHeight: "1.6",
                            }}
                        >
                            <p style={{ marginBottom: "8px" }}>
                                面談後、採用の可否についてメールにてご連絡いたします。
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                結果にかかわらず必ずご案内いたしますので、連絡が届かないといったご心配はいりません。
                            </p>
                        </div>
                    </div>

                    {/* ステップ4 */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#ff6d00",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "18px",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "white",
                                }}
                            >
                                4
                            </span>
                        </div>
                        <div
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(18px, 5vw, 24px)",
                                fontWeight: "700",
                                color: "black",
                                textAlign: "center",
                                marginBottom: "18px",
                            }}
                        >
                            <p style={{ marginBottom: "0" }}>採用の場合</p>
                            <p style={{ marginBottom: "0" }}>新規登録ページの案内</p>
                        </div>
                        <div
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(14px, 4vw, 20px)",
                                fontWeight: "400",
                                color: "black",
                                textAlign: "left",
                                lineHeight: "1.6",
                            }}
                        >
                            <p style={{ marginBottom: "8px" }}>
                                採用となった場合は、新規登録ページのご案内をお送りします。
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                ご登録完了後は、ロックキャスティングのキャストとして、案件のご紹介や活動サポートを受けながらお仕事に取り組んでいただけます。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 面談を予約するボタン */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "0 20px",
                }}
            >
                <button
                    onClick={handleReserveClick}
                    style={{
                        backgroundColor: "#d70202",
                        color: "white",
                        border: "none",
                        borderRadius: "90px",
                        padding: "18px 0",
                        width: "100%",
                        maxWidth: "476px",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "clamp(18px, 5vw, 24px)",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = "#b00101";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = "#d70202";
                    }}
                >
                    面談を予約する
                </button>
            </div>
        </div>
    );
}
