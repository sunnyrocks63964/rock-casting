"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Tabs, Input, Spin, Empty } from "antd";
import type { ChangeEvent } from "react";
import { SearchOutlined, StarOutlined } from "@ant-design/icons";

type MessageListProps = {
    userId: string;
    userType: "order" | "caster";
};

type TabKey = "all" | "scout" | "negotiation" | "agreed";

const statusLabels: Record<string, string> = {
    scout: "応募・スカウト",
    negotiation: "条件交渉",
    agreed: "条件合意",
    completed: "完了",
    cancelled: "キャンセル",
};

export default function MessageList({ userId, userType }: MessageListProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [searchText, setSearchText] = useState("");

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

    const filteredThreads = threads?.filter((thread) => {
        if (!searchText) return true;
        const otherUser = getOtherUser(thread);
        const latestMessage = thread.messages[0]?.content || "";
        return (
            otherUser.name.toLowerCase().includes(searchText.toLowerCase()) ||
            latestMessage.toLowerCase().includes(searchText.toLowerCase())
        );
    });

    const tabItems = [
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
    ];

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
                <h1
                    style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "40px",
                        color: "#000",
                    }}
                >
                    メッセージ一覧
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
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

                <div style={{ marginBottom: "20px", textAlign: "center", color: "#666" }}>
                    {filteredThreads?.length || 0}件のメッセージスレッド
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key: string) => setActiveTab(key as TabKey)}
                    items={tabItems}
                    style={{
                        marginBottom: "0",
                    }}
                    tabBarStyle={{
                        borderBottom: "none",
                    }}
                />

                <div
                    style={{
                        border: "1px solid #000",
                        borderRadius: "10px",
                        minHeight: "400px",
                        backgroundColor: "#fff",
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
                    ) : !filteredThreads || filteredThreads.length === 0 ? (
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
                        <div>
                            {filteredThreads.map((thread, index) => {
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
                                                        width: "93px",
                                                        height: "62px",
                                                        border: "1px solid #d3d3d3",
                                                        borderRadius: "10px",
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
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        メッセージスレッド
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
                                                        {createdDate}
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
            </div>
        </div>
    );
}
