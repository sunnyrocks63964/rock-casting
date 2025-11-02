"use client";

import React from "react";
import categoryImage from "./images/get-a-job_example.png";
import exampleBgImage from "./images/get-a-job_example-bg.png";

const JobExamplesSection = () => {
  const examples = [
    {
      id: 1,
      category: "フォトグラファー",
      title: "レストランのグランドメニュー撮影",
      description:
        "都内のイタリアンレストランがグランドメニューのリニューアルに伴い、料理写真の撮影を依頼したいとのことでした。担当の方と事前に打ち合わせをして、店舗の雰囲気やターゲット層を確認でき、撮影イメージもすり合わせられたので、自信を持って対応できると判断しました。",
      tasks: [
        "店舗での料理撮影（半日、約20品目）",
        "自然光を活かしたスタイリング撮影",
        "基本的なレタッチ・色調整",
        "事前に店舗訪問・ロケハン（30分程度）",
        "撮影後3日以内にJPEGデータ納品",
      ],
      payment: "60,000円（半日・レタッチ込み、交通費別途）",
      bgImage: exampleBgImage,
    },
    {
      id: 2,
      category: "スタイリスト",
      title: "ファッション誌の特集撮影スタイリング",
      description:
        "女性向けファッション誌の秋冬特集で、スタイリングの依頼がありました。自分が得意とするテイストだったので応募したところ、担当の方から丁寧にブランドの方向性や予算感を教えていただき、自分のこれまでの実績とも合致していると感じました。スケジュールも事前に調整できたので、準備期間を十分に取って臨むことができました。",
      tasks: [
        "撮影1日分のスタイリング（5〜6パターン）",
        "事前の衣装リサーチ・レンタル手配",
        "撮影当日の衣装管理・着替えサポート",
        "小物・アクセサリーのコーディネート",
        "撮影後の衣装返却業務",
      ],
      payment: "80,000円（衣装レンタル費別途、交通費込み）",
      bgImage: exampleBgImage,
    },
    {
      id: 3,
      category: "ヘアメイク",
      title: "ブライダル前撮り撮影のヘアメイク",
      description:
        "結婚式の前撮り撮影で、ナチュラルで上品なブライダルヘアメイクができる方を探しているとのことでした。ブライダルは自分の得意分野で、お客様の大切な日に関われる仕事なのでやりがいを感じ応募しました。担当の方から撮影のコンセプトや新婦様の希望を事前に共有していただけたので、安心して準備できました。",
      tasks: [
        "新婦様のヘアメイク（和装・洋装の2パターン）",
        "事前にオンラインで新婦様とイメージ共有（30分）",
        "撮影中のヘアメイク直し・タッチアップ",
        "撮影時間：約4時間",
      ],
      payment: "50,000円（2パターン、交通費別途）",
      bgImage: exampleBgImage,
    },
  ];

  return (
    <>
      {/* Example見出し */}
      <div
        style={{
          backgroundColor: "black",
          padding: "30px 0px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "55px",
            fontWeight: "400",
            color: "white",
            fontFamily: "'RocknRoll One', sans-serif",
            margin: 0,
            lineHeight: "normal",
          }}
        >
          Example
        </h2>
        <p
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "white",
            margin: 0,
            lineHeight: "normal",
          }}
        >
          依頼事例
        </p>
      </div>

      {/* カテゴリーアイコンセクション */}
      <section
        style={{
          backgroundColor: "black",
          padding: "80px 20px",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* カテゴリー画像 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={categoryImage?.src || "/placeholder.jpg"}
              alt="職種カテゴリー"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </section>

      {/* 案件例セクション */}
      <section
        style={{
          backgroundColor: "black",
          padding: "80px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {examples.map((example) => (
            <div
              key={example.id}
              style={{
                borderRadius: "30px",
                overflow: "hidden",
                marginBottom: "40px",
                position: "relative",
              }}
            >
              {/* 背景画像 */}
              <div
                style={{
                  height: "609px",
                  borderRadius: "30px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={example.bgImage?.src || "/placeholder.jpg"}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </div>

              {/* コンテンツ */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "1214px",
                }}
              >
                {/* カテゴリー */}
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "black",
                    textAlign: "center",
                    marginBottom: "30px",
                  }}
                >
                  {example.category}
                </h3>

                {/* タイトルと説明の灰色ボックス */}
                <div
                  style={{
                    backgroundColor: "#e5e5e5",
                    borderRadius: "5px",
                    padding: "30px",
                    marginBottom: "30px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "stretch",
                  }}
                >
                  {/* 左側 - タイトル */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      minWidth: "280px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "black",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      {example.title}
                    </h4>
                  </div>

                  {/* 縦の区切り線 */}
                  <div
                    style={{
                      width: "1px",
                      backgroundColor: "black",
                      flexShrink: 0,
                    }}
                  />

                  {/* 右側 - 説明文 */}
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        color: "black",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {example.description}
                    </p>
                  </div>
                </div>

                {/* 対応内容と報酬 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "40px",
                    alignItems: "start",
                  }}
                >
                  {/* 左側 - 対応内容 */}
                  <div>
                    <h5
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      対応内容
                    </h5>
                    <ul
                      style={{
                        fontSize: "16px",
                        color: "black",
                        lineHeight: "1.8",
                        paddingLeft: "20px",
                        margin: 0,
                      }}
                    >
                      {example.tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 右側 - 報酬 */}
                  <div>
                    <h5
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      報酬
                    </h5>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "black",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {example.payment}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default JobExamplesSection;
