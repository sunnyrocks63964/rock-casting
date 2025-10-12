"use client";

import React from "react";

const Faq = () => {
    const faqs = [
        {
            question: "どんな人が登録されているの？",
            answer:
                "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
        },
        {
            question: "どんな人が登録されているの？",
            answer:
                "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
        },
        {
            question: "どんな人が登録されているの？",
            answer:
                "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
        },
        {
            question: "どんな人が登録されているの？",
            answer:
                "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
        },
    ];

    return (
        <section
            style={{
                padding: "80px 20px",
                backgroundColor: "#f5f5f5",
            }}
        >
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h2
                        style={{
                            fontSize: "36px",
                            fontFamily: "RocknRoll One",
                            marginBottom: "8px",
                            color: "#000000",
                        }}
                    >
                        FAQ
                    </h2>
                    <p style={{ fontSize: "14px", color: "#666666" }}>よくある質問</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "1000px" }}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "4px",
                                overflow: "hidden",
                                border: "1px solid #e0e0e0",
                                padding: "20px",
                            }}
                        >
                            {/* 質問部分 */}
                            <div
                                style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
                            >
                                <span
                                    style={{
                                        color: "#000000",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        flexShrink: 0,
                                    }}
                                >
                                    Q
                                </span>
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#333333",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    {faq.question}
                                </span>
                            </div>

                            {/* 回答部分 */}
                            <div style={{ display: "flex", gap: "12px" }}>
                                <span
                                    style={{
                                        color: "#dc2626",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        flexShrink: 0,
                                    }}
                                >
                                    A
                                </span>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "#666666",
                                        lineHeight: "1.6",
                                        margin: 0,
                                    }}
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
