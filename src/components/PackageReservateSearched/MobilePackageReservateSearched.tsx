"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaRegBookmark, FaBookmark, FaRedo } from "react-icons/fa";
import { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc/client";
import { useFavoriteCasters } from "@/hooks/useFavoriteCasters";
import { type AppRouter } from "@/server/routers/_app";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type CasterListOutput = RouterOutputs["profile"]["getCasterList"];
type Caster = CasterListOutput["casters"][number];
type CasterProfile = NonNullable<Caster["casterProfile"]>;
type JobTypeWithSkills = CasterProfile["jobTypes"][number];
type WorkAreaWithRelations = CasterProfile["workAreas"][number];

type ProfessionType =
    | "photographer"
    | "model"
    | "stylist"
    | "hair_makeup"
    | "video_creator"
    | "web_designer";

interface Profession {
    id: ProfessionType;
    name: string;
}

const professions: Profession[] = [
    { id: "photographer", name: "フォトグラファー" },
    { id: "model", name: "モデル" },
    { id: "stylist", name: "スタイリスト" },
    { id: "hair_makeup", name: "ヘアメイク" },
    { id: "video_creator", name: "動画クリエイター" },
    { id: "web_designer", name: "WEBデザイナー" },
];

// 職種マッピング: PackageReservateの職種 → PrismaのJobType
const mapProfessionToJobType = (profession: ProfessionType): "photographer" | "model" | "artist" | "creator" => {
    if (profession === "photographer") return "photographer";
    if (profession === "model") return "model";
    // stylist, hair_makeup, video_creator, web_designer は creator にマッピング
    return "creator";
};

interface ProfessionCount {
    profession: ProfessionType;
    count: number;
}

interface MobilePackageReservateSearchedProps {
    userId: string;
    ordererId: string;
    professionCounts: ProfessionCount[];
    isAuthorized: boolean;
}

const MobilePackageReservateSearched = ({
    userId,
    ordererId,
    professionCounts,
    isAuthorized,
}: MobilePackageReservateSearchedProps) => {
    const router = useRouter();

    // お気に入り管理フック
    const { isFavorite, addFavorite, removeFavorite, isAdding, isRemoving } = useFavoriteCasters({ ordererId });

    // まとめてキャスティング用のmutation
    const { mutate: createMultipleThreads, isPending: isCreatingMultipleThreads } = trpc.message.createMultipleThreads.useMutation({
        onSuccess: () => {
            router.push("/order/message_list");
        },
        onError: (error) => {
            console.error("まとめてキャスティングエラー:", error);
            alert("まとめてキャスティングに失敗しました: " + error.message);
        },
    });

    // 各職種ごとにキャストを検索
    // Hooksの順序を保つため、useMemoを使用して職種情報を準備
    const professionQueriesConfig = React.useMemo(() => {
        return professionCounts.map(({ profession, count }) => {
            const jobType = mapProfessionToJobType(profession);
            return {
                profession,
                count,
                jobType,
            };
        });
    }, [professionCounts]);

    // 各職種ごとのクエリを個別に定義（Hooksの順序を保つため、常に6つ呼び出す）
    const query0 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[0]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[0]
                ? {
                      [professionQueriesConfig[0].jobType]: {},
                  }
                : undefined,
            ordererId: ordererId ?? undefined,
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[0]?.count ?? 0) > 0,
        }
    );

    const query1 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[1]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[1]
                ? {
                      [professionQueriesConfig[1].jobType]: {},
                  }
                : undefined,
            ordererId: ordererId ?? undefined,
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[1]?.count ?? 0) > 0,
        }
    );

    const query2 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[2]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[2]
                ? {
                      [professionQueriesConfig[2].jobType]: {},
                  }
                : undefined,
            ordererId: ordererId ?? undefined,
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[2]?.count ?? 0) > 0,
        }
    );

    const query3 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[3]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[3]
                ? {
                      [professionQueriesConfig[3].jobType]: {},
                  }
                : undefined,
            ordererId: ordererId ?? undefined,
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[3]?.count ?? 0) > 0,
        }
    );

    const query4 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[4]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[4]
                ? {
                      [professionQueriesConfig[4].jobType]: {},
                  }
                : undefined,
            ordererId: ordererId ?? undefined,
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[4]?.count ?? 0) > 0,
        }
    );

    const query5 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[5]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[5]
                ? {
                      [professionQueriesConfig[5].jobType]: {},
                  }
                : undefined,
            ordererId: ordererId ?? undefined,
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[5]?.count ?? 0) > 0,
        }
    );

    // クエリを配列にまとめる
    const allQueries = [query0, query1, query2, query3, query4, query5];

    // 表示されているすべてのCasterのIDを収集する関数
    const getAllDisplayedCasterIds = (): string[] => {
        const casterIds: string[] = [];
        allQueries.forEach((query) => {
            const casters = query.data?.casters || [];
            casters.forEach((caster: Caster) => {
                if (caster.id && !casterIds.includes(caster.id)) {
                    casterIds.push(caster.id);
                }
            });
        });
        return casterIds;
    };

    // まとめてキャスティングを実行する関数
    const handleBulkCasting = () => {
        if (!ordererId) {
            alert("発注者情報が取得できませんでした");
            return;
        }

        const casterIds = getAllDisplayedCasterIds();
        if (casterIds.length === 0) {
            alert("キャストが選択されていません");
            return;
        }

        createMultipleThreads({
            ordererId,
            casterIds,
        });
    };

    // お気に入り追加/削除処理
    const handleAddFavorite = async (casterId: string) => {
        if (!ordererId) {
            return;
        }

        try {
            if (isFavorite(casterId)) {
                await removeFavorite(casterId);
            } else {
                await addFavorite(casterId);
            }
        } catch (error) {
            console.error("お気に入り操作エラー:", error);
        }
    };

    // お気に入り状態を判定（追加中または削除中）
    const isFavoriteOrAdding = (casterId: string): boolean => {
        return isAdding(casterId) || isRemoving(casterId);
    };

    // お気に入りボタンのテキストを取得
    const getFavoriteButtonText = (casterId: string): string => {
        if (isRemoving(casterId)) {
            return "お気に入り解除中";
        }
        if (isAdding(casterId)) {
            return "お気に入り追加中";
        }
        if (isFavorite(casterId)) {
            return "お気に入り済み";
        }
        return "お気に入りに追加";
    };

    // 職種名を取得するヘルパー関数
    const getJobTypeNames = (jobTypes: JobTypeWithSkills[]): string => {
        if (!jobTypes || jobTypes.length === 0) return "";
        const jobTypeLabels: Record<string, string> = {
            photographer: "フォトグラファー",
            model: "モデル",
            artist: "アーティスト",
            creator: "クリエイター",
        };
        return jobTypes.map((jt) => jobTypeLabels[jt.jobType] || jt.jobType).join("、");
    };

    // エリア情報を取得するヘルパー関数
    const getAreaInfo = (workAreas: WorkAreaWithRelations[]): string => {
        if (!workAreas || workAreas.length === 0) return "";
        const areas = workAreas
            .map((wa) => {
                if (wa.tokyoWard) {
                    return wa.tokyoWard.name;
                }
                if (wa.city) {
                    return wa.city.name;
                }
                if (wa.prefecture) {
                    return wa.prefecture.name;
                }
                return "";
            })
            .filter(Boolean);
        return areas.length > 0 ? areas[0] : "";
    };

    // 年齢を計算するヘルパー関数
    const calculateAge = (birthdate: Date | null | undefined): number | null => {
        if (!birthdate) return null;
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // 性別を日本語に変換するヘルパー関数
    const getGenderLabel = (gender: string | null | undefined): string => {
        if (!gender) return "性別未設定";
        if (gender === "female") return "女性";
        if (gender === "male") return "男性";
        return "性別未設定";
    };

    // 職種名を取得
    const getProfessionName = (profession: ProfessionType): string => {
        const found = professions.find((p) => p.id === profession);
        return found ? found.name : profession;
    };

    // キャストを変更ボタンのクリックハンドラ
    const handleChangeCast = () => {
        // パッケージ予約ページに戻る（全ての職種情報を保持）
        const params = new URLSearchParams();
        professionCounts.forEach(({ profession, count }) => {
            params.append("professions", `${profession}:${count}`);
        });
        router.push(`/order/package_reservate?${params.toString()}`);
    };

    return (
        <div
            style={{
                backgroundColor: "#060606",
                minHeight: "100vh",
                paddingTop: "72px",
                paddingBottom: "80px",
            }}
        >
            {/* 白い背景のコンテンツエリア */}
            <div
                style={{
                    backgroundColor: "white",
                    minHeight: "calc(100vh - 72px - 80px)",
                    paddingTop: "24px",
                    paddingBottom: "40px",
                }}
            >
                <div
                    style={{
                        padding: "0 15px",
                        maxWidth: "375px",
                        margin: "0 auto",
                    }}
                >
                    {/* タイトル */}
                    <h1
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            marginBottom: "24px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: "black",
                            textAlign: "center",
                        }}
                    >
                        キャストを確認
                    </h1>

                    {/* 職種ごとのキャストリスト */}
                    {professionCounts.map(({ profession, count }, professionIndex) => {
                        const query = allQueries[professionIndex];
                        const casters = query.data?.casters || [];
                        const isLoading = query.isLoading;

                        return (
                            <div key={profession} style={{ marginBottom: "40px" }}>
                                {/* 職種タイトル */}
                                <h2
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        marginBottom: "15px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        color: "#0d0d0d",
                                    }}
                                >
                                    {getProfessionName(profession)}　{casters.length}名
                                </h2>

                                {/* キャストリスト */}
                                {isLoading ? (
                                    <div
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: "#333",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        読み込み中...
                                    </div>
                                ) : casters.length === 0 ? (
                                    <div
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: "#333",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        該当するキャストが見つかりませんでした
                                    </div>
                                ) : (
                                    <>
                                        {casters.map((caster: Caster) => {
                                            const user = caster;
                                            const profile = caster.casterProfile;
                                            if (!profile) return null;

                                            const jobTypeNames = getJobTypeNames(profile.jobTypes);
                                            const residence = getAreaInfo(profile.workAreas);
                                            const age = calculateAge(profile.birthdate);

                                            return (
                                                <div
                                                    key={user.id}
                                                    style={{
                                                        backgroundColor: "white",
                                                        border: "1px solid black",
                                                        borderRadius: "10px",
                                                        padding: "15px",
                                                        marginBottom: "15px",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {/* 価格情報と固定報酬制バッジ（右上） */}
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "14px",
                                                            right: "15px",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "flex-end",
                                                            gap: "4px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                backgroundColor: "#cf8080",
                                                                borderRadius: "3px",
                                                                padding: "2px 8px",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "700",
                                                                    color: "white",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                固定報酬制
                                                            </span>
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "16px",
                                                                color: "black",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {profile.minBudget ? `${profile.minBudget.toLocaleString()}円～` : "価格未設定"}
                                                        </div>
                                                    </div>

                                                    {/* キャスト情報 */}
                                                        {/* 画像 */}
                                                        <div
                                                            style={{
                                                                width: "140px",
                                                                height: "93px",
                                                                borderRadius: "10px",
                                                                backgroundColor: "#f0f0f0",
                                                                overflow: "hidden",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {profile.mainProfileImage ? (
                                                                <img
                                                                    src={profile.mainProfileImage}
                                                                    alt="プロフィール画像"
                                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        height: "100%",
                                                                        color: "#999",
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    画像なし
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* 名前と職種 */}
                                                        <div style={{ flex: 1, paddingRight: "100px" }}>
                                                            <div
                                                                style={{
                                                                    fontSize: "20px",
                                                                    fontWeight: "700",
                                                                    marginBottom: "4px",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                    color: "black",
                                                                }}
                                                            >
                                                                {profile.fullName || "名前未設定"}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize: "16px",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                    color: "black",
                                                                }}
                                                            >
                                                                {jobTypeNames || "職種未設定"}
                                                            </div>
                                                        </div>

                                                    {/* 自己紹介タイトル */}
                                                    <div
                                                        style={{
                                                            fontSize: "16px",
                                                            color: "#333",
                                                            marginBottom: "8px",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {profile.bio || "自己紹介未設定"}
                                                    </div>

                                                    {/* 個人情報 */}
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#333",
                                                            marginBottom: "12px",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {residence ? residence.split(/[都道府県]/)[0] : "地域未設定"}/
                                                        {age !== null ? `${age}歳` : "年齢未設定"}
                                                        /{getGenderLabel(profile.gender || null)}
                                                        /{profile.height ? `${profile.height}cm` : "身長未設定"}
                                                    </div>

                                                    {/* アクションボタン */}
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <button
                                                            onClick={() => router.push(`/cast/detail?userId=${user.id}`)}
                                                            style={{
                                                                backgroundColor: "#d70202",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "90px",
                                                                height: "31px",
                                                                fontSize: "12px",
                                                                fontWeight: "700",
                                                                padding: "0 20px",
                                                                cursor: "pointer",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                                flex: 1,
                                                            }}
                                                        >
                                                            詳細を確認
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddFavorite(user.id)}
                                                            disabled={isFavoriteOrAdding(user.id) || !ordererId}
                                                            style={{
                                                                backgroundColor: "white",
                                                                color: "black",
                                                                border: "1px solid black",
                                                                borderRadius: "90px",
                                                                height: "31px",
                                                                fontSize: "10px",
                                                                padding: "0 12px",
                                                                cursor: isFavoriteOrAdding(user.id) || !ordererId ? "not-allowed" : "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                opacity: isFavoriteOrAdding(user.id) || !ordererId ? 0.6 : 1,
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {isFavorite(user.id) ? (
                                                                <FaBookmark
                                                                    style={{
                                                                        width: "12.85px",
                                                                        height: "12.85px",
                                                                        fill: "#ff6d00",
                                                                        color: "#ff6d00",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <FaRegBookmark
                                                                    style={{
                                                                        width: "12.85px",
                                                                        height: "12.85px",
                                                                    }}
                                                                />
                                                            )}
                                                            {getFavoriteButtonText(user.id)}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* キャストを変更ボタン */}
                                        <button
                                            onClick={handleChangeCast}
                                            style={{
                                                backgroundColor: "white",
                                                border: "1px solid black",
                                                borderRadius: "10px",
                                                height: "40px",
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                cursor: "pointer",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                marginTop: "15px",
                                            }}
                                        >
                                            <FaRedo
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    color: "#ff6d00",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: "700",
                                                    color: "black",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                キャストを変更
                                            </span>
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {/* まとめてキャスティングを行うボタン */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "40px",
                        }}
                    >
                        <button
                            onClick={handleBulkCasting}
                            disabled={isCreatingMultipleThreads}
                            style={{
                                backgroundColor: isCreatingMultipleThreads ? "#999" : "#d70202",
                                color: "white",
                                border: "none",
                                borderRadius: "90px",
                                height: "38px",
                                fontSize: "14px",
                                fontWeight: "700",
                                padding: "0 40px",
                                cursor: isCreatingMultipleThreads ? "not-allowed" : "pointer",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                width: "277px",
                            }}
                        >
                            {isCreatingMultipleThreads ? "処理中..." : "まとめてキャスティングを行う"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobilePackageReservateSearched;
