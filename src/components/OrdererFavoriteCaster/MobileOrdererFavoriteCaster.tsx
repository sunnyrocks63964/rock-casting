"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { SearchOutlined } from "@ant-design/icons";
import { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc/client";
import { type AppRouter } from "@/server/routers/_app";
import { useFavoriteCasters } from "@/hooks/useFavoriteCasters";

// tRPC の型推論を使用して型を取得
type RouterOutputs = inferRouterOutputs<AppRouter>;
type FavoriteCastersOutput = RouterOutputs["favorite"]["getFavoriteCasters"];
type Caster = FavoriteCastersOutput["casters"][number];
type CasterProfile = NonNullable<Caster["casterProfile"]>;
type JobTypeWithSkills = CasterProfile["jobTypes"][number];
type WorkAreaWithRelations = CasterProfile["workAreas"][number];

const jobTypeLabels: Record<string, string> = {
    photographer: "フォトグラファー",
    model: "モデル",
    artist: "アーティスト",
    creator: "クリエイター",
};

interface MobileOrdererFavoriteCasterProps {
    ordererId: string;
}

const MobileOrdererFavoriteCaster = ({ ordererId }: MobileOrdererFavoriteCasterProps) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");

    // お気に入り一覧を取得
    const { data: favoriteCastersData, isLoading: isLoadingFavorites } = trpc.favorite.getFavoriteCasters.useQuery(
        {
            ordererId,
            page: currentPage,
            limit: 15,
        }
    );

    // お気に入り管理フック
    const { isFavorite, addFavorite, removeFavorite, isAdding, isRemoving } = useFavoriteCasters({ ordererId });

    // 職種名を取得するヘルパー関数
    const getJobTypeNames = (jobTypes: JobTypeWithSkills[]): string => {
        if (!jobTypes || jobTypes.length === 0) return "";
        return jobTypes.map((jt) => jobTypeLabels[jt.jobType as string] || jt.jobType).join("、");
    };

    // エリア情報を取得するヘルパー関数
    const getAreaInfo = (workAreas: WorkAreaWithRelations[]): string => {
        if (!workAreas || workAreas.length === 0) return "";
        const areas = workAreas.map((wa) => {
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
        }).filter(Boolean);
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

    // 検索フィルタリング
    const filteredCasters = (favoriteCastersData?.casters || []).filter((user) => {
        const profile = user.casterProfile;
        if (!profile) return false;

        if (searchKeyword) {
            const nameMatch = profile.fullName?.toLowerCase().includes(searchKeyword.toLowerCase());
            const jobTypeMatch = getJobTypeNames(profile.jobTypes || []).toLowerCase().includes(searchKeyword.toLowerCase());
            const occupationMatch = profile.occupation?.toLowerCase().includes(searchKeyword.toLowerCase());
            const areaInfo = getAreaInfo(profile.workAreas || []);
            const areaMatch = areaInfo.toLowerCase().includes(searchKeyword.toLowerCase());
            if (!nameMatch && !jobTypeMatch && !occupationMatch && !areaMatch) {
                return false;
            }
        }

        return true;
    });

    return (
        <div
            style={{
                backgroundColor: "#060606",
                minHeight: "100vh",
                paddingTop: "98px",
                paddingBottom: "80px",
                paddingLeft: "14px",
                paddingRight: "14px",
            }}
        >
            {/* ヘッダー */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <h1
                    style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "white",
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    お気に入り
                </h1>
            </div>

            {/* キャスト一覧 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                {isLoadingFavorites ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        読み込み中...
                    </div>
                ) : filteredCasters.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        お気に入りに登録されたキャストはありません
                    </div>
                ) : (
                    filteredCasters.map((user) => {
                        const profile = user.casterProfile;
                        if (!profile) return null;

                        const jobTypeNames = getJobTypeNames(profile.jobTypes || []);
                        const areaInfo = getAreaInfo(profile.workAreas || []);
                        const age = calculateAge(profile.birthdate);
                        const residence = profile.residence || areaInfo || profile.area || "";

                        return (
                            <div
                                key={user.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    border: "1px solid black",
                                }}
                            >
                                {/* キャスト情報 */}
                                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                                    {/* プレビュー画像 */}
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
                                                }}
                                            >
                                                画像なし
                                            </div>
                                        )}
                                    </div>

                                    {/* プレビュー情報 */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "16px", marginBottom: "4px", color: "#000", textAlign: "center" }}>
                                            {jobTypeNames || "職種未設定"}
                                        </div>
                                        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px", color: "#000", textAlign: "center" }}>
                                            {profile.fullName || "名前未設定"}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#333", textAlign: "center" }}>
                                            {residence ? residence.split(/[都道府県]/)[0] : "地域未設定"}/
                                            {age !== null ? `${age}歳` : "年齢未設定"}
                                            /{getGenderLabel(profile.gender || null)}
                                            /{profile.height ? `${profile.height}cm` : "身長未設定"}
                                        </div>
                                    </div>
                                </div>

                                {/* 紹介文 */}
                                <div style={{ fontSize: "16px", color: "#333", marginBottom: "12px" }}>
                                    {profile.bio || "自己紹介未設定"}
                                </div>

                                {/* アクションボタン */}
                                <div style={{ display: "flex", gap: "17px", justifyContent: "center" }}>
                                    <button
                                        onClick={() => router.push(`/cast/detail?userId=${user.id}`)}
                                        style={{
                                            backgroundColor: "#d70202",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "90px",
                                            height: "31px",
                                            fontSize: "10px",
                                            fontWeight: "bold",
                                            padding: "0 20px",
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
                                            border: "1px solid black",
                                            borderRadius: "90px",
                                            height: "31px",
                                            fontSize: "10px",
                                            padding: "0 20px",
                                            cursor: isFavoriteOrAdding(user.id) || !ordererId ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            opacity: isFavoriteOrAdding(user.id) || !ordererId ? 0.6 : 1,
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        {isFavorite(user.id) ? (
                                            <FaBookmark
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    fill: "#ff6d00",
                                                    color: "#ff6d00",
                                                }}
                                            />
                                        ) : (
                                            <FaRegBookmark
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                }}
                                            />
                                        )}
                                        {getFavoriteButtonText(user.id)}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ページネーション */}
            {favoriteCastersData && favoriteCastersData.totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "30px",
                    }}
                >
                    {Array.from({ length: favoriteCastersData.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                minWidth: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid white",
                                backgroundColor: page === currentPage ? "#ff6d00" : "transparent",
                                color: page === currentPage ? "white" : "white",
                                fontSize: "16px",
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
                    {currentPage < favoriteCastersData.totalPages && (
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid white",
                                backgroundColor: "transparent",
                                color: "white",
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MobileOrdererFavoriteCaster;
