"use client";

import React from "react";
import { useRouter } from "next/navigation";
import favoriteIcon from "../TopOrder/images/favorite.png";

const ProjectDetail = () => {
    const router = useRouter();

    return (
        <div
            style={{
                backgroundColor: "#060606",
                minHeight: "0",
                paddingTop: "120px",
                paddingBottom: "0",
            }}
        >
            {/* メインコンテンツ */}
            <div
                style={{
                    backgroundColor: "white",
                    minHeight: "calc(100vh - 126px - 376px)",
                    paddingTop: "74px",
                    paddingBottom: "74px",
                }}
            >
                <div
                    style={{
                        maxWidth: "1920px",
                        margin: "0 auto",
                        padding: "0 282px",
                        position: "relative",
                    }}
                >
                    {/* プロジェクトタイトル */}
                    <h1
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "black",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            textAlign: "left",
                            margin: "0 0 20px 0",
                        }}
                    >
                        七五三祝いの写真撮影をお願いします
                    </h1>

                    {/* 会社名 */}
                    <p
                        style={{
                            fontSize: "16px",
                            color: "#333",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            margin: "0 0 20px 0",
                        }}
                    >
                        株式会社○○
                    </p>

                    {/* ステータス表示 */}
                    <div
                        style={{
                            display: "flex",
                            gap: "40px",
                            marginBottom: "50px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "40px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "16px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                応募
                            </span>
                            <span
                                style={{
                                    fontSize: "16px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                1
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "40px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "16px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                募集
                            </span>
                            <span
                                style={{
                                    fontSize: "16px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                1
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "40px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "16px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                契約
                            </span>
                            <span
                                style={{
                                    fontSize: "16px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                0
                            </span>
                        </div>
                    </div>

                    {/* 2カラムレイアウト */}
                    <div
                        style={{
                            display: "flex",
                            gap: "158px",
                            marginBottom: "60px",
                        }}
                    >
                        {/* 左側: 案件詳細 */}
                        <div
                            style={{
                                width: "600px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            {/* 報酬額 */}
                            <div>
                                <h2
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: "0 0 20px 0",
                                    }}
                                >
                                    報酬額
                                </h2>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#cf8080",
                                            color: "white",
                                            padding: "4px 12px",
                                            borderRadius: "3px",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            height: "25px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        固定報酬制
                                    </div>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                        }}
                                    >
                                        3,000円～
                                    </p>
                                </div>
                                {/* 区切り線 */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "2px",
                                        backgroundColor: "black",
                                        margin: "20px 0",
                                    }}
                                />
                            </div>

                            {/* 案件概要 */}
                            <div>
                                <h2
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: "0 0 20px 0",
                                    }}
                                >
                                    案件概要
                                </h2>
                                <div
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        lineHeight: "1.6",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <p style={{ margin: "0 0 16px 0" }}>##案件概要</p>
                                    <p style={{ margin: "0 0 16px 0" }}>
                                        例）七五三撮影を行ってくださるカメラマンを募集しております。
                                    </p>
                                    <p style={{ margin: "0 0 16px 0" }}>&nbsp;</p>
                                    <p style={{ margin: "0 0 16px 0" }}>##開催日時・場所</p>
                                    <p style={{ margin: "0 0 16px 0" }}>
                                        例）未定・東京都新宿区付近
                                    </p>
                                    <p style={{ margin: "0 0 16px 0" }}>&nbsp;</p>
                                    <p style={{ margin: "0 0 16px 0" }}>##募集人数</p>
                                    <p style={{ margin: "0 0 16px 0" }}>例）一人</p>
                                    <p style={{ margin: "0 0 16px 0" }}>&nbsp;</p>
                                    <p style={{ margin: "0 0 16px 0" }}>##その他要望</p>
                                    <p style={{ margin: "0" }}>ポートフォリオを提出ください。</p>
                                </div>
                            </div>
                        </div>

                        {/* 右側: 募集詳細 */}
                        <div
                            style={{
                                width: "600px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    margin: "0 0 20px 0",
                                }}
                            >
                                募集職種
                            </h2>
                            {/* 区切り線 */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "2px",
                                    backgroundColor: "black",
                                    margin: "0 0 20px 0",
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            width: "120px",
                                        }}
                                    >
                                        職種
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            textAlign: "center",
                                            flex: 1,
                                        }}
                                    >
                                        カメラマン
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            width: "120px",
                                        }}
                                    >
                                        年齢
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            textAlign: "center",
                                            flex: 1,
                                        }}
                                    >
                                        22歳~30歳
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            width: "120px",
                                        }}
                                    >
                                        性別
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            textAlign: "center",
                                            flex: 1,
                                        }}
                                    >
                                        女性
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            width: "120px",
                                        }}
                                    >
                                        撮影ジャンル
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            textAlign: "center",
                                            flex: 1,
                                        }}
                                    >
                                        七五三撮影
                                    </p>
                                </div>
                            </div>
                            {/* 区切り線 */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "2px",
                                    backgroundColor: "black",
                                    margin: "20px 0",
                                }}
                            />
                        </div>
                    </div>

                    {/* アクションボタン */}
                    <div
                        style={{
                            display: "flex",
                            gap: "32px",
                            justifyContent: "flex-start",
                        }}
                    >
                        <button
                            onClick={() => {
                                // 案件に応募する機能の実装
                            }}
                            style={{
                                backgroundColor: "#d70202",
                                color: "white",
                                border: "none",
                                borderRadius: "90px",
                                padding: "8px 24px",
                                fontSize: "14px",
                                fontWeight: "700",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: "pointer",
                                width: "262px",
                                height: "40px",
                            }}
                        >
                            案件に応募する
                        </button>
                        <button
                            onClick={() => {
                                // お気に入り機能の実装
                            }}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                                borderRadius: "90px",
                                padding: "8px 24px",
                                fontSize: "14px",
                                fontWeight: "700",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: "pointer",
                                width: "262px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                        >
                            <img
                                src={favoriteIcon.src}
                                alt="お気に入り"
                                style={{
                                    width: "14px",
                                    height: "14px",
                                }}
                            />
                            お気に入りに追加
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
