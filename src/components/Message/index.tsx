"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";

interface MessageProps {
    threadId: string;
    userId: string;
    otherUserName: string;
}

// ステータスバッジの取得
const getStatusBadges = (currentStatus: string) => {
    const statuses = [
        { value: "scout", label: "応募\n・スカウト" },
        { value: "negotiation", label: "条件交渉" },
        { value: "agreed", label: "条件合意" },
        { value: "contract", label: "契約" },
    ];

    const currentIndex = statuses.findIndex((s) => s.value === currentStatus);
    
    return statuses.map((status, index) => ({
        ...status,
        isActive: index === currentIndex,
    }));
};

const Message = ({ threadId, userId, otherUserName }: MessageProps) => {
    const [messageContent, setMessageContent] = useState("");
    const [contractAmount, setContractAmount] = useState("");
    const [projectContent, setProjectContent] = useState("");
    const [completionYear, setCompletionYear] = useState("");
    const [completionMonth, setCompletionMonth] = useState("");
    const [completionDay, setCompletionDay] = useState("");

    // スレッド情報を取得
    const { data: thread, isLoading, refetch } = trpc.message.getThread.useQuery({
        threadId,
        userId,
    });

    // メッセージ送信
    const { mutate: sendMessage, isPending: isSending } = trpc.message.sendMessage.useMutation({
        onSuccess: () => {
            setMessageContent("");
            refetch();
        },
        onError: (error) => {
            console.error("メッセージ送信エラー:", error);
            alert("メッセージの送信に失敗しました: " + error.message);
        },
    });

    const handleSendMessage = () => {
        if (!messageContent.trim() || isSending) {
            return;
        }

        sendMessage({
            threadId,
            senderId: userId,
            content: messageContent.trim(),
        });
    };

    const handleFileSelect = () => {
        // ファイル選択の処理（今後実装）
        console.log("ファイル選択");
    };

    const handleProposeNewTerms = () => {
        // 新しい条件を提示する処理（今後実装）
        console.log("新しい条件を提示");
    };

    // 年、月、日の選択肢を生成
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontFamily: "'Noto Sans JP', sans-serif",
                }}
            >
                読み込み中...
            </div>
        );
    }

    if (!thread) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontFamily: "'Noto Sans JP', sans-serif",
                }}
            >
                スレッドが見つかりません
            </div>
        );
    }

    const status = "status" in thread ? (thread.status as string) : "scout";
    const isOrderer = thread.ordererId === userId;
    const otherUser = isOrderer ? thread.caster : thread.orderer;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                backgroundColor: "#f5f5f5",
                padding: "0",
                paddingTop: "60px",
            }}
        >
            {/* 相手の名前 */}
            <div
                style={{
                    padding: "0 282px",
                    paddingTop: "76px",
                    paddingBottom: "0",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#000",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        textAlign: "center",
                    }}
                >
                    {otherUserName || "ユーザー"}
                </p>
            </div>

            {/* ステータスバッジ */}
            <div
                style={{
                    padding: "0 282px",
                    paddingTop: "15px",
                    paddingBottom: "0",
                    display: "flex",
                    gap: "0",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {getStatusBadges(status).map((badge, index) => {
                    const badgeWidth = badge.value === "scout" ? "191px" : badge.value === "negotiation" ? "173px" : badge.value === "agreed" ? "192px" : "191px";
                    const badgeHeight = "55px";
                    
                    // 各バッジのSVGパスとviewBoxを定義
                    const getSvgConfig = () => {
                        if (badge.value === "scout") {
                            // 応募・スカウト: 左側が直線、右側が矢印
                            return {
                                viewBox: "0 0 191 55",
                                path: "M175.793 0.5L190.429 27.2549L175.793 53.7441L0.5 54.4971V0.5H175.793Z",
                            };
                        } else {
                            // 条件交渉、条件合意、契約: 両側が矢印形状
                            // 提供されたSVGは173px用なので、各バッジの幅に合わせてviewBoxを調整
                            const viewBoxWidth = badge.value === "negotiation" ? "173" : badge.value === "agreed" ? "192" : "191";
                            return {
                                viewBox: `0 0 ${viewBoxWidth} 55`,
                                path: "M159.182 0.5L172.441 27.6523L159.187 53.7324L0.805664 54.4961L13.9541 27.8789L14.0625 27.6592L13.9551 27.4385L0.800781 0.5H159.182Z",
                            };
                        }
                    };
                    
                    const svgConfig = getSvgConfig();
                    
                    return (
                        <div
                            key={index}
                            style={{
                                position: "relative",
                                height: badgeHeight,
                                width: badgeWidth,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={badgeWidth}
                                height={badgeHeight}
                                viewBox={svgConfig.viewBox}
                                fill="none"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <path
                                    d={svgConfig.path}
                                    fill={badge.isActive ? "#FEAD50" : badge.value === "scout" ? "transparent" : "white"}
                                    stroke={badge.isActive ? "#000" : "#D3D3D3"}
                                />
                            </svg>
                            <p
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    color: badge.isActive ? "#333" : "#a4a4a4",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    whiteSpace: "pre-wrap",
                                    textAlign: "center",
                                    width: badge.value === "scout" ? "147px" : "auto",
                                    lineHeight: "1.2",
                                    zIndex: 1,
                                    pointerEvents: "none",
                                }}
                            >
                                {badge.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* 情報バナー */}
            <div
                style={{
                    padding: "0 282px",
                    paddingTop: "15px",
                    paddingBottom: "0",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#f2f2f2",
                        borderRadius: "10px",
                        padding: "30px",
                        width: "1318px",
                        height: "98px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "#000",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {otherUserName || "○○"}さんからメッセージが届いています。
                        <br />
                        あなたがクライアントへを条件を提示すると、「条件交渉」のステップに進みます！
                    </p>
                </div>
            </div>

            {/* メッセージ表示エリア */}
            <div
                style={{
                    padding: "0 282px",
                    paddingTop: "15px",
                    paddingBottom: "0",
                    minHeight: "140px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                }}
            >
                {thread.messages.length > 0 ? (
                    thread.messages.map((message) => {
                        const isOwnMessage = message.senderId === userId;
                        return (
                            <div
                                key={message.id}
                                style={{
                                    display: "flex",
                                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                                    marginBottom: "15px",
                                    width: "100%",
                                }}
                            >
                                {!isOwnMessage && (
                                    <div
                                        style={{
                                            width: "55px",
                                            height: "55px",
                                            borderRadius: "10px",
                                            backgroundColor: "#d9d9d9",
                                            marginRight: "15px",
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                                <div
                                    style={{
                                        maxWidth: "830px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0",
                                        alignItems: isOwnMessage ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "white",
                                            border: "1px solid #bababa",
                                            padding: "15px",
                                            borderRadius: "10px",
                                            fontSize: "12px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            lineHeight: "1.5",
                                            wordBreak: "break-word",
                                            width: "100%",
                                            color: "#000",
                                        }}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                                {isOwnMessage && (
                                    <div
                                        style={{
                                            width: "55px",
                                            height: "55px",
                                            borderRadius: "10px",
                                            backgroundColor: "#d9d9d9",
                                            marginLeft: "15px",
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "55px",
                                height: "55px",
                                borderRadius: "10px",
                                backgroundColor: "#d9d9d9",
                                marginRight: "15px",
                                flexShrink: 0,
                            }}
                        />
                        <div
                            style={{
                                backgroundColor: "white",
                                border: "1px solid #bababa",
                                padding: "15px",
                                borderRadius: "10px",
                                fontSize: "18px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "#000",
                                width: "830px",
                            }}
                        >
                            スカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージスカウトメッセージ
                        </div>
                    </div>
                )}
            </div>

            {/* メッセージ入力エリア */}
            <div
                style={{
                    padding: "0 282px",
                    paddingTop: "15px",
                    paddingBottom: "0",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        border: "1px solid #bababa",
                        borderRadius: "10px",
                        padding: "9px",
                        width: "1360px",
                        minHeight: "393px",
                    }}
                >
                    {/* テキスト入力 */}
                    <textarea
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="ここにテキスト"
                        disabled={isSending}
                        style={{
                            width: "100%",
                            minHeight: "200px",
                            padding: "8px",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            resize: "none",
                            outline: "none",
                            backgroundColor: "transparent",
                        }}
                    />

                    {/* ファイル選択ボタンと送信ボタン */}
                    <div
                        style={{
                            marginTop: "8px",
                            marginLeft: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <button
                            onClick={handleFileSelect}
                            style={{
                                backgroundColor: "#d9d9d9",
                                border: "none",
                                borderRadius: "10px",
                                padding: "6px 17px",
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: "pointer",
                                height: "26px",
                            }}
                        >
                            ファイルを選択
                        </button>
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageContent.trim() || isSending}
                            style={{
                                backgroundColor: "#fead50",
                                border: "none",
                                borderRadius: "10px",
                                padding: "10px 46px",
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                cursor: messageContent.trim() && !isSending ? "pointer" : "not-allowed",
                                height: "39px",
                            }}
                        >
                            送信
                        </button>
                    </div>

                    {/* 区切り線 */}
                    <div
                        style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: "#000",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    />

                    {/* 契約金額 */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                width: "120px",
                            }}
                        >
                            契約金額（税抜）
                        </p>
                        <input
                            type="number"
                            value={contractAmount}
                            onChange={(e) => setContractAmount(e.target.value)}
                            placeholder="0"
                            style={{
                                width: "104px",
                                height: "25px",
                                border: "1px solid #000",
                                borderRadius: "5px",
                                padding: "0 8px",
                                fontSize: "13px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        />
                        <p
                            style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            円
                        </p>
                    </div>

                    {/* 案件内容 */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            marginBottom: "20px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                width: "120px",
                                paddingTop: "5px",
                            }}
                        >
                            案件内容
                        </p>
                        <textarea
                            value={projectContent}
                            onChange={(e) => setProjectContent(e.target.value)}
                            placeholder=""
                            style={{
                                width: "223px",
                                height: "51px",
                                border: "1px solid #000",
                                borderRadius: "5px",
                                padding: "8px",
                                fontSize: "13px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                resize: "none",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* 完了予定日 */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                width: "120px",
                            }}
                        >
                            完了予定日
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                }}
                            >
                                <select
                                    value={completionYear}
                                    onChange={(e) => setCompletionYear(e.target.value)}
                                    style={{
                                        width: "56px",
                                        height: "25px",
                                        border: "1px solid #000",
                                        borderRadius: "5px",
                                        padding: "0 20px 0 8px",
                                        fontSize: "13px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        appearance: "none",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <option value="">年</option>
                                    {years.map((year) => (
                                        <option key={year} value={year.toString()}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: "13px",
                                        color: "#000",
                                        pointerEvents: "none",
                                    }}
                                >
                                    年
                                </span>
                            </div>
                            <div
                                style={{
                                    position: "relative",
                                }}
                            >
                                <select
                                    value={completionMonth}
                                    onChange={(e) => setCompletionMonth(e.target.value)}
                                    style={{
                                        width: "56px",
                                        height: "25px",
                                        border: "1px solid #000",
                                        borderRadius: "5px",
                                        padding: "0 20px 0 8px",
                                        fontSize: "13px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        appearance: "none",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <option value="">月</option>
                                    {months.map((month) => (
                                        <option key={month} value={month.toString()}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: "13px",
                                        color: "#000",
                                        pointerEvents: "none",
                                    }}
                                >
                                    月
                                </span>
                            </div>
                            <div
                                style={{
                                    position: "relative",
                                }}
                            >
                                <select
                                    value={completionDay}
                                    onChange={(e) => setCompletionDay(e.target.value)}
                                    style={{
                                        width: "56px",
                                        height: "25px",
                                        border: "1px solid #000",
                                        borderRadius: "5px",
                                        padding: "0 20px 0 8px",
                                        fontSize: "13px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        appearance: "none",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <option value="">日</option>
                                    {days.map((day) => (
                                        <option key={day} value={day.toString()}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: "13px",
                                        color: "#000",
                                        pointerEvents: "none",
                                    }}
                                >
                                    日
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ガイドラインと新しい条件を提示するボタン */}
            <div
                style={{
                    padding: "30px 282px",
                    paddingTop: "20px",
                    paddingBottom: "0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: "400",
                        color: "#000",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        lineHeight: "1.5",
                        flex: 1,
                    }}
                >
                    <span style={{ color: "#035bde" }}>メッセージガイドライン</span>
                    に則り、ロックキャスティング以外のツールを用いたコミュニケーション、直接連絡は禁止しています。
                    <br />
                    ご契約前後に関わらず、要件説明の面談（ウェブ会議・電話連絡）など、やむを得ない事情がある場合は、
                    <span style={{ color: "#035bde" }}>サービス外連絡申請</span>
                    を行い、事務局に承認を得てください。
                </p>
                <button
                    onClick={handleProposeNewTerms}
                    style={{
                        backgroundColor: "#fead50",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 46px",
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#000",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        cursor: "pointer",
                        height: "39px",
                        width: "250px",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                    }}
                >
                    新しい条件を提示する
                </button>
            </div>
        </div>
    );
};

export default Message;


