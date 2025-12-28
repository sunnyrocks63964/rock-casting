"use client";

import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import cast01 from "../Cast/images/cast_01.png";
import img11 from "./images/search_magnifying_glass.png";
import favoriteIcon from "./images/favorite.png";
import topOrderBgIcon from "./images/top_order_bg.png";

const TopOrder = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div
            style={{
                paddingTop: "146px",
                paddingBottom: "60px",
                paddingLeft: "clamp(20px, 4vw, 60px)",
                paddingRight: "clamp(20px, 4vw, 60px)",
                display: "flex",
                gap: "40px",
                maxWidth: "1920px",
                margin: "0 auto",
            }}
        >
            {/* 左側: フィルターサイドバー */}
            <aside
                style={{
                    width: "262px",
                    flexShrink: 0,
                }}
            >
                {/* フィルター */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        職種
                    </h3>
                    <div
                        style={{
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "16px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                                cursor: "pointer",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                フォトグラファー
                            </span>
                            <FaChevronRight
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                                cursor: "pointer",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                モデル
                            </span>
                            <FaChevronRight
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                                cursor: "pointer",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                アーティスト
                            </span>
                            <FaChevronRight
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                クリエイター
                            </span>
                            <FaChevronRight
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    color: "black",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 基本情報フィルター */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        基本情報
                    </h3>
                    <div
                        style={{
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "16px",
                        }}
                    >
                        {/* 年齢 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                年齢
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder=""
                                    style={{
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    ～
                                </span>
                                <input
                                    type="text"
                                    placeholder=""
                                    style={{
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {/* 身長 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                身長
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder=""
                                    style={{
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    ～
                                </span>
                                <input
                                    type="text"
                                    placeholder=""
                                    style={{
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {/* 性別 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                性別
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        男性
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        女性
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        その他
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* 対応可能時間 */}
                        <div>
                            <label
                                style={{
                                    fontSize: "11px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                対応可能時間
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        平日
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        土日祝
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        早朝対応可能
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        即日対応可能
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        深夜対応可能
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 活動可能日フィルター */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        活動可能日
                    </h3>
                    <div
                        style={{
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "16px",
                        }}
                    >
                        {/* カレンダーなどは後で実装 */}
                    </div>
                </div>

                {/* フィルターボタン */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <button
                        style={{
                            backgroundColor: "#d70202",
                            color: "white",
                            border: "none",
                            borderRadius: "90px",
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            cursor: "pointer",
                        }}
                    >
                        絞り込む
                    </button>
                    <button
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            border: "1px solid black",
                            borderRadius: "90px",
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            cursor: "pointer",
                        }}
                    >
                        リセット
                    </button>
                </div>
            </aside>

            {/* 右側: メインコンテンツ */}
            <div
                style={{
                    flex: 1,
                }}
            >
                {/* 検索バー */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                        height: "60px",
                    }}
                >
                    {/* 検索入力フィールド */}
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px 0 0 10px",
                            height: "60px",
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "20px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="フリーワードで検索"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "#d3d3d3",
                                backgroundColor: "transparent",
                            }}
                        />
                    </div>
                    {/* 検索ボタン */}
                    <button
                        style={{
                            backgroundColor: "#ff6d00",
                            border: "none",
                            borderRadius: "0 10px 10px 0",
                            width: "60px",
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src={img11.src}
                            alt="検索"
                            style={{
                                width: "30px",
                                height: "30px",
                            }}
                        />
                    </button>
                </div>
                {/* 検索結果表示 */}
                <p
                    style={{
                        fontSize: "16px",
                        color: "white",
                        textAlign: "center",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        marginBottom: "20px",
                    }}
                >
                    100件のうち、1~15件を表示
                </p>

                {/* パッケージ予約説明 */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "30px",
                        marginBottom: "20px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <img
                        src={topOrderBgIcon.src}
                        alt="パッケージ予約"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.3,
                        }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "black",
                                marginBottom: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            パッケージ予約とは？
                        </h2>
                        <p
                            style={{
                                fontSize: "16px",
                                color: "black",
                                marginBottom: "20px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                lineHeight: "1.6",
                            }}
                        >
                            同じ職種のキャストや、異なる職種のキャストを複数名まとめて予約できる機能です。システムが自動的にキャストを選出し、契約手続きまで一括で完了させます。
                        </p>
                        <button
                            style={{
                                backgroundColor: "#d70202",
                                color: "white",
                                border: "none",
                                borderRadius: "90px",
                                padding: "12px 30px",
                                fontSize: "16px",
                                fontWeight: "700",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: "pointer",
                            }}
                        >
                            パッケージ予約はこちら
                        </button>
                    </div>
                </div>

                {/* キャスト一覧 */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {Array.from({ length: 15 }).map((_, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: "20px",
                                display: "flex",
                                gap: "20px",
                            }}
                        >
                            {/* キャスト画像 */}
                            <img
                                src={cast01.src}
                                alt={`キャスト ${index + 1}`}
                                style={{
                                    width: "204px",
                                    height: "136px",
                                    borderRadius: "10px",
                                    objectFit: "cover",
                                    flexShrink: 0,
                                }}
                            />

                            {/* キャスト情報 */}
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    山田　花子
                                </h3>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    モデル
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "#333",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    自己紹介タイトル自己紹介タイトル自己紹介タイトル
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "#333",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    東京都/21歳/女性/152cm
                                </p>
                            </div>

                            {/* 右側: 価格とボタン */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "12px",
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
                                    }}
                                >
                                    固定報酬制
                                </div>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    3,000円～
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <button
                                        style={{
                                            backgroundColor: "#d70202",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "90px",
                                            padding: "8px 24px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: "pointer",
                                        }}
                                    >
                                        詳細を確認
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            border: "1px solid black",
                                            borderRadius: "90px",
                                            padding: "8px 24px",
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
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
                    ))}
                </div>

                {/* ページネーション */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "40px",
                    }}
                >
                    {[1, 2, 3, 4].map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                border: "1px solid black",
                                backgroundColor: page === currentPage ? "#ff6d00" : "white",
                                color: page === currentPage ? "white" : "black",
                                fontSize: "20px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopOrder;

