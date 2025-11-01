"use client";

import React from "react";
// 背景画像URL（Figmaから提供）
const exampleBgUrl = "https://www.figma.com/api/mcp/asset/8708ea38-8160-4178-ae10-9cc4125febb0";

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
    },
  ];

  return (
    <section
      style={{
        backgroundColor: "white",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
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
                src={exampleBgUrl}
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "40px",
                  alignItems: "start",
                }}
              >
                {/* 左側 - 案件概要 */}
                <div>
                  <div
                    style={{
                      backgroundColor: "#e5e5e5",
                      borderRadius: "5px",
                      padding: "30px",
                      marginBottom: "30px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "black",
                          textAlign: "center",
                          margin: 0,
                          flex: 1,
                        }}
                      >
                        {example.title}
                      </h4>
                    </div>
                    <div
                      style={{
                        width: "1px",
                        height: "145px",
                        backgroundColor: "black",
                        margin: "0 auto 20px",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "16px",
                        color: "black",
                        lineHeight: "1.6",
                      }}
                    >
                      {example.description}
                    </p>
                  </div>

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
                        fontSize: "20px",
                        color: "black",
                        lineHeight: "1.8",
                        paddingLeft: "30px",
                      }}
                    >
                      {example.tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
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
                      fontSize: "20px",
                      color: "black",
                      lineHeight: "1.6",
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
  );
};

export default JobExamplesSection;

