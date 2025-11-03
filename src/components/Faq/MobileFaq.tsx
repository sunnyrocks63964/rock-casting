import React, { useState } from "react";

interface Faq {
  question: string;
  answer: string;
}

interface MobileFaqProps {
  faqs: Faq[];
}

const MobileFaq = ({ faqs }: MobileFaqProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      style={{
        padding: "3rem 16px",
        backgroundColor: "white",
      }}
    >
      <div style={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "28px",
              fontFamily: "RocknRoll One",
              marginBottom: "0.5rem",
              color: "#000000",
            }}
          >
            FAQ
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#000000",
              fontFamily: "Noto Sans JP",
            }}
          >
            よくある質問
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div key={index}>
                {/* 質問ボタン */}
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #b1b1b1",
                    borderRadius: isExpanded ? "5px 5px 0 0" : "5px",
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                    <span
                      style={{
                        color: "#000000",
                        fontWeight: "bold",
                        fontSize: "20px",
                        flexShrink: 0,
                        fontFamily: "Noto Sans JP",
                      }}
                    >
                      Q
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#000000",
                        lineHeight: "1.6",
                        fontFamily: "Noto Sans JP",
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* プラス/マイナスアイコン */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      position: "relative",
                      width: "14px",
                      height: "14px",
                      marginLeft: "1rem",
                    }}
                  >
                    {/* 横線（常に表示） */}
                    <svg
                      width="14"
                      height="2"
                      viewBox="0 0 14 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <line
                        x1="0"
                        y1="1"
                        x2="14"
                        y2="1"
                        stroke="black"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* 縦線（閉じているときのみ表示）- プラスアイコンに */}
                    {!isExpanded && (
                      <svg
                        width="2"
                        height="14"
                        viewBox="0 0 2 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <line
                          x1="1"
                          y1="0"
                          x2="1"
                          y2="14"
                          stroke="black"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* アコーディオンコンテンツ（回答） */}
                {isExpanded && (
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #b1b1b1",
                      borderTop: "none",
                      borderRadius: "0 0 5px 5px",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span
                        style={{
                          color: "#dc2626",
                          fontWeight: "bold",
                          fontSize: "20px",
                          flexShrink: 0,
                          fontFamily: "Noto Sans JP",
                        }}
                      >
                        A
                      </span>
                      <p
                        style={{
                          fontSize: "16px",
                          color: "#000000",
                          lineHeight: "1.6",
                          margin: 0,
                          fontFamily: "Noto Sans JP",
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MobileFaq;

