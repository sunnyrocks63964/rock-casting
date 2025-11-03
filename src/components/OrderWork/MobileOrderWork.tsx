"use client";

import React from "react";
import Image from "next/image";
import heroImage from "./images/order-work_kv.png";
import merit01Image from "./images/request-a-job_merit01.png";
import merit02Image from "./images/request-a-job_merit02.png";
import merit03Image from "./images/request-a-job_merit03.png";
import merit04Image from "./images/request-a-job_merit04.png";

// SVGコンポーネント
const CheckIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.8333 5L7.08333 14L3 9.81818"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    width="60"
    height="25"
    viewBox="0 0 118 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M59 50L0 0H118L59 50Z" fill="white" />
  </svg>
);

const MobileOrderWork = () => {
  return (
    <div
      style={{
        backgroundColor: "#060606",
        position: "relative",
        width: "100%",
      }}
    >
      {/* ヒーローセクション */}
      <section
        style={{ position: "relative", height: "300px", overflow: "hidden" }}
      >
        {/* 背景画像 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "300px",
            zIndex: 0,
          }}
        >
          <Image
            src={heroImage}
            alt="Hero Background"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* オーバーレイ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "300px",
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            zIndex: 1,
          }}
        />

        {/* ヒーローコンテンツ */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 2,
            width: "100%",
            padding: "0 16px",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              marginBottom: "15px",
            }}
          >
            \必要な人材を、必要なタイミングで。/
          </p>
          <h1
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              marginBottom: "25px",
              lineHeight: "1.4",
            }}
          >
            撮影・制作の現場を支える
            <br />
            クリエイターが、すぐに見つかる。
          </h1>
          <a
            href="/register"
            style={{
              display: "inline-block",
              backgroundColor: "#d70202",
              color: "white",
              padding: "14px 32px",
              borderRadius: "90px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
            }}
          >
            新規登録はこちら
          </a>
        </div>
      </section>

      {/* Various users セクション */}
      <section
        style={{
          backgroundColor: "white",
          padding: "40px 16px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "RocknRoll One, sans-serif",
              fontSize: "28px",
              color: "black",
              marginBottom: "0.5rem",
              fontWeight: "normal",
            }}
          >
            Various users
          </h2>
          <p
            style={{
              fontFamily: "Noto Sans JP, sans-serif",
              fontSize: "12px",
              color: "black",
              marginBottom: "2rem",
            }}
          >
            様々な方にご利用いただけます
          </p>

          {/* タブ */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                backgroundColor: "#2c2c2c",
                color: "white",
                padding: "15px 45px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              個人の方
            </div>
          </div>

          {/* コンテンツエリア */}
          <div style={{ textAlign: "left" }}>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "16px",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "#0b0b0b",
                lineHeight: "1.8",
              }}
            >
              <li style={{ marginBottom: "15px" }}>
                ・SNS・YouTube・宣材用の撮影をプロにお願いしたい
              </li>
              <li style={{ marginBottom: "15px" }}>
                ・結婚式やイベントでの出張カメラマンを探したい
              </li>
              <li style={{ marginBottom: "15px" }}>
                ・七五三・成人式・家族写真などの記念撮影に
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* お悩みセクション */}
      <section
        style={{
          backgroundColor: "white",
          padding: "20px 16px 40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#2c2c2c",
            borderRadius: "30px",
            padding: "40px 20px",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            このような
            <span style={{ color: "#fead50" }}>お悩み</span>
            <br />
            ありませんか？
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[
              "信頼できるカメラマンが見つからない",
              "クラウドソーシングでは値段やクオリティがわからない",
              "希望日に撮影できる人がいない",
              "急な予定変更に柔軟に対応してもらえる人を探したい",
            ].map((text, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ロックキャスティングを利用すればセクション */}
      <section
        style={{
          backgroundColor: "#060606",
          padding: "25px 40px",
          position: "relative",
        }}
      >
        {/* 矢印 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-30px)",
          }}
        >
          <div style={{ width: "60px", height: "auto" }}>
            <ArrowDownIcon />
          </div>
        </div>

        {/* 解決メッセージ */}
        <h2
          style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "700",
            fontFamily: "Noto Sans JP, sans-serif",
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          ロックキャスティングを
          <br />
          利用すれば
        </h2>

        {/* メリットカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "60px",
          }}
        >
          {/* メリット01 */}
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 20px 30px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-25px",
                left: "20px",
                fontSize: "40px",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "#fead50",
                margin: 0,
                lineHeight: 1,
              }}
            >
              01
            </p>
            <div
              style={{
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans JP, sans-serif",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                費用削減
              </h3>
              <div
                style={{
                  width: "100px",
                  height: "3px",
                  backgroundColor: "#767676",
                  borderRadius: "2px",
                  margin: "0 auto",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 25px",
                position: "relative",
              }}
            >
              <Image
                src={merit01Image}
                alt="費用削減"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "black",
                lineHeight: "1.6",
                margin: 0,
                textAlign: "center",
              }}
            >
              事務所手数料をカットし、フリーランスと直接契約。コストを抑えて依頼できます。
            </p>
          </div>

          {/* メリット02 */}
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 20px 30px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-25px",
                left: "20px",
                fontSize: "40px",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "#fead50",
                margin: 0,
                lineHeight: 1,
              }}
            >
              02
            </p>
            <div
              style={{
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans JP, sans-serif",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                スピード対応
              </h3>
              <div
                style={{
                  width: "100px",
                  height: "3px",
                  backgroundColor: "#767676",
                  borderRadius: "2px",
                  margin: "0 auto",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 25px",
                position: "relative",
              }}
            >
              <Image
                src={merit02Image}
                alt="スピード対応"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "black",
                lineHeight: "1.6",
                margin: 0,
                textAlign: "center",
              }}
            >
              登録クリエイター100名以上。最短翌日でのアサインも可能です。
            </p>
          </div>

          {/* メリット03 */}
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 20px 30px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-25px",
                left: "20px",
                fontSize: "40px",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "#fead50",
                margin: 0,
                lineHeight: 1,
              }}
            >
              03
            </p>
            <div
              style={{
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans JP, sans-serif",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                品質保証
              </h3>
              <div
                style={{
                  width: "100px",
                  height: "3px",
                  backgroundColor: "#767676",
                  borderRadius: "2px",
                  margin: "0 auto",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 25px",
                position: "relative",
              }}
            >
              <Image
                src={merit03Image}
                alt="品質保証"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "black",
                lineHeight: "1.6",
                margin: 0,
                textAlign: "center",
              }}
            >
              スキル・実績・人柄を評価し、厳選したプロのみが在籍。
            </p>
          </div>

          {/* メリット04 */}
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 20px 30px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-25px",
                left: "20px",
                fontSize: "40px",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "#fead50",
                margin: 0,
                lineHeight: 1,
              }}
            >
              04
            </p>
            <div
              style={{
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans JP, sans-serif",
                  color: "black",
                  marginBottom: "10px",
                }}
              >
                エリアマッチング
              </h3>
              <div
                style={{
                  width: "100px",
                  height: "3px",
                  backgroundColor: "#767676",
                  borderRadius: "2px",
                  margin: "0 auto",
                }}
              />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 25px",
                position: "relative",
              }}
            >
              <Image
                src={merit04Image}
                alt="エリアマッチング"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "Noto Sans JP, sans-serif",
                color: "black",
                lineHeight: "1.6",
                margin: 0,
                textAlign: "center",
              }}
            >
              登録エリアをもとに近隣クリエイターを自動提案。移動コストを最小限に。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileOrderWork;

