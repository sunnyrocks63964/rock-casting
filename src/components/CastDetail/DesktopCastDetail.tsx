"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/routers/_app";
import { trpc } from "@/lib/trpc/client";
import { useFavoriteCasters } from "@/hooks/useFavoriteCasters";

// tRPC の型推論を使用して型を取得
type RouterOutputs = inferRouterOutputs<AppRouter>;
type CasterProfileOutput = RouterOutputs["profile"]["getCasterProfile"];

const jobTypeLabels: Record<string, string> = {
    photographer: "フォトグラファー",
    model: "モデル",
    artist: "アーティスト",
    creator: "クリエイター",
};

interface DesktopCastDetailProps {
    castProfile: CasterProfileOutput;
    ordererUserId: string;
}

const DesktopCastDetail = ({ castProfile, ordererUserId }: DesktopCastDetailProps) => {
    const router = useRouter();
    const { mutate: createThread, isPending: isCreatingThread } = trpc.message.createThread.useMutation({
        onSuccess: (data) => {
            window.open(`/order/message/${data.threadId}`, "_blank");
        },
        onError: (error) => {
            console.error("スレッド作成エラー:", error);
            alert("スカウトに失敗しました: " + error.message);
        },
    });

    // お気に入り管理フック
    const { isFavorite, addFavorite, removeFavorite, isAdding, isRemoving } = useFavoriteCasters({ ordererId: ordererUserId });

    // お気に入り追加/削除処理
    const handleAddFavorite = async () => {
        if (!ordererUserId || !castProfile.user?.id) {
            return;
        }

        try {
            if (isFavorite(castProfile.user.id)) {
                await removeFavorite(castProfile.user.id);
            } else {
                await addFavorite(castProfile.user.id);
            }
        } catch (error) {
            console.error("お気に入り操作エラー:", error);
            alert("お気に入り操作に失敗しました");
        }
    };

    // お気に入り状態を判定（追加中または削除中）
    const isFavoriteOrAdding = (): boolean => {
        if (!castProfile.user?.id) {
            return false;
        }
        return isAdding(castProfile.user.id) || isRemoving(castProfile.user.id);
    };

    // お気に入りボタンのテキストを取得
    const getFavoriteButtonText = (): string => {
        if (!castProfile.user?.id) {
            return "お気に入りに追加";
        }
        if (isRemoving(castProfile.user.id)) {
            return "お気に入り解除中";
        }
        if (isAdding(castProfile.user.id)) {
            return "お気に入り追加中";
        }
        if (isFavorite(castProfile.user.id)) {
            return "お気に入り済み";
        }
        return "お気に入りに追加";
    };

    // 職種名を取得（複数の場合はカンマ区切り）
    const getJobTypeNames = (): string => {
        if (!castProfile.jobTypes || castProfile.jobTypes.length === 0) {
            return "-";
        }
        return castProfile.jobTypes
            .map((jt) => jobTypeLabels[jt.jobType] || jt.jobType)
            .join("、");
    };


    // 性別を日本語に変換するヘルパー関数
    const getGenderLabel = (): string => {
        if (!castProfile.gender) return "-";
        if (castProfile.gender === "female") return "女性";
        if (castProfile.gender === "male") return "男性";
        if (castProfile.gender === "other") return "その他";
        if (castProfile.gender === "prefer_not_to_say") return "回答しない";
        return "-";
    };

    // 生年月日をフォーマットするヘルパー関数
    const formatBirthdate = (): string => {
        if (!castProfile.birthdate) return "-";
        const birth = new Date(castProfile.birthdate);
        const year = birth.getFullYear();
        const month = String(birth.getMonth() + 1).padStart(2, "0");
        const day = String(birth.getDate()).padStart(2, "0");
        return `${year}年${month}月${day}日`;
    };

    // SNSリンクを取得するヘルパー関数
    const getSNSLinks = (): Array<{ name: string; url: string }> => {
        const links: Array<{ name: string; url: string }> = [];
        if (castProfile.snsInstagram) {
            links.push({ name: "Instagram", url: castProfile.snsInstagram });
        }
        if (castProfile.snsX) {
            links.push({ name: "X", url: castProfile.snsX });
        }
        if (castProfile.snsYoutube) {
            links.push({ name: "YouTube", url: castProfile.snsYoutube });
        }
        if (castProfile.snsFacebook) {
            links.push({ name: "Facebook", url: castProfile.snsFacebook });
        }
        return links;
    };

    // 活動形態を取得するヘルパー関数
    const getWorkStyle = (): string => {
        if (!castProfile.workStyle) return "-";
        return castProfile.workStyle;
    };

    // 活動可能エリアを取得するヘルパー関数
    const getWorkAreas = (): string => {
        if (!castProfile.workAreas || castProfile.workAreas.length === 0) {
            return "-";
        }

        // 都道府県ごとにグループ化
        const groupedByPrefecture = castProfile.workAreas.reduce<Record<string, typeof castProfile.workAreas>>(
            (acc, workArea) => {
                const prefectureId = workArea.prefecture?.id || "";
                if (!acc[prefectureId]) {
                    acc[prefectureId] = [];
                }
                acc[prefectureId].push(workArea);
                return acc;
            },
            {}
        );

        // 各都道府県の表示文字列を生成
        const prefectureStrings = Object.values(groupedByPrefecture).map((workAreas) => {
            const prefectureName = workAreas[0]?.prefecture?.name || "";
            const tokyoWards = workAreas.filter((wa) => wa.tokyoWard).map((wa) => wa.tokyoWard?.name || "");
            const cities = workAreas.filter((wa) => wa.city && !wa.tokyoWard).map((wa) => wa.city?.name || "");

            // 東京都の場合
            if (prefectureName === "東京都") {
                if (tokyoWards.length > 0) {
                    return `東京都：${tokyoWards.join("、")}`;
                }
                if (cities.length > 0) {
                    return `東京都：${cities.join("、")}`;
                }
                return "東京都";
            }

            // その他の都道府県
            if (cities.length > 0) {
                return `${prefectureName}：${cities.join("、")}`;
            }
            return prefectureName;
        });

        return prefectureStrings.join("、");
    };

    // 報酬額を取得するヘルパー関数
    const getBudgetText = (): string => {
        if (castProfile.minBudget && castProfile.maxBudget) {
            return `${castProfile.minBudget.toLocaleString()}円～${castProfile.maxBudget.toLocaleString()}円`;
        }
        if (castProfile.minBudget) {
            return `${castProfile.minBudget.toLocaleString()}円～`;
        }
        if (castProfile.maxBudget) {
            return `～${castProfile.maxBudget.toLocaleString()}円`;
        }
        return "3,000円～"; // デフォルト値
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
                                    backgroundColor: "#e5e5e5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {castProfile.mainProfileImage ? (
                                    <img
                                        src={castProfile.mainProfileImage}
                                        alt="メインプロフィール画像"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <FaUser
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            color: "#999999",
                                        }}
                                    />
                                )}
                            </div>
                            {/* サムネイル画像 */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "13px",
                                }}
                            >
                                {castProfile.subProfileImages && castProfile.subProfileImages.length > 0
                                    ? castProfile.subProfileImages.slice(0, 5).map((imageUrl, index) => (
                                          <div
                                              key={index}
                                              style={{
                                                  width: "130px",
                                                  height: "87px",
                                                  borderRadius: "10px",
                                                  backgroundColor: "#e5e5e5",
                                                  overflow: "hidden",
                                              }}
                                          >
                                              <img
                                                  src={imageUrl}
                                                  alt={`サブプロフィール画像${index + 1}`}
                                                  style={{
                                                      width: "100%",
                                                      height: "100%",
                                                      objectFit: "cover",
                                                  }}
                                              />
                                          </div>
                                      ))
                                    : Array.from({ length: 5 }).map((_, index) => (
                                          <div
                                              key={index}
                                              style={{
                                                  width: "130px",
                                                  height: "87px",
                                                  borderRadius: "10px",
                                                  backgroundColor: "#e5e5e5",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                              }}
                                          >
                                              <FaUser
                                                  style={{
                                                      width: "40px",
                                                      height: "40px",
                                                      color: "#999999",
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
                                {castProfile.bio || "-"}
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
                                        {formatBirthdate()}
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
                                        {getGenderLabel()}
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
                                        {castProfile.height ? `${castProfile.height}cm` : "-"}
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
                                        {castProfile.weight ? `${castProfile.weight}kg` : "-"}
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
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: "0",
                                            textAlign: "center",
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                        }}
                                    >
                                        {getSNSLinks().length > 0 ? (
                                            getSNSLinks().map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: "#0066cc",
                                                        textDecoration: "underline",
                                                    }}
                                                >
                                                    {link.name}
                                                </a>
                                            ))
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
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
                                        {getWorkStyle()}
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
                                        if (!castProfile.user?.id) {
                                            alert("キャスト情報が取得できませんでした");
                                            return;
                                        }
                                        createThread({
                                            ordererId: ordererUserId,
                                            casterId: castProfile.user.id,
                                        });
                                    }}
                                    disabled={isCreatingThread}
                                    style={{
                                        backgroundColor: isCreatingThread ? "#999" : "#d70202",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "90px",
                                        padding: "8px 24px",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        cursor: isCreatingThread ? "not-allowed" : "pointer",
                                        width: "262px",
                                        height: "40px",
                                    }}
                                >
                                    {isCreatingThread ? "処理中..." : "キャストをスカウトする"}
                                </button>
                                <button
                                    onClick={handleAddFavorite}
                                    disabled={isFavoriteOrAdding() || !ordererUserId || !castProfile.user?.id}
                                    style={{
                                        backgroundColor: "white",
                                        color: "black",
                                        border: "1px solid black",
                                        borderRadius: "90px",
                                        padding: "8px 24px",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        cursor: isFavoriteOrAdding() || !ordererUserId || !castProfile.user?.id ? "not-allowed" : "pointer",
                                        width: "262px",
                                        height: "40px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        opacity: isFavoriteOrAdding() || !ordererUserId || !castProfile.user?.id ? 0.6 : 1,
                                    }}
                                >
                                    {castProfile.user?.id && isFavorite(castProfile.user.id) ? (
                                        <FaBookmark
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                                fill: "#ff6d00",
                                                color: "#ff6d00",
                                            }}
                                        />
                                    ) : (
                                        <FaRegBookmark
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                            }}
                                        />
                                    )}
                                    {getFavoriteButtonText()}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* コンテンツ */}
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
                                        fontSize: "24px",
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
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {castProfile.bio || "-"}
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
                                    {castProfile.achievements ? (
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                color: "black",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                margin: "0",
                                                lineHeight: "1.6",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {castProfile.achievements}
                                        </p>
                                    ) : (
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                color: "black",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                margin: "0",
                                                lineHeight: "1.6",
                                            }}
                                        >
                                            -
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 活動可能エリアセクション */}
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
                                    活動可能エリア
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
                                    {getWorkAreas()}
                                </p>
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
                                        {getBudgetText()}
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopCastDetail;
