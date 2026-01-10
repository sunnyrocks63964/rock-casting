"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { inferRouterOutputs } from "@trpc/server";
import cast01 from "../Cast/images/cast_01.png";
import favoriteIcon from "../TopOrder/images/favorite.png";
import { type AppRouter } from "@/server/routers/_app";

// tRPC の型推論を使用して型を取得
type RouterOutputs = inferRouterOutputs<AppRouter>;
type CasterProfileOutput = RouterOutputs["profile"]["getCasterProfile"];

const jobTypeLabels: Record<string, string> = {
    photographer: "フォトグラファー",
    model: "モデル",
    artist: "アーティスト",
    creator: "クリエイター",
};

interface CastDetailProps {
    castProfile: CasterProfileOutput;
}

const CastDetail = ({ castProfile }: CastDetailProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"profile" | "member">("profile");

    // 職種名を取得（複数の場合はカンマ区切り）
    const getJobTypeNames = (): string => {
        if (!castProfile.jobTypes || castProfile.jobTypes.length === 0) {
            return "-";
        }
        return castProfile.jobTypes
            .map((jt) => jobTypeLabels[jt.jobType] || jt.jobType)
            .join("、");
    };

    // 居住地を取得
    const getResidence = (): string => {
        if (castProfile.area) {
            return castProfile.area;
        }
        if (castProfile.workAreas && castProfile.workAreas.length > 0) {
            const prefecture = castProfile.workAreas[0]?.prefecture?.name;
            if (prefecture) {
                return prefecture;
            }
        }
        return "-";
    };

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
                    {/* 画像と詳細情報のセクション */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "58px",
                            marginBottom: "60px",
                        }}
                    >
                        {/* 左側: 画像ギャラリー */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "11px",
                                flexShrink: 0,
                            }}
                        >
                            {/* メイン画像 */}
                            <div
                                style={{
                                    width: "700px",
                                    height: "467px",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={cast01.src}
                                    alt="山田　花子"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            {/* サムネイル画像 */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "13px",
                                }}
                            >
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: "130px",
                                            height: "87px",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={cast01.src}
                                            alt={`サムネイル ${index + 1}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 右側: 詳細情報 */}
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                width: "600px",
                            }}
                        >
                            {/* 名前 */}
                            <h1
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    textAlign: "center",
                                    margin: "0",
                                }}
                            >
                                {castProfile.fullName || "-"}
                            </h1>

                            {/* 自己紹介タイトル */}
                            <p
                                style={{
                                    fontSize: "16px",
                                    color: "#333",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    margin: "0",
                                }}
                            >
                                {castProfile.occupation || "-"}
                            </p>

                            {/* 区切り線 */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "2px",
                                    backgroundColor: "black",
                                    margin: "0",
                                }}
                            />

                            {/* プロフィール情報 */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
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
                                            width: "100px",
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
                                        {getJobTypeNames()}
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
                                            width: "100px",
                                        }}
                                    >
                                        居住地
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
                                        {getResidence()}
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
                                            width: "100px",
                                        }}
                                    >
                                        生年月日
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
                                        -
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
                                            width: "100px",
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
                                        -
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
                                            width: "100px",
                                        }}
                                    >
                                        身長
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
                                        -
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
                                            width: "100px",
                                        }}
                                    >
                                        体重
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
                                        -
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
                                            width: "100px",
                                        }}
                                    >
                                        SNS
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
                                        -
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
                                            width: "100px",
                                        }}
                                    >
                                        活動形態
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
                                        -
                                    </p>
                                </div>
                            </div>

                            {/* 区切り線 */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "2px",
                                    backgroundColor: "black",
                                    margin: "0",
                                }}
                            />

                            {/* アクションボタン */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "32px",
                                    marginTop: "10px",
                                }}
                            >
                                <button
                                    onClick={() => {
                                        // スカウト機能の実装
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
                                    キャストをスカウトする
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

                    {/* タブ */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "340px",
                            marginBottom: "35px",
                            borderBottom: "none",
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={() => setActiveTab("profile")}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                padding: "0",
                                cursor: "pointer",
                                position: "relative",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    margin: "0 0 10px 0",
                                }}
                            >
                                プロフィール
                            </p>
                            {activeTab === "profile" && (
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        margin: "0 auto",
                                        width: "150px",
                                        height: "4px",
                                        backgroundColor: "#ff6d00",
                                        marginBottom: "-4px",
                                    }}
                                />
                            )}
 
                        </button>
                        <button
                            onClick={() => setActiveTab("member")}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                padding: "0",
                                cursor: "pointer",
                                position: "relative",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    margin: "0 0 10px 0",
                                }}
                            >
                                会員限定情報
                            </p>
                            {activeTab === "member" && (
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "55%",
                                        transform: "translateX(-50%)",
                                        margin: "0 auto",
                                        width: "160px",
                                        height: "4px",
                                        backgroundColor: "#ff6d00",
                                        marginBottom: "-4px",
                                    }}
                                />
                            )}
                        </button>
                    </div>

                    {/* タブコンテンツ */}
                    {activeTab === "profile" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "40px",
                                maxWidth: "1358px",
                                margin: "0 auto",
                            }}
                        >
                            {/* プロフィールセクション */}
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
                                    プロフィール
                                </h2>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: "0",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    {castProfile.occupation || "-"}
                                </p>
                            </div>

                            {/* 職種・スキルセクション */}
                            {castProfile.jobTypes && castProfile.jobTypes.length > 0 && (
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
                                        職種・スキル
                                    </h2>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "30px",
                                        }}
                                    >
                                        {castProfile.jobTypes.map((jobType) => (
                                            <div key={jobType.id}>
                                                <h3
                                                    style={{
                                                        fontSize: "18px",
                                                        fontWeight: "700",
                                                        color: "black",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                        margin: "0 0 15px 0",
                                                    }}
                                                >
                                                    {jobTypeLabels[jobType.jobType] || jobType.jobType}
                                                </h3>
                                                {jobType.skills && jobType.skills.length > 0 ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "12px",
                                                        }}
                                                    >
                                                        {Object.entries(
                                                            jobType.skills.reduce<Record<string, string[]>>(
                                                                (acc, skill) => {
                                                                    if (!acc[skill.category]) {
                                                                        acc[skill.category] = [];
                                                                    }
                                                                    acc[skill.category].push(skill.value);
                                                                    return acc;
                                                                },
                                                                {}
                                                            )
                                                        ).map(([category, values]) => (
                                                            <div key={category}>
                                                                <p
                                                                    style={{
                                                                        fontSize: "16px",
                                                                        fontWeight: "700",
                                                                        color: "black",
                                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                                        margin: "0 0 8px 0",
                                                                    }}
                                                                >
                                                                    {category}
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        fontSize: "16px",
                                                                        color: "black",
                                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                                        margin: "0",
                                                                        lineHeight: "1.6",
                                                                    }}
                                                                >
                                                                    {values.join("、")}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p
                                                        style={{
                                                            fontSize: "16px",
                                                            color: "black",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                            margin: "0",
                                                        }}
                                                    >
                                                        -
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 実績セクション */}
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
                                    実績
                                </h2>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px",
                                    }}
                                >
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index}>
                                            <p
                                                style={{
                                                    fontSize: "16px",
                                                    color: "black",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    margin: "0",
                                                    lineHeight: "1.6",
                                                }}
                                            >
                                                振袖新ブランド「FURICO」<br />
                                                Hermes / Magic Snowflakes
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 報酬額セクション */}
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
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "40px",
                                maxWidth: "1357px",
                                margin: "0 auto",
                            }}
                        >
                            {/* 注意事項セクション */}
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
                                    注意事項
                                </h2>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: "0",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    こちらは会員限定情報になります。<br />
                                    内容を確認したい場合はログインを行う必要があります。
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        gap: "32px",
                                        marginTop: "40px",
                                    }}
                                >
                                    <button
                                        onClick={() => router.push("/user_register")}
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
                                        新規登録はこちら
                                    </button>
                                    <button
                                        onClick={() => router.push("/login")}
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
                                        }}
                                    >
                                        ログインはこちら
                                    </button>
                                </div>
                            </div>

                            {/* レビューセクション */}
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
                                    レビュー
                                </h2>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: "0",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    こちらは会員限定情報になります。<br />
                                    内容を確認したい場合はログインを行う必要があります。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CastDetail;
