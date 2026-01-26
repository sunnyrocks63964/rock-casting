"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc/client";
import { type AppRouter } from "@/server/routers/_app";

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

interface OrdererFavoriteCasterProps {
    ordererId: string;
}

const OrdererFavoriteCaster = ({ ordererId }: OrdererFavoriteCasterProps) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    // お気に入り一覧を取得
    const { data: favoriteCastersData, isLoading: isLoadingFavorites } = trpc.favorite.getFavoriteCasters.useQuery(
        {
            ordererId,
            page: currentPage,
            limit: 15,
        }
    );

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

    const casters = favoriteCastersData?.casters || [];

    return (
        <div
            style={{
                paddingTop: "146px",
                paddingBottom: "60px",
                paddingLeft: "clamp(20px, 4vw, 60px)",
                paddingRight: "clamp(20px, 4vw, 60px)",
                maxWidth: "1920px",
                margin: "0 auto",
            }}
        >
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "white",
                    marginBottom: "40px",
                    fontFamily: "'Noto Sans JP', sans-serif",
                }}
            >
                お気に入り
            </h1>

            {/* 検索結果表示 */}
            {favoriteCastersData && (
                <p
                    style={{
                        fontSize: "16px",
                        color: "white",
                        textAlign: "center",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        marginBottom: "20px",
                    }}
                >
                    {favoriteCastersData.total}件のうち、{Math.min((currentPage - 1) * 15 + 1, favoriteCastersData.total)}~{Math.min(currentPage * 15, favoriteCastersData.total)}件を表示
                </p>
            )}

            {/* キャスト一覧 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
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
                ) : casters.length === 0 ? (
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
                    casters.map((user) => {
                        const profile = user.casterProfile;
                        if (!profile) return null;

                        const jobTypeNames = getJobTypeNames(profile.jobTypes || []);
                        const areaInfo = getAreaInfo(profile.workAreas || []);

                        return (
                            <div
                                key={user.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    display: "flex",
                                    gap: "20px",
                                }}
                            >
                                {/* キャスト画像 */}
                                <div
                                    style={{
                                        width: "204px",
                                        height: "136px",
                                        borderRadius: "10px",
                                        backgroundColor: "#e5e5e5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <FaUser
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            color: "#999999",
                                        }}
                                    />
                                </div>

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
                                        {profile.fullName || "名前未設定"}
                                    </h3>
                                    {jobTypeNames && (
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                color: "black",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            {jobTypeNames}
                                        </p>
                                    )}
                                    {profile.occupation && (
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                color: "#333",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            {profile.occupation}
                                        </p>
                                    )}
                                    {(areaInfo || profile.area) && (
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                color: "#333",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            {areaInfo || profile.area}
                                        </p>
                                    )}
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
                                            onClick={() => router.push(`/cast/detail?userId=${user.id}`)}
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
                                    </div>
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
                        gap: "10px",
                        marginTop: "40px",
                    }}
                >
                    {Array.from({ length: favoriteCastersData.totalPages }, (_, i) => i + 1).map((page) => (
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
            )}
        </div>
    );
};

export default OrdererFavoriteCaster;
