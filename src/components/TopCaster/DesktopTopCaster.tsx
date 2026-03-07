"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import img11 from "../TopOrder/images/search_magnifying_glass.png";
import { trpc } from "@/lib/trpc/client";
import { supabase } from "@/lib/supabase";

const DesktopTopCaster = () => {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [userId, setUserId] = useState<string | null>(null);
    const [addingFavorites, setAddingFavorites] = useState<Set<string>>(new Set());
    const [removingFavorites, setRemovingFavorites] = useState<Set<string>>(new Set());

    // ユーザーIDを取得
    useEffect(() => {
        const getUserId = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
            }
        };
        getUserId();
    }, []);

    // 全ての案件を取得
    const { data: allProjects, isLoading: isLoadingProjects } = trpc.project.getAllProjects.useQuery();

    // 検索キーワードでフィルタリングされた案件
    const filteredProjects = useMemo(() => {
        if (!allProjects) {
            return [];
        }
        if (!searchKeyword.trim()) {
            return allProjects;
        }
        const keyword = searchKeyword.trim().toLowerCase();
        return allProjects.filter((project) => {
            const companyName =
                project.user.organization?.companyName ||
                project.user.ordererProfile?.fullName ||
                "";
            return companyName.toLowerCase().includes(keyword);
        });
    }, [allProjects, searchKeyword]);

    // 1ページあたりの件数
    const itemsPerPage = 10;

    // 総ページ数を計算
    const totalPages = useMemo(() => {
        if (!filteredProjects || filteredProjects.length === 0) {
            return 1;
        }
        return Math.ceil(filteredProjects.length / itemsPerPage);
    }, [filteredProjects]);

    // 現在のページのデータを取得
    const paginatedProjects = useMemo(() => {
        if (!filteredProjects || filteredProjects.length === 0) {
            return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProjects.slice(startIndex, endIndex);
    }, [filteredProjects, currentPage]);

    // 検索キーワードが変更されたら1ページ目に戻す
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword]);

    // お気に入り一覧を取得（全ての案件のお気に入り状態を確認するため）
    const { data: favoriteProjectsData, refetch: refetchFavorites } = trpc.favorite.getFavoriteProjects.useQuery(
        {
            casterId: userId!,
            page: 1,
            limit: 100,
        },
        {
            enabled: !!userId,
        }
    );

    // お気に入り追加のmutation
    const addFavoriteMutation = trpc.favorite.addFavoriteProject.useMutation({
        onSuccess: () => {
            void refetchFavorites();
        },
    });

    // お気に入り削除のmutation
    const removeFavoriteMutation = trpc.favorite.removeFavoriteProject.useMutation({
        onSuccess: () => {
            void refetchFavorites();
        },
    });

    // お気に入りIDのセットを作成
    const favoriteProjectIds = useMemo(
        () => new Set(favoriteProjectsData?.projects.map((project: { id: string }) => project.id) || []),
        [favoriteProjectsData?.projects]
    );

    // お気に入り登録されているかチェック
    const isFavorite = (projectId: string): boolean => {
        return favoriteProjectIds.has(projectId);
    };

    // お気に入り追加/削除処理
    const handleAddFavorite = async (projectId: string) => {
        if (!userId) {
            return;
        }

        if (isFavorite(projectId)) {
            // お気に入り済みの場合は削除
            setRemovingFavorites((prev) => new Set(prev).add(projectId));

            try {
                await removeFavoriteMutation.mutateAsync({
                    casterId: userId,
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
        } else {
            // お気に入りに追加
            setAddingFavorites((prev) => new Set(prev).add(projectId));

            try {
                await addFavoriteMutation.mutateAsync({
                    casterId: userId,
                    projectId,
                });
            } catch (error) {
                console.error("お気に入り追加エラー:", error);
            } finally {
                setAddingFavorites((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(projectId);
                    return newSet;
                });
            }
        }
    };

    // お気に入り追加中かチェック
    const isAdding = (projectId: string): boolean => {
        return addingFavorites.has(projectId);
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
        if (isAdding(projectId)) {
            return "お気に入り追加中";
        }
        if (isFavorite(projectId)) {
            return "お気に入り済み";
        }
        return "お気に入りに追加";
    };

    return (
        <div
            style={{
                paddingTop: "146px",
                paddingBottom: "60px",
                paddingLeft: "clamp(20px, 4vw, 60px)",
                paddingRight: "clamp(20px, 4vw, 60px)",
                maxWidth: "1080px",
                margin: "0 auto",
            }}
        >
            {/* メインコンテンツ */}
            <div>
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
                            placeholder="発注者名で検索"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "#333",
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
                    {isLoadingProjects
                        ? "読み込み中..."
                        : filteredProjects && filteredProjects.length > 0
                        ? `${filteredProjects.length}件のうち、${(currentPage - 1) * itemsPerPage + 1}~${Math.min(currentPage * itemsPerPage, filteredProjects.length)}件を表示`
                        : "0件"}
                </p>

                {/* 案件一覧 */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {isLoadingProjects ? (
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
                    ) : !filteredProjects || filteredProjects.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "white",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            案件が見つかりませんでした
                        </div>
                    ) : (
                        paginatedProjects.map((project) => {
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
                                                    window.open(`/project/detail?id=${project.id}`, "_blank")
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
                                                onClick={() => handleAddFavorite(project.id)}
                                                style={{
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    border: "1px solid black",
                                                    borderRadius: "90px",
                                                    padding: "8px 24px",
                                                    fontSize: "12px",
                                                    fontWeight: "400",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    cursor: isAdding(project.id) || isRemoving(project.id) ? "not-allowed" : "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "8px",
                                                    width: "100%",
                                                    opacity: isAdding(project.id) || isRemoving(project.id) ? 0.6 : 1,
                                                }}
                                            >
                                                {isFavorite(project.id) ? (
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
                {totalPages > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "40px",
                        }}
                    >
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        </div>
    );
};

export default DesktopTopCaster;
