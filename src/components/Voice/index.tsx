"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import voiceCoverPc from "./images/voice_cover_pc.png";
import voiceCoverSp from "./images/voice_cover_sp.png";
import voice01 from "./images/voice_01.png";
import voice02 from "./images/voice02.png";

const Voice = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const voices = [
    {
      category: "マッチングした業種：",
      categoryLine2: "スクールカメラマン",
      name: "費用：",
      nameLine2: "1案件3万円",
      content:
        "弊社は年間17の業種を受託しており、大利益を上げてきました。そのクライアント側（私たちでいう外注）として、スクール様と組ませていただいたのが依頼元企業様です。弊社側としてクオリティに自信をもって行っていたわけではなく、信頼とクオリティに合わせていただいた依頼主とマッチングすることに成功してきました。プリント納品までの対応もでき、依頼元企業に対し、柔軟な姿勢を提示させて頂き常に改善の歩み寄れる関係できました。",
      profileImage: voice01,
      accent: "blue",
    },
    {
      category: "マッチングした業種：",
      categoryLine2: "広告カメラマン、モデル",
      name: "費用：",
      nameLine2: "1案件10万円",
      content:
        "初依頼の際に実生活依頼量約が高い受けてとりました。業界経験がなくカメラマンとモデルの組み合わせ依頼したが、ROCK CASTINGさんに相談したところ、急加盟先の紹介をすることで、自分たちのクライアントのニーズに合わせた実施ができました。急成長が予測されにアピーリングしてくださり、撮影から制品までご対応いただく業界にて実績高い方々をご紹介させていただきました。今回協議品としてそでてきました。当初加留がない構件でも安心して入れたお頼れました。",
      profileImage: voice02,
      accent: "default",
    },
    {
      category: "マッチングした業種：",
      categoryLine2: "カメラマン・ヘアメイク、",
      categoryLine3: "スタイリスト",
      name: "費用：",
      nameLine2: "1案件20万円",
      content:
        "写真業界での経営に大きな影響があり、スタイリスト、ヘアメイクとしてプロジェクトの成功に貢献できることができました。ROCK CASTINGさんに協働したところ、人材のマッチングだけでなく企業選定も支援しいただきました。そのおかげで最適な人材をアサインしてもらい続けるため、人材との全然の勤開闊性を送迎できました。明日も株式上アイケアなサバイバル開闢としていました。明日にとおそれるので人材のセス助からプシートップでアクシして頂けるため信頼して仕事ができました。",
      profileImage: voice01,
      accent: "default",
    },
  ];

  return (
    <section
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "2.25rem" : "3rem",
              color: "black",
              marginBottom: "1rem",
              fontFamily: "RocknRoll One",
            }}
          >
            VOICE
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4b5563",
            }}
          >
            お客様の声
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "2rem",
          }}
        >
          {voices.map((voice, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                border: `2px solid ${voice.accent === "blue" ? "#3b82f6" : "#e5e7eb"}`,
                borderRadius: "0.5rem",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* 背景画像部分 */}
              <div
                style={{
                  position: "relative",
                  height: "240px",
                  width: "100%",
                }}
              >
                <Image
                  src={isMobile ? voiceCoverSp : voiceCoverPc}
                  alt="background"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />

                {/* 左上のテキストエリア - category */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "white",
                    padding: "1rem",
                    maxWidth: "60%",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {voice.category}
                    {voice.categoryLine2 && (
                      <>
                        <br />
                        {voice.categoryLine2}
                      </>
                    )}
                    {voice.categoryLine3 && (
                      <>
                        <br />
                        {voice.categoryLine3}
                      </>
                    )}
                  </h3>
                </div>

                {/* 左下のテキストエリア - name */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    color: "white",
                    padding: "1rem",
                    maxWidth: "60%",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {voice.name}
                    {voice.nameLine2 && (
                      <>
                        <br />
                        {voice.nameLine2}
                      </>
                    )}
                  </p>
                </div>

                {/* 右側のプロフィール画像 */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "1.5rem",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid white",
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    src={voice.profileImage}
                    alt="profile"
                    width={100}
                    height={100}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              {/* コンテンツエリア */}
              <div
                style={{
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  {voice.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Voice;
