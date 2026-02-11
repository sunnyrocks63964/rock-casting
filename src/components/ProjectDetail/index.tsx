"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { trpc } from "@/lib/trpc/client";
import { supabase } from "@/lib/supabase";

const ProjectDetail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const [userId, setUserId] = useState<string | null>(null);
    const [addingFavorite, setAddingFavorite] = useState(false);
    const [removingFavorite, setRemovingFavorite] = useState(false);
    const [isCreatingThread, setIsCreatingThread] = useState(false);

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

    // 現在のユーザー情報を取得（Castかどうかを確認するため）
    const { data: userData } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // メッセージスレッド作成のmutation
    const { mutate: createThread } = trpc.message.createThread.useMutation({
        onSuccess: (data) => {
            router.push(`/caster/message/${data.threadId}`);
        },
        onError: (error) => {
            console.error("スレッド作成エラー:", error);
            alert("応募に失敗しました: " + error.message);
            setIsCreatingThread(false);
        },
    });

    // 案件データを取得
    const { data: project, isLoading: isLoadingProject } = trpc.project.getProjectById.useQuery(
        { projectId: projectId! },
        {
            enabled: !!projectId,
            retry: false,
        }
    );

    // お気に入り一覧を取得（お気に入り状態を確認するため）
    const { data: favoriteProjectsData, refetch: refetchFavorites } = trpc.favorite.getFavoriteProjects.useQuery(
        {
            casterId: userId!,
            page: 1,
            limit: 100,
        },
        {
            enabled: !!userId && !!projectId,
        }
    );

    // お気に入りIDのセットを作成
    const favoriteProjectIds = useMemo(
        () => new Set(favoriteProjectsData?.projects.map((project: { id: string }) => project.id) || []),
        [favoriteProjectsData?.projects]
    );

    // お気に入り登録されているかチェック
    const isFavorite = (): boolean => {
        if (!projectId) return false;
        return favoriteProjectIds.has(projectId);
    };

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

    // お気に入り追加/削除処理
    const handleFavorite = async () => {
        if (!userId || !projectId) {
            return;
        }

        if (isFavorite()) {
            // お気に入り済みの場合は削除
            setRemovingFavorite(true);

            try {
                await removeFavoriteMutation.mutateAsync({
                    casterId: userId,
                    projectId,
                });
            } catch (error) {
                console.error("お気に入り削除エラー:", error);
            } finally {
                setRemovingFavorite(false);
            }
        } else {
            // お気に入りに追加
            setAddingFavorite(true);

            try {
                await addFavoriteMutation.mutateAsync({
                    casterId: userId,
                    projectId,
                });
            } catch (error) {
                console.error("お気に入り追加エラー:", error);
            } finally {
                setAddingFavorite(false);
            }
        }
    };

    // お気に入りボタンのテキストを取得
    const getFavoriteButtonText = (): string => {
        if (removingFavorite) {
            return "お気に入り解除中";
        }
        if (addingFavorite) {
            return "お気に入り追加中";
        }
        if (isFavorite()) {
            return "お気に入り済み";
        }
        return "お気に入りに追加";
    };

    // JobTypeの日本語ラベル
    const jobTypeLabels: Record<string, string> = {
        photographer: "フォトグラファー",
        model: "モデル",
        artist: "アーティスト",
        creator: "クリエイター",
    };

    // 読み込み中またはデータがない場合
    if (isLoadingProject) {
        return (
            <div
                style={{
                    backgroundColor: "#060606",
                    minHeight: "0",
                    paddingTop: "120px",
                    paddingBottom: "0",
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        minHeight: "calc(100vh - 126px - 376px)",
                        paddingTop: "74px",
                        paddingBottom: "74px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p
                        style={{
                            fontSize: "16px",
                            color: "black",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        読み込み中...
                    </p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div
                style={{
                    backgroundColor: "#060606",
                    minHeight: "0",
                    paddingTop: "120px",
                    paddingBottom: "0",
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        minHeight: "calc(100vh - 126px - 376px)",
                        paddingTop: "74px",
                        paddingBottom: "74px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p
                        style={{
                            fontSize: "16px",
                            color: "black",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        案件が見つかりませんでした
                    </p>
                </div>
            </div>
        );
    }

    // organizationが含まれているかチェック
    const userWithOrg = project.user as typeof project.user & {
        organization?: { companyName: string | null } | null;
    };
    const companyName =
        userWithOrg.organization?.companyName ||
        project.user.ordererProfile?.fullName ||
        "未設定";

    const budgetText =
        project.minBudget === project.maxBudget
            ? `${project.minBudget.toLocaleString()}円`
            : `${project.minBudget.toLocaleString()}円～${project.maxBudget.toLocaleString()}円`;

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
                        {project.title}
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
                        {companyName}
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
                                        {budgetText}
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
                                    {project.detail.split("\n").map((line, index) => (
                                        <p key={index} style={{ margin: "0 0 16px 0" }}>
                                            {line || "\u00A0"}
                                        </p>
                                    ))}
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
                                        {jobTypeLabels[project.category] || project.category}
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
                        {userData?.hasCasterProfile && userId && project.user.id !== userId && (
                            <button
                                onClick={() => {
                                    if (!userId || !project.user.id) {
                                        alert("ユーザー情報が取得できませんでした");
                                        return;
                                    }
                                    setIsCreatingThread(true);
                                    createThread({
                                        ordererId: project.user.id,
                                        casterId: userId,
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
                                {isCreatingThread ? "処理中..." : "案件に応募する"}
                            </button>
                        )}
                        <button
                            onClick={handleFavorite}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                                borderRadius: "90px",
                                padding: "8px 24px",
                                fontSize: "14px",
                                fontWeight: "700",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: addingFavorite || removingFavorite ? "not-allowed" : "pointer",
                                width: "262px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                opacity: addingFavorite || removingFavorite ? 0.6 : 1,
                            }}
                        >
                            {isFavorite() ? (
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
        </div>
    );
};

export default ProjectDetail;
