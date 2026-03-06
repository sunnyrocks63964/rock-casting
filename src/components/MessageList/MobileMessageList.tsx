"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Input, Spin, Empty, Tabs } from "antd";
import type { ChangeEvent } from "react";
import { SearchOutlined, StarOutlined, DoubleRightOutlined } from "@ant-design/icons";

type MessageListProps = {
    userId: string;
    userType: "order" | "caster";
};

type TabKey = "all" | "scout" | "negotiation" | "agreed";

const statusLabels: Record<string, string> = {
    scout: "応募・スカウト",
    negotiation: "条件交渉",
    agreed: "条件合意",
    contract: "契約完了",
    CasterCancelRequesting: "依頼主が中断リクエスト中",
    OrderCancelRequesting: "発注者が中断リクエスト中",
    DeliveredAndReviewing: "納品済み・検収中",
    completed: "完了",
    cancelled: "キャンセル",
};

const ITEMS_PER_PAGE = 15;

export default function MobileMessageList({ userId, userType }: MessageListProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: threads, isLoading } = trpc.message.getThreadsByStatus.useQuery({
        userId,
        status: activeTab,
    });

    const handleThreadClick = (threadId: string) => {
        router.push(`/${userType}/message/${threadId}`);
    };

    const getOtherUser = (thread: NonNullable<typeof threads>[number]) => {
        if (thread.ordererId === userId) {
            return {
                name: thread.caster.casterProfile?.fullName || thread.caster.email,
                user: thread.caster,
            };
        }
        return {
            name: thread.orderer.ordererProfile?.fullName || thread.orderer.email,
            user: thread.orderer,
        };
    };

    const getProjectTitle = (thread: NonNullable<typeof threads>[number]) => {
        const proposal = thread.contractProposals?.[0];
        if (proposal?.projectContent) {
            return proposal.projectContent;
        }
        return "案件名未設定";
    };

    const filteredThreads = useMemo(() => {
        if (!threads) return [];
        return threads.filter((thread) => {
            if (!searchText) return true;
            const otherUser = getOtherUser(thread);
            const latestMessage = thread.messages[0]?.content || "";
            const projectTitle = getProjectTitle(thread);
            return (
                otherUser.name.toLowerCase().includes(searchText.toLowerCase()) ||
                latestMessage.toLowerCase().includes(searchText.toLowerCase()) ||
                projectTitle.toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [threads, searchText, userId]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredThreads.length / ITEMS_PER_PAGE);
    }, [filteredThreads.length]);

    const paginatedThreads = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredThreads.slice(startIndex, endIndex);
    }, [filteredThreads, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div
            style={{
                minHeight: "calc(100vh - 200px)",
                backgroundColor: "#fff",
                padding: "20px 16px",
            }}
        >
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "20px",
                    color: "#000",
                }}
            >
                メッセージ一覧
            </h1>

            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    gap: "0",
                }}
            >
                <Input
                    placeholder="キーワードで検索"
                    value={searchText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{
                        flex: 1,
                        height: "48px",
                        borderRadius: "10px 0 0 10px",
                        border: "1px solid #000",
                        fontSize: "14px",
                    }}
                />
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "#ff6d00",
                        border: "1px solid #000",
                        borderLeft: "none",
                        borderRadius: "0 10px 10px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <SearchOutlined style={{ fontSize: "20px", color: "#fff" }} />
                </div>
            </div>

            <div
                style={{
                    marginBottom: "16px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                }}
            >
                {filteredThreads.length}件のうち、{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredThreads.length)}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredThreads.length)}件を表示
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={(key: string) => {
                    setActiveTab(key as TabKey);
                    setCurrentPage(1);
                }}
                items={[
                    {
                        key: "all",
                        label: "すべて",
                    },
                    {
                        key: "scout",
                        label: "応募・スカウト",
                    },
                    {
                        key: "negotiation",
                        label: "条件交渉",
                    },
                    {
                        key: "agreed",
                        label: "条件合意",
                    },
                ]}
                style={{
                    marginBottom: "16px",
                }}
                tabBarStyle={{
                    borderBottom: "none",
                }}
            />

            {isLoading ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "400px",
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : !paginatedThreads || paginatedThreads.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "400px",
                    }}
                >
                    <Empty description="メッセージがありません" />
                </div>
            ) : (
                <>
                    <div>
                        {paginatedThreads.map((thread, index) => {
                            const otherUser = getOtherUser(thread);
                            const latestMessage = thread.messages[0];
                            const projectTitle = getProjectTitle(thread);
                            const createdDate = new Date(thread.createdAt).toLocaleDateString(
                                "ja-JP",
                                {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                }
                            );

                            return (
                                <React.Fragment key={thread.id}>
                                    {index > 0 && (
                                        <div
                                            style={{
                                                height: "1px",
                                                backgroundColor: "#d3d3d3",
                                                margin: "16px 0",
                                            }}
                                        />
                                    )}
                                    <div
                                        onClick={() => handleThreadClick(thread.id)}
                                        style={{
                                            padding: "16px 0",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "12px",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    border: "1px solid #d3d3d3",
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f0f0f0",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {otherUser.name}
                                                    </span>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <StarOutlined
                                                            style={{
                                                                fontSize: "16px",
                                                                color: "#d3d3d3",
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                fontSize: "12px",
                                                                color: "#666",
                                                            }}
                                                        >
                                                            {createdDate.replace(/\//g, ".")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#000",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    {statusLabels[thread.status] || thread.status}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#000",
                                                        marginBottom: "8px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        lineHeight: "1.4",
                                                    }}
                                                >
                                                    {projectTitle}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#666",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        lineHeight: "1.4",
                                                    }}
                                                >
                                                    {latestMessage?.content || "メッセージがありません"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "24px",
                            }}
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        border: "1px solid #000",
                                        backgroundColor: page === currentPage ? "#ff6d00" : "white",
                                        color: page === currentPage ? "white" : "black",
                                        fontSize: "14px",
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
                            {currentPage < totalPages && (
                                <button
                                    onClick={handleNextPage}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        border: "1px solid #000",
                                        backgroundColor: "white",
                                        color: "black",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <DoubleRightOutlined />
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
