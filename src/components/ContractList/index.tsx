"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Input, Spin, Empty, Pagination } from "antd";
import type { ChangeEvent } from "react";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";

type ContractListProps = {
    userId: string;
    userType: "order" | "caster";
};

const statusLabels: Record<string, string> = {
    contract: "契約完了",
    CasterCancelRequesting: "キャスト側中断リクエスト中",
    OrderCancelRequesting: "発注者側中断リクエスト中",
    DeliveredAndReviewing: "納品済み・検収中",
    completed: "完了",
};

const ITEMS_PER_PAGE = 15;

export default function ContractList({ userId, userType }: ContractListProps) {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: threads, isLoading } = trpc.message.getContractThreads.useQuery({
        userId,
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
        const proposal = thread.contractProposals[0];
        if (proposal?.projectContent) {
            return proposal.projectContent.length > 20
                ? `${proposal.projectContent.substring(0, 20)}...`
                : proposal.projectContent;
        }
        return "案件タイトル未設定";
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

    const paginatedThreads = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredThreads.slice(startIndex, endIndex);
    }, [filteredThreads, currentPage]);

    const totalPages = Math.ceil((filteredThreads.length || 0) / ITEMS_PER_PAGE);
    const startItem = filteredThreads.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredThreads.length);

    return (
        <div
            style={{
                minHeight: "calc(100vh - 200px)",
                backgroundColor: "#fff",
                padding: "40px 0",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 20px",
                }}
            >
                {/* メインコンテンツ */}
                <div>
                    <h1
                        style={{
                            fontSize: "36px",
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: "40px",
                            color: "#000",
                        }}
                    >
                        契約一覧
                    </h1>

                    <div
                        style={{
                            marginBottom: "30px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Input
                            placeholder="フリーワードで検索"
                            prefix={<SearchOutlined style={{ color: "#ff6d00" }} />}
                            value={searchText}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSearchText(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                width: "100%",
                                maxWidth: "668px",
                                height: "60px",
                                borderRadius: "10px 0 0 10px",
                                border: "1px solid #000",
                                fontSize: "16px",
                            }}
                        />
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
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
                            <SearchOutlined style={{ fontSize: "24px", color: "#fff" }} />
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: "20px",
                            textAlign: "center",
                            color: "#666",
                            fontSize: "14px",
                        }}
                    >
                        {filteredThreads.length}件のうち、{startItem}-{endItem}件を表示
                    </div>

                    <div
                        style={{
                            border: "1px solid #000",
                            borderRadius: "10px",
                            minHeight: "400px",
                            backgroundColor: "#fff",
                            marginBottom: "30px",
                        }}
                    >
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
                                <Empty description="契約がありません" />
                            </div>
                        ) : (
                            <div>
                                {paginatedThreads.map((thread, index) => {
                                    const otherUser = getOtherUser(thread);
                                    const latestMessage = thread.messages[0];
                                    const createdDate = new Date(thread.createdAt).toLocaleDateString(
                                        "ja-JP",
                                        {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        }
                                    );
                                    const projectTitle = getProjectTitle(thread);

                                    return (
                                        <React.Fragment key={thread.id}>
                                            {index > 0 && (
                                                <div
                                                    style={{
                                                        height: "1px",
                                                        backgroundColor: "#d3d3d3",
                                                        margin: "0 20px",
                                                    }}
                                                />
                                            )}
                                            <div
                                                onClick={() => handleThreadClick(thread.id)}
                                                style={{
                                                    padding: "20px",
                                                    cursor: "pointer",
                                                    transition: "background-color 0.2s",
                                                }}
                                                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                }}
                                                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                                    e.currentTarget.style.backgroundColor = "#fff";
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "15px",
                                                        alignItems: "flex-start",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            borderRadius: "50%",
                                                            border: "1px solid #d3d3d3",
                                                            backgroundColor: "#f0f0f0",
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
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
                                                            <StarOutlined
                                                                style={{
                                                                    fontSize: "20px",
                                                                    color: "#d3d3d3",
                                                                }}
                                                            />
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#000",
                                                                fontWeight: "bold",
                                                                marginBottom: "8px",
                                                            }}
                                                        >
                                                            {projectTitle}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#41659c",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                maxWidth: "500px",
                                                            }}
                                                        >
                                                            {latestMessage?.content ||
                                                                "メッセージがありません"}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "flex-end",
                                                            gap: "8px",
                                                            minWidth: "140px",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#000",
                                                            }}
                                                        >
                                                            {statusLabels[thread.status] ||
                                                                thread.status}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#000",
                                                            }}
                                                        >
                                                            {createdDate.replace(/\//g, ".")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "30px",
                            }}
                        >
                            <Pagination
                                current={currentPage}
                                total={filteredThreads.length}
                                pageSize={ITEMS_PER_PAGE}
                                onChange={(page) => setCurrentPage(page)}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
