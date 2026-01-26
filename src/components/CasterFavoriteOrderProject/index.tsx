"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa";
import { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc/client";
import { type AppRouter } from "@/server/routers/_app";

// tRPC の型推論を使用して型を取得
type RouterOutputs = inferRouterOutputs<AppRouter>;
type FavoriteProjectsOutput = RouterOutputs["favorite"]["getFavoriteProjects"];
type Project = FavoriteProjectsOutput["projects"][number];

interface CasterFavoriteOrderProjectProps {
    casterId: string;
}

const CasterFavoriteOrderProject = ({ casterId }: CasterFavoriteOrderProjectProps) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [removingFavorites, setRemovingFavorites] = useState<Set<string>>(new Set());

    // お気に入り一覧を取得
    const { data: favoriteProjectsData, isLoading: isLoadingFavorites, refetch: refetchFavorites } = trpc.favorite.getFavoriteProjects.useQuery(
        {
            casterId,
            page: currentPage,
            limit: 15,
        }
    );

    // お気に入り削除のmutation
    const removeFavoriteMutation = trpc.favorite.removeFavoriteProject.useMutation({
        onSuccess: () => {
            void refetchFavorites();
        },
    });

    const projects: Project[] = favoriteProjectsData?.projects || [];

    // お気に入り削除処理
    const handleRemoveFavorite = async (projectId: string) => {
        setRemovingFavorites((prev) => new Set(prev).add(projectId));

        try {
            await removeFavoriteMutation.mutateAsync({
                casterId,
                projectId,
            });
        } catch (error) {
            console.error("お気に入り削除エラー:", error);
        } finally {
            setRemovingFavorites((prev) => {
                const newSet = new Set(prev);
                newSet.delete(projectId);
                return newSet;
            });
        }
    };

    // お気に入り削除中かチェック
    const isRemoving = (projectId: string): boolean => {
        return removingFavorites.has(projectId);
    };

    // お気に入りボタンのテキストを取得
    const getFavoriteButtonText = (projectId: string): string => {
        if (isRemoving(projectId)) {
            return "お気に入り解除中";
        }
        return "お気に入り済み";
    };

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
            {favoriteProjectsData && (
                <p
                    style={{
                        fontSize: "16px",
                        color: "white",
                        textAlign: "center",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        marginBottom: "20px",
                    }}
                >
                    {favoriteProjectsData.total}件のうち、{Math.min((currentPage - 1) * 15 + 1, favoriteProjectsData.total)}~{Math.min(currentPage * 15, favoriteProjectsData.total)}件を表示
                </p>
            )}

            {/* 案件一覧 */}
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
                ) : projects.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        お気に入りに登録された案件はありません
                    </div>
                ) : (
                    projects.map((project) => {
                        const companyName =
                            project.user.organization?.companyName ||
                            project.user.ordererProfile?.fullName ||
                            "未設定";
                        const budgetText =
                            project.minBudget === project.maxBudget
                                ? `${project.minBudget.toLocaleString()}円`
                                : `${project.minBudget.toLocaleString()}円～${project.maxBudget.toLocaleString()}円`;

                        return (
                            <div
                                key={project.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    display: "flex",
                                    gap: "20px",
                                }}
                            >
                                {/* 左側: 案件情報 */}
                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "#333",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: 0,
                                        }}
                                    >
                                        {companyName}
                                    </p>
                                    <h3
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: 0,
                                        }}
                                    >
                                        {project.title}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "#333",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            margin: 0,
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        {project.detail}
                                    </p>
                                </div>

                                {/* 右側: 価格とボタン */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        gap: "12px",
                                        minWidth: "200px",
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
                                            margin: 0,
                                        }}
                                    >
                                        {budgetText}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                            width: "100%",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                router.push(`/project/detail?id=${project.id}`)
                                            }
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
                                                width: "100%",
                                            }}
                                        >
                                            詳細を確認
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFavorite(project.id)}
                                            style={{
                                                backgroundColor: "white",
                                                color: "black",
                                                border: "1px solid black",
                                                borderRadius: "90px",
                                                padding: "8px 24px",
                                                fontSize: "12px",
                                                fontWeight: "400",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                cursor: isRemoving(project.id) ? "not-allowed" : "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                width: "100%",
                                                opacity: isRemoving(project.id) ? 0.6 : 1,
                                            }}
                                        >
                                            <FaBookmark
                                                style={{
                                                    width: "14px",
                                                    height: "14px",
                                                    fill: "#ff6d00",
                                                    color: "#ff6d00",
                                                }}
                                            />
                                            {getFavoriteButtonText(project.id)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ページネーション */}
            {favoriteProjectsData && favoriteProjectsData.totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "40px",
                    }}
                >
                    {Array.from({ length: favoriteProjectsData.totalPages }, (_, i) => i + 1).map((page) => (
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

export default CasterFavoriteOrderProject;
