"use client";

import React from "react";

const DesktopUsageGuide = () => {
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
              fontFamily: "RocknRoll One",
            }}
          >
            Usage fee
          </h1>
          <p
            style={{
              fontSize: "1rem",
            }}
          >
            ご利用料金について
          </p>
        </div>

        {/* 説明文 */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}
        >
          1つのプロジェクトにかかる料金は、以下の通りです。
        </p>

        {/* タブ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2rem",
            width: "80%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            キャストへの報酬
          </div>

          <svg
            width="73"
            height="73"
            viewBox="0 0 73 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <circle
              cx="36.4999"
              cy="36.5"
              r="25"
              transform="rotate(-45 36.4999 36.5)"
              fill="black"
              stroke="white"
            />
            <line
              x1="25.8934"
              y1="46.3995"
              x2="46.3995"
              y2="25.8934"
              stroke="white"
              strokeWidth="4"
            />
            <line
              x1="47.8138"
              y1="47.1066"
              x2="27.3077"
              y2="26.6005"
              stroke="white"
              strokeWidth="4"
            />
          </svg>

          <div
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            キャストへの人数（+消費税）
          </div>
        </div>

        {/* 注意書き */}
        <div
          style={{
            padding: "30px 0",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
            lineHeight: "1.8",
          }}
        >
          <p>
            アカウント登録時キャストとのやりとりなどは、無料日一切費用はかかりません。
          </p>
          <p style={{ marginBottom: "1rem" }}>
            キャストからの契約が完了し、委託契約が成立するまでは、料金をお支払いする必要があります。
          </p>
          <p style={{ marginLeft: "2rem" }}>
            キャストと相談した結果、依頼に至らなかった場合、料金は発生しないのでご安心ください。
          </p>
          <p style={{ marginLeft: "2rem" }}>
            すべての支払いはロックキャスティングにて一元管理され、源泉徴収税の納付や支払調書の作成といった手間も必要ありません。
          </p>
          <p style={{ marginLeft: "2rem" }}>
            支払にかかる煩雑な事務処理を省いてキャストを起用していただけます。
          </p>
        </div>

        {/* 利用料金 */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              paddingBottom: "0.5rem",
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
              fontSize: "0.9rem",
              lineHeight: "1.8",
            }}
          >
            発注者様には、キャスト報酬のみをお支払いいただきます。
          </p>
          <div
            style={{
              padding: "10px 0",
              borderRadius: "0.5rem",
            }}
          >
            <p style={{ fontSize: "0.9rem" }}>
              （例）
              <br />
              キャスト1名
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: "1.8",
                marginBottom: "10px",
              }}
            >
              報酬額30,000円の場合
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
              発注者様のお支払い額：30,000円 + 消費税 = 33,000円
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
              （キャスト受取額：24,000円
              ※報酬から20%のシステム手数料を差し引き）
            </p>
          </div>
        </div>

        {/* 決済方法 */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              paddingBottom: "0.5rem",
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
              fontSize: "0.9rem",
              lineHeight: "1.8",
              marginTop: "1rem",
            }}
          >
            決済方法は以下から指定いただけます。
          </p>
          <ul
            style={{
              paddingLeft: "1.5rem",
              fontSize: "0.9rem",
              lineHeight: "1.8",
            }}
          >
            <li>クレジットカード</li>
            <li>銀行振込</li>
          </ul>
        </div>

        {/* キャストへの報酬の支払い */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
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
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
              marginBottom: "1rem",
            }}
          >
            キャストへの報酬は、自由にご設定いただけます。
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
              marginBottom: "1rem",
            }}
          >
            キャストとご相談いただいたうえで、両者にご納得いただける報酬をお決めください。
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
              marginBottom: "1rem",
            }}
          >
            ロックキャスティングを通じて稼働したキャストへの報酬は、弊社を通じてキャストへお支払いします（報酬支払いの際には、税法に基づく源泉徴収を行います）。
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
              marginBottom: "1rem",
            }}
          >
            ご依頼後にキャスト報酬の減額はできません。もし減額される場合、再度オファーを作成していただく必要があります。
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
            }}
          >
            なお、キャストには報酬額から20%のシステム手数料を差し引いた金額をお支払いいたします。
          </p>
        </div>

        {/* 依頼日にキャンセルについて */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
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
            依頼日にキャンセルについて
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
              marginTop: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            クライアント希望にによるキャンセルが発生した場合は、契約時にキャンセル手数料が発生いたします。
          </p>

          {/* テーブル */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "0.5rem",
              overflow: "hidden",
              width: "80%",
              margin: "0 auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#000000", color: "white" }}>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      borderRight: "1px solid #333",
                    }}
                  >
                    解約日
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    キャンセル手数料
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "white" }}>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #ddd",
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    当日・前日
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    料金の30%
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #ddd",
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    2日前～6日前
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    料金の70%
                  </td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #ddd",
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    7日前～13日前
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    料金の90%
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      borderRight: "1px solid #ddd",
                    }}
                  >
                    14日前～
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    料金の99%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#666",
              marginTop: "1rem",
              lineHeight: "1.6",
              width: "80%",
              margin: "0 auto",
            }}
          >
            返金方法：受領した料金からキャンセル料を差し引き、ご返金いたします。
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#666",
              marginTop: "0.5rem",
              width: "80%",
              margin: "0 auto",
            }}
          >
            利用規約
          </p>
        </div>

        {/* キャスト都合によるキャンセルについて */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              paddingBottom: "0.5rem",
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
            キャスト都合によるキャンセルについて
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
            }}
          >
            万が一キャストの都合で稼働ができなかった場合、キャンセルとなった分の料金を全額返金いたします。
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.8",
            }}
          >
            キャンセル手数料は発生いたしません。
          </p>
        </div>
      </div>
    </section>
  );
};

export default DesktopUsageGuide;

