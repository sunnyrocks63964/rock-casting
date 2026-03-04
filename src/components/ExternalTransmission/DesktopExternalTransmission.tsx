"use client";

import React from "react";

const DesktopExternalTransmission = () => {
  return (
    <section
      style={{
        padding: "8rem 0 5rem",
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {/* タイトル */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
            }}
          >
            外部送信規律に関する公表事項
          </h1>
        </div>

        {/* 本文 */}
        <div
          style={{
            fontSize: "0.9rem",
            lineHeight: "1.8",
          }}
        >
          <p style={{ marginBottom: "2rem" }}>
            株式会社SUNNY ROCKS（以下「弊社」といいます）は、弊社が運営するウェブサイト「ROCK CASTING」（以下、当該ウェブサイト又は当該ウェブサイトで提供されるサービスを「弊社サービス」といいます）を利用するお客様の閲覧履歴、閲覧状況及び利用環境などの情報（これらを併せて、以下「利用者情報」といいます）を、お客様ごとにカスタマイズされたサービス・広告の表示、アクセス解析による弊社サービスの改善のために、クッキー等の端末識別子を使用して収集し、外部事業者に送信しています。外部事業者の名称・サービス名、外部事業者に送信される利用者情報の内容、送信される情報の利用目的については、以下より詳細をご確認ください。
          </p>

          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              paddingBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <svg
              width="5"
              height="29"
              viewBox="0 0 5 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="2.5"
                y1="29"
                x2="2.5"
                stroke="#FF6D00"
                strokeWidth="5"
              />
            </svg>
            利用者情報の外部送信先：
          </h2>

          {/* テーブル */}
          <div
            style={{
              overflowX: "auto",
              marginBottom: "2rem",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                    }}
                  >
                    事業者名称
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                    }}
                  >
                    サービス名
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                    }}
                  >
                    送信される利用者情報
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                    }}
                  >
                    利用目的
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google LLC
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google Analytics
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    デバイス情報、ブラウザ情報、操作情報
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    弊社サービス改善のため
                    <br />
                    弊社サービスの最適化のため
                    <br />
                    弊社サービス利用状況分析のため
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google LLC
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google Search Console
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    ブラウザ情報、操作情報、履歴情報
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    弊社サービス改善のため
                    <br />
                    弊社サービスの最適化のため
                    <br />
                    弊社サービス利用状況分析のため
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google LLC
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google Tag Manager
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    デバイス情報、位置情報、ブラウザ情報、操作情報、履歴情報
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    弊社サービス改善のため
                    <br />
                    弊社サービスの最適化のため
                    <br />
                    弊社サービス利用状況分析のため
                    <br />
                    広告の効果測定のため
                    <br />
                    広告の配信のため
                    <br />
                    広告配信の最適化のため
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google LLC
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Google広告
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    デバイス情報、ブラウザ情報、操作情報、広告に関する操作情報
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    広告の配信のため
                    <br />
                    広告配信の最適化のため
                    <br />
                    広告の効果測定のため
                    <br />
                    弊社サービス利用状況分析のため
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    LINEヤフー株式会社
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    Yahoo!広告
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    ブラウザ情報、広告に関する操作情報、操作情報
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      verticalAlign: "top",
                    }}
                  >
                    広告の配信のため
                    <br />
                    広告配信の最適化のため
                    <br />
                    広告の効果測定のため
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesktopExternalTransmission;
