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
    width="118"
    height="50"
    viewBox="0 0 118 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M59 50L0 0H118L59 50Z" fill="white" />
  </svg>
);

const DesktopOrderWork = () => {
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
        style={{ position: "relative", height: "408px", overflow: "hidden" }}
      >
        {/* 背景画像 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "408px",
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
            height: "408px",
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
            padding: "0 20px",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "clamp(16px, 2vw, 24px)",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              marginBottom: "20px",
            }}
          >
            \必要な人材を、必要なタイミングで。/
          </p>
          <h1
            style={{
              color: "white",
              fontSize: "clamp(24px, 4vw, 48px)",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              marginBottom: "30px",
              lineHeight: "1.4",
              maxWidth: "992px",
              margin: "0 auto 30px",
            }}
          >
            撮影・制作の現場を支えるクリエイターが、すぐに見つかる。
          </h1>
          <a
            href="/register"
            style={{
              display: "inline-block",
              backgroundColor: "#d70202",
              color: "white",
              padding: "20px 50px",
              borderRadius: "90px",
              textDecoration: "none",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b00101";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#d70202";
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
          padding: "clamp(40px, 8vw, 80px) 20px",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "RocknRoll One, sans-serif",
              fontSize: "clamp(32px, 5vw, 55px)",
              color: "black",
              marginBottom: "10px",
            }}
          >
            Various users
          </h2>
          <p
            style={{
              fontFamily: "Noto Sans JP, sans-serif",
              fontSize: "clamp(16px, 1.8vw, 20px)",
              color: "black",
              marginBottom: "clamp(40px, 6vw, 60px)",
            }}
          >
            様々な方にご利用いただけます
          </p>

          {/* タブ */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              marginBottom: "clamp(30px, 5vw, 50px)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                backgroundColor: "#2c2c2c",
                color: "white",
                padding: "clamp(15px, 2vw, 25px) clamp(40px, 8vw, 80px)",
                borderRadius: "30px",
                fontSize: "clamp(18px, 2vw, 24px)",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                cursor: "pointer",
              }}
            >
              個人の方
            </div>
            <div
              style={{
                backgroundColor: "#2c2c2c",
                color: "white",
                padding: "clamp(15px, 2vw, 25px) clamp(40px, 8vw, 80px)",
                borderRadius: "30px",
                fontSize: "clamp(18px, 2vw, 24px)",
                fontWeight: "700",
                fontFamily: "Noto Sans JP, sans-serif",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                cursor: "pointer",
              }}
            >
              法人の方
            </div>
          </div>

          {/* コンテンツエリア */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(30px, 5vw, 50px)",
              textAlign: "left",
            }}
          >
            {/* 個人の方 */}
            <div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "clamp(16px, 2vw, 24px)",
                  fontFamily: "Noto Sans JP, sans-serif",
                  color: "#0b0b0b",
                  lineHeight: "1.95",
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

            {/* 法人の方 */}
            <div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "clamp(16px, 2vw, 24px)",
                  fontFamily: "Noto Sans JP, sans-serif",
                  color: "#0b0b0b",
                  lineHeight: "1.95",
                }}
              >
                <li style={{ marginBottom: "15px" }}>
                  ・広告・カタログ・CM撮影で、モデルやスタイリストを手配したい
                </li>
                <li style={{ marginBottom: "15px" }}>
                  ・会社のホームページや採用動画の制作を依頼したい
                </li>
                <li style={{ marginBottom: "15px" }}>
                  ・新商品のPR撮影・SNSコンテンツ用素材をまとめて撮りたい
                </li>
                <li style={{ marginBottom: "15px" }}>
                  ・撮影から編集まで、ワンストップで依頼したい
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* お悩みセクション */}
      <section
        style={{
          backgroundColor: "white",
          padding: "20px 100px",
        }}
      >
        <div
          style={{
            maxWidth: "1680px",
            margin: "0 auto",
            backgroundColor: "#2c2c2c",
            borderRadius: "30px",
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: "700",
              fontFamily: "Noto Sans JP, sans-serif",
              textAlign: "center",
              marginBottom: "clamp(40px, 6vw, 60px)",
            }}
          >
            このような<span style={{ color: "#fead50" }}>お悩み</span>
            ありませんか？
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(15px, 2vw, 20px)",
              marginBottom: "clamp(40px, 6vw, 60px)",
              maxWidth: "900px",
              margin: "0 auto clamp(40px, 6vw, 60px)",
            }}
          >
            {/* 左列 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px, 1.5vw, 15px)",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  信頼できるカメラマンが見つからない
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  クラウドソーシングでは値段やクオリティがわからない
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  希望日に撮影できる人がいない
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  急な予定変更に柔軟に対応してもらえる人を探したい
                </p>
              </div>
            </div>

            {/* 右列 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px, 1.5vw, 15px)",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  毎回違うカメラマンを探すのが大変
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  事務所経由だと費用が高い
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  案件ごとのキャスティングは手間がかかる
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "30px",
                  padding: "clamp(10px, 1.2vw, 15px) clamp(15px, 2vw, 20px)",
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
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    fontFamily: "Noto Sans JP, sans-serif",
                    fontWeight: "400",
                    color: "black",
                    lineHeight: "1.4",
                  }}
                >
                  クオリティにばらつきがあり、統一感が出ない
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ロックキャスティングを利用すればセクション */}
      <section
        style={{
          backgroundColor: "#060606",
          padding: "45px 20px",
          position: "relative",
        }}
      >
        {/* 矢印 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            transform: "translateY(-50px)",
          }}
        >
          <div style={{ width: "clamp(50px, 8vw, 118px)", height: "auto" }}>
            <ArrowDownIcon />
          </div>
        </div>

        {/* 解決メッセージ */}
        <h2
          style={{
            color: "white",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: "700",
            fontFamily: "Noto Sans JP, sans-serif",
            textAlign: "center",
            marginBottom: "clamp(60px, 8vw, 100px)",
          }}
        >
          ロックキャスティングを利用すれば
        </h2>

        {/* メリットカード */}
        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(30px, 4vw, 50px)",
          }}
        >
          {/* メリット01 */}
          <div
            style={{
              height: "350px",
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "0 40px clamp(25px, 3vw, 35px)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-30px",
                left: "clamp(15px, 2vw, 20px)",
                fontSize: "clamp(32px, 4vw, 48px)",
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
                marginTop: "clamp(40px, 5vw, 50px)",
                marginBottom: "clamp(20px, 3vw, 30px)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
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
                width: "clamp(80px, 12vw, 120px)",
                height: "clamp(80px, 12vw, 120px)",
                margin: "0 auto clamp(20px, 3vw, 30px)",
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
                fontSize: "clamp(13px, 1.5vw, 16px)",
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
              height: "350px",
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "0 40px clamp(25px, 3vw, 35px)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-30px",
                left: "clamp(15px, 2vw, 20px)",
                fontSize: "clamp(32px, 4vw, 48px)",
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
                marginTop: "clamp(40px, 5vw, 50px)",
                marginBottom: "clamp(20px, 3vw, 30px)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
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
                width: "clamp(80px, 12vw, 120px)",
                height: "clamp(80px, 12vw, 120px)",
                margin: "0 auto clamp(20px, 3vw, 30px)",
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
                fontSize: "clamp(13px, 1.5vw, 16px)",
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
              height: "350px",
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "0 40px clamp(25px, 3vw, 35px)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-30px",
                left: "clamp(15px, 2vw, 20px)",
                fontSize: "clamp(32px, 4vw, 48px)",
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
                marginTop: "clamp(40px, 5vw, 50px)",
                marginBottom: "clamp(20px, 3vw, 30px)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
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
                width: "clamp(80px, 12vw, 120px)",
                height: "clamp(80px, 12vw, 120px)",
                margin: "0 auto clamp(20px, 3vw, 30px)",
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
                fontSize: "clamp(13px, 1.5vw, 16px)",
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
              height: "350px",
              position: "relative",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "0 40px clamp(25px, 3vw, 35px)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                position: "absolute",
                top: "-30px",
                left: "clamp(15px, 2vw, 20px)",
                fontSize: "clamp(32px, 4vw, 48px)",
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
                marginTop: "clamp(40px, 5vw, 50px)",
                marginBottom: "clamp(20px, 3vw, 30px)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
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
                width: "clamp(80px, 12vw, 120px)",
                height: "clamp(80px, 12vw, 120px)",
                margin: "0 auto clamp(20px, 3vw, 30px)",
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
                fontSize: "clamp(13px, 1.5vw, 16px)",
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

export default DesktopOrderWork;

