"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import { inferRouterOutputs } from "@trpc/server";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
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

const PackageReservateSearched = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [ordererId, setOrdererId] = useState<string | null>(null);
    const [professionCounts, setProfessionCounts] = useState<ProfessionCount[]>([]);

    // URLパラメータから職種と人数を取得
    useEffect(() => {
        const professionsParam = searchParams.get("professions");
        if (professionsParam) {
            const counts: ProfessionCount[] = [];
            const params = searchParams.getAll("professions");
            params.forEach((param) => {
                const [profession, countStr] = param.split(":");
                const count = parseInt(countStr, 10);
                if (profession && !isNaN(count) && count > 0) {
                    counts.push({
                        profession: profession as ProfessionType,
                        count,
                    });
                }
            });
            setProfessionCounts(counts);
        }
    }, [searchParams]);

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser, error: userError } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 認証チェック
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                router.push("/login");
                return;
            }

            setUserId(session.user.id);
            setOrdererId(session.user.id);
        };

        checkAuth();
    }, [router]);

    // ユーザーデータ取得後の権限チェック
    useEffect(() => {
        if (!userId) {
            return;
        }

        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザーデータ取得エラー:", userError);
            if (userError.data?.code === "UNAUTHORIZED" || userError.data?.code === "NOT_FOUND") {
                router.push("/login");
            } else {
                console.error("ユーザーデータ取得エラー（再試行可能）:", userError);
            }
            return;
        }

        if (!userData) {
            return;
        }

        if (!userData.hasOrdererProfile) {
            router.push("/top");
            return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
    }, [userData, isLoadingUser, userError, userId, router]);

    // お気に入り管理フック
    const { isFavorite, addFavorite, removeFavorite, isAdding, isRemoving } = useFavoriteCasters({ ordererId });

    // 各職種ごとにキャストを検索
    // Hooksの順序を保つため、useMemoを使用して職種情報を準備
    const professionQueriesConfig = useMemo(() => {
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
    // 最大6つの職種があるため、常に6つのHooksを呼び出す
    // サーバー側のロジックを修正したため、職種のみのフィルタリングが可能になった
    const query0 = trpc.profile.getCasterList.useQuery(
        {
            page: 1,
            limit: professionQueriesConfig[0]?.count ?? 0,
            jobTypeFilters: professionQueriesConfig[0]
                ? {
                      [professionQueriesConfig[0].jobType]: {},
                  }
                : undefined,
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
        },
        {
            enabled: isAuthorized && (professionQueriesConfig[5]?.count ?? 0) > 0,
        }
    );

    // クエリを配列にまとめる
    const allQueries = [query0, query1, query2, query3, query4, query5];

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

    if (isLoading || !isAuthorized) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#060606",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "16px",
                        color: "white",
                    }}
                >
                    読み込み中...
                </div>
            </div>
        );
    }

    return (
        <>
            {/* メインコンテンツ */}
            <div
                style={{
                    backgroundColor: "white",
                    paddingTop: "126px",
                    paddingBottom: "80px",
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "40px 0",
                        padding: "0 clamp(20px, 4vw, 60px)",
                    }}
                >
                    {/* タイトル */}
                    <h1
                        style={{
                            fontSize: "36px",
                            fontWeight: "700",
                            marginBottom: "50px",
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
                            <div key={profession} style={{ marginBottom: "60px" }}>
                                {/* 職種タイトル */}
                                <h2
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        marginBottom: "30px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        color: "black",
                                    }}
                                >
                                    {getProfessionName(profession)}　{count}名
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
                                    <div
                                        style={{
                                            backgroundColor: "#000",
                                            borderRadius: "10px",
                                            padding: "20px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
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
                                                        borderRadius: "10px",
                                                        padding: "20px",
                                                        display: "flex",
                                                        gap: "20px",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {/* プレビュー画像 */}
                                                    <div
                                                        style={{
                                                            width: "204px",
                                                            height: "136px",
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
                                                                }}
                                                            >
                                                                画像なし
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* プレビュー情報 */}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: "16px", marginBottom: "10px", color: "#000" }}>
                                                            {jobTypeNames || "職種未設定"}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "20px",
                                                                fontWeight: "bold",
                                                                marginBottom: "10px",
                                                                color: "#000",
                                                            }}
                                                        >
                                                            {profile.fullName || "名前未設定"}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#333",
                                                                marginBottom: "10px",
                                                                lineHeight: "1.5",
                                                            }}
                                                        >
                                                            {profile.bio || "自己紹介未設定"}
                                                        </div>
                                                        <div style={{ fontSize: "16px", color: "#333" }}>
                                                            {residence ? residence.split(/[都道府県]/)[0] : "地域未設定"}/
                                                            {age !== null ? `${age}歳` : "年齢未設定"}
                                                            /{getGenderLabel(profile.gender || null)}
                                                            /{profile.height ? `${profile.height}cm` : "身長未設定"}
                                                        </div>
                                                    </div>

                                                    {/* 価格情報 */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            padding: "0 20px",
                                                            borderLeft: "1px solid #d3d3d3",
                                                            borderRight: "1px solid #d3d3d3",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                backgroundColor: "#cf8080",
                                                                borderRadius: "3px",
                                                                padding: "4px 12px",
                                                                marginBottom: "8px",
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
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {profile.minBudget ? `${profile.minBudget.toLocaleString()}円～` : "価格未設定"}
                                                        </div>
                                                    </div>

                                                    {/* アクションボタン */}
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                                                        <button
                                                            onClick={() => router.push(`/cast/detail?userId=${user.id}`)}
                                                            style={{
                                                                backgroundColor: "#d70202",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "90px",
                                                                height: "31px",
                                                                fontSize: "16px",
                                                                fontWeight: "bold",
                                                                padding: "0 30px",
                                                                cursor: "pointer",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
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
                                                                border: "1px solid #000",
                                                                borderRadius: "90px",
                                                                height: "31px",
                                                                fontSize: "12px",
                                                                padding: "0 30px",
                                                                cursor: isFavoriteOrAdding(user.id) || !ordererId ? "not-allowed" : "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                                opacity: isFavoriteOrAdding(user.id) || !ordererId ? 0.6 : 1,
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {isFavorite(user.id) ? (
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
                                                            {getFavoriteButtonText(user.id)}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* 職種間の区切り線 */}
                                {professionIndex < professionCounts.length - 1 && (
                                    <div
                                        style={{
                                            height: "1px",
                                            backgroundColor: "#d3d3d3",
                                            marginTop: "60px",
                                            marginBottom: "60px",
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {/* まとめてキャスティングを行うボタン */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "60px",
                        }}
                    >
                        <button
                            onClick={() => {
                                // 一旦置くだけ
                                console.log("まとめてキャスティングを行う");
                            }}
                            style={{
                                backgroundColor: "#d70202",
                                color: "white",
                                border: "none",
                                borderRadius: "90px",
                                height: "74px",
                                fontSize: "24px",
                                fontWeight: "700",
                                padding: "0 100px",
                                cursor: "pointer",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget;
                                target.style.backgroundColor = "#e52222";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget;
                                target.style.backgroundColor = "#d70202";
                            }}
                        >
                            まとめてキャスティングを行う
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PackageReservateSearched;
