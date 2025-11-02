"use client";

import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "山田太郎",
      company: "株式会社フォトスタジオ",
      role: "クリエイティブディレクター",
      content:
        "ROCK CASTINGのおかげで、これまで見つけることが困難だった専門性の高いキャストと出会うことができました。位置情報機能も非常に便利で、撮影現場に近いプロフェッショナルをすぐに見つけられます。",
      rating: 5,
    },
    {
      name: "佐藤花子",
      company: "フリーランス",
      role: "ファッションモデル",
      content:
        "プラットフォーム内でのメッセージ機能が安全で使いやすく、クライアントとの円滑なコミュニケーションが取れています。お仕事の依頼も増えて、とても満足しています。",
      rating: 5,
    },
    {
      name: "田中次郎",
      company: "広告代理店 クリエイト",
      role: "プロデューサー",
      content:
        "パッケージ予約機能が画期的です。カメラマン、スタイリスト、モデルを一括で手配できるので、プロジェクトの管理が格段に楽になりました。コスト削減にも繋がっています。",
      rating: 5,
    },
  ];

  // 自動スクロール機能
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            お客様の声
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            ROCK CASTINGをご利用いただいているお客様からの評価
          </p>
        </div>

        {/* メインの証言カード */}
        <div className="max-w-4xl mx-auto">
          <div className="rock-border rounded-lg p-8 md:p-12 bg-gray-900/50">
            <div className="text-center mb-8">
              {/* 星評価 */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* 証言内容 */}
              <blockquote className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed italic">
                &ldquo;{testimonials[currentIndex].content}&rdquo;
              </blockquote>

              {/* 証言者情報 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-1">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-400 mb-1">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-gray-500 text-sm">
                  {testimonials[currentIndex].company}
                </p>
              </div>
            </div>
          </div>

          {/* ナビゲーションドット */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-red-500 scale-125"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
