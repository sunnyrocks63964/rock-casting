"use client";

import React, { useState, useEffect, useRef } from "react";

const MobileJobExamplesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // 7秒ごとに自動スライド
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [examples.length]);

  // スライドのスクロール処理
  useEffect(() => {
    if (carouselRef.current) {
      const scrollLeft = currentIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      style={{
        backgroundColor: "black",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        {/* タイトル */}
        <h2
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "28px",
            fontWeight: "normal",
            color: "white",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Example
        </h2>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            color: "white",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          依頼事例
        </p>

        {/* カルーセル */}
        <div
          ref={carouselRef}
          style={{
            display: "flex",
            overflowX: "hidden",
            scrollSnapType: "x mandatory",
            width: "100%",
            marginBottom: "1rem",
            padding: "0 16px",
          }}
        >
          {examples.map((example, index) => (
            <div
              key={example.id}
              style={{
                flex: "0 0 100%",
                scrollSnapAlign: "center",
                padding: "0 5px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#e5e5e5",
                  borderRadius: "30px",
                  padding: "30px 20px",
                  maxWidth: "344px",
                  margin: "0 auto",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* カテゴリー */}
                <h3
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  {example.category}
                </h3>

                {/* タイトル */}
                <h4
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  {example.title}
                </h4>

                {/* 区切り線 */}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "black",
                    marginBottom: "20px",
                  }}
                />

                {/* 説明文 */}
                <p
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontSize: "16px",
                    color: "black",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                  }}
                >
                  {example.description}
                </p>

                {/* 対応内容 */}
                <div style={{ marginBottom: "20px" }}>
                  <h5
                    style={{
                      fontFamily: "Noto Sans JP",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: "10px",
                      textAlign: "center",
                    }}
                  >
                    対応内容
                  </h5>
                  <ul
                    style={{
                      fontFamily: "Noto Sans JP",
                      fontSize: "16px",
                      color: "black",
                      lineHeight: "1.6",
                      paddingLeft: "20px",
                      margin: 0,
                    }}
                  >
                    {example.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>

                {/* 報酬 */}
                <div>
                  <h5
                    style={{
                      fontFamily: "Noto Sans JP",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: "10px",
                      textAlign: "center",
                    }}
                  >
                    報酬
                  </h5>
                  <p
                    style={{
                      fontFamily: "Noto Sans JP",
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
          ))}
        </div>

        {/* インジケーター */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: currentIndex === index ? "#6b7280" : "#d1d5db",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileJobExamplesSection;

