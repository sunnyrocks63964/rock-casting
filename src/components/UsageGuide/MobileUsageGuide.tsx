"use client";

import React from "react";

const MobileUsageGuide = () => {
  return (
    <section
      style={{
        paddingTop: "64px",
        paddingBottom: "2rem",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 16px",
        }}
      >
        {/* タイトル */}
        <h1
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "28px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Usage fee
        </h1>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            color: "black",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          ご利用料金について
        </p>

        {/* 説明文 */}
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            color: "black",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          1つのプロジェクトにかかる料金は、以下の通りです。
        </p>

        {/* 計算式 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "16px",
              borderRadius: "5px",
              textAlign: "center",
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            キャストの報酬
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="13" cy="13" r="13" fill="black" />
              <line
                x1="7"
                y1="19"
                x2="19"
                y2="7"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1="19"
                y1="19"
                x2="7"
                y2="7"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "16px",
              borderRadius: "5px",
              textAlign: "center",
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            キャストの人数（+消費税）
          </div>
        </div>

        {/* 注意書き */}
        <div
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            アカウント登録やキャストとのやりとりなどに、費用は一切発生しません。
          </p>
          <p style={{ marginBottom: "1rem" }}>
            キャストとご相談いただき、両者にご納得いただいたうえで決済完了まで進むと、料金が支払われます。
          </p>
          <p style={{ marginBottom: "1rem" }}>
            キャストと相談した結果、依頼に至らなかった場合、料金は発生しないのでご安心ください。
            すべての支払いはロックキャスティングにて一元管理され、源泉徴収税の納付や支払調書の作成といった手間も必要ありません。
            支払にかかる煩雑な事務処理を省いてキャストを起用していただけます。
          </p>
        </div>

        {/* 利用料金 */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
            利用料金
          </h2>
          <p
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "1rem",
            }}
          >
            キャスト報酬に加え、システム手数料が発生します。
          </p>
          <div
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>（例）</p>
            <p style={{ marginBottom: "0.5rem" }}>キャスト1名</p>
            <p style={{ marginBottom: "1rem" }}>報酬額30,000円の場合</p>
            <p style={{ marginBottom: "0.5rem" }}>
              発注者様のお支払い額：30,000円＋消費税＝33,000円
            </p>
            <p>
              （キャスト受取額：24,000円　※報酬から20%のシステム手数料を差し引き）
            </p>
          </div>
        </div>

        {/* 決済方法 */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
            決済方法
          </h2>
          <p
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            決済方法は以下よりお選びいただけます。
          </p>
          <ul
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
              paddingLeft: "2rem",
              textAlign: "center",
              listStyle: "none",
            }}
          >
            <li>• カード決済</li>
            <li>• 請求書発行</li>
          </ul>
        </div>

        {/* キャストへの報酬の支払い */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
            キャストへの報酬の支払い
          </h2>
          <div
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              キャストへの報酬は、自由にご設定いただけます。
            </p>
            <p style={{ marginBottom: "1rem" }}>
              キャストとご相談いただいたうえで、両者にご納得いただける報酬をお決めください。
            </p>
            <p style={{ marginBottom: "1rem" }}>
              ロックキャスティングを通じて稼働したキャストへの報酬は、弊社を通じてキャストへお支払いします（報酬支払いの際には、税法に基づく源泉徴収を行います）。
            </p>
            <p style={{ marginBottom: "1rem" }}>
              ご依頼後にキャスト報酬の減額はできません。もし減額される場合、再度オファーを作成していただく必要があります。
            </p>
            <p>
              なお、キャストには報酬額から20%のシステム手数料を差し引いた金額をお支払いいたします。
            </p>
          </div>
        </div>

        {/* 依頼後にキャンセルについて */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
            依頼後にキャンセルについて
          </h2>
          <p
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            }}
          >
            クライアント都合によるキャンセルが発生した場合、利用規約に基づき以下のキャンセル手数料が発生いたします。
          </p>

          {/* テーブル */}
          <div
            style={{
              backgroundColor: "black",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Noto Sans JP",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "white",
                      borderRight: "1px solid white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    解約日
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    キャンセル手数料
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderRight: "1px solid white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    当日・前日
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    料金の100％
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderRight: "1px solid white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    2日前～6日前
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    料金の70％
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderRight: "1px solid white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    7日前～13日前
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    料金の50％
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                      borderRight: "1px solid white",
                    }}
                  >
                    14日前～
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    料金の30％
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "12px",
              color: "black",
              lineHeight: "1.6",
              marginBottom: "0.5rem",
            }}
          >
            返金方法：受領した料金からキャンセル料を差し引き、ご返金いたします。
          </p>
          <p
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "12px",
              color: "#003f92",
            }}
          >
            利用規約
          </p>
        </div>

        {/* キャスト都合によるキャンセルについて */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="5"
              height="59"
              viewBox="0 0 5 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="2.5"
                y1="59"
                x2="2.5"
                stroke="#FF6D00"
                strokeWidth="5"
              />
            </svg>
            キャスト都合によるキャンセルについて
          </h2>
          <div
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              万が一キャストの都合で稼働ができなかった場合、キャンセルとなった分の料金を全額返金いたします。
            </p>
            <p>キャンセル手数料は発生いたしません。</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileUsageGuide;

