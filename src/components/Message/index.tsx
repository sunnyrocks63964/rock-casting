"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

interface MessageProps {
    threadId: string;
    userId: string;
    otherUserName: string;
}

// ステータスバッジの取得
const getStatusBadges = (currentStatus: string) => {
    // DeliveredAndReviewingステータスの場合は「納品」「検収」「完了」タブを表示
    if (currentStatus === "DeliveredAndReviewing") {
        return [
            { value: "delivered", label: "納品", isActive: true },
            { value: "reviewing", label: "検収", isActive: true },
            { value: "completed", label: "完了", isActive: false },
        ];
    }

    // completedステータスの場合は「納品」「検収」「完了」タブを表示（完了がアクティブ）
    if (currentStatus === "completed") {
        return [
            { value: "delivered", label: "納品", isActive: false },
            { value: "reviewing", label: "検収", isActive: false },
            { value: "completed", label: "完了", isActive: true },
        ];
    }

    const statuses = [
        { value: "scout", label: "応募・スカウト" },
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
    const router = useRouter();
    const [messageContent, setMessageContent] = useState("");
    const [contractAmount, setContractAmount] = useState("");
    const [projectContent, setProjectContent] = useState("");
    const [completionYear, setCompletionYear] = useState("");
    const [completionMonth, setCompletionMonth] = useState("");
    const [completionDay, setCompletionDay] = useState("");
    const [showContractForm, setShowContractForm] = useState(false);
    const [showCancellationForm, setShowCancellationForm] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");

    // スレッド情報を取得
    const { data: thread, isLoading, refetch } = trpc.message.getThread.useQuery({
        threadId,
        userId,
    });

    // Caster側の場合のみStripeアカウント情報を取得
    const isCaster = thread ? thread.casterId === userId : false;
    const { data: stripeAccountData } = trpc.profile.getCasterStripeAccount.useQuery(
        { userId },
        { enabled: isCaster && !!thread }
    );
    
    // Caster側でpayoutsEnabledがfalseの場合の判定（stripeAccountDataがundefinedの場合も含む）
    const needsPayoutRegistration = isCaster && (!stripeAccountData || !stripeAccountData.payoutsEnabled);

    // Stripe決済処理
    const { mutate: createCheckout, isPending: isCreatingCheckout } = trpc.payment.createCheckoutSession.useMutation({
        onSuccess: (data) => {
            // Stripe Checkoutページを新しいタブで開く
            if (data.checkoutUrl) {
                window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
            }
        },
        onError: (error) => {
            console.error("決済セッションの作成に失敗しました:", error);
            alert("決済セッションの作成に失敗しました。もう一度お試しください。");
        },
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

    // 契約条件提示を作成
    const { mutate: createProposal, isPending: isProposalPending } = trpc.message.createContractProposal.useMutation({
        onSuccess: () => {
            setContractAmount("");
            setProjectContent("");
            setCompletionYear("");
            setCompletionMonth("");
            setCompletionDay("");
            refetch();
        },
        onError: (error) => {
            console.error("契約条件提示エラー:", error);
            alert("契約条件提示に失敗しました: " + error.message);
        },
    });

    // 契約条件に合意
    const { mutate: agreeToProposal, isPending: isAgreeingPending } = trpc.message.agreeToProposal.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("契約条件合意エラー:", error);
            alert("契約条件合意に失敗しました: " + error.message);
        },
    });

    // 納品を行う
    const { mutate: markAsDelivered, isPending: isDelivering } = trpc.payment.markAsDelivered.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("納品エラー:", error);
            alert("納品処理に失敗しました: " + error.message);
        },
    });

    // 検収を完了
    const { mutate: completeReview, isPending: isCompletingReview } = trpc.payment.completeReview.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("検収エラー:", error);
            alert("検収処理に失敗しました: " + error.message);
        },
    });

    // 途中中断リクエスト送信
    const { mutate: requestCancellation, isPending: isRequestingCancellation } = trpc.message.requestCancellation.useMutation({
        onSuccess: () => {
            setCancellationReason("");
            setShowCancellationForm(false);
            refetch();
        },
        onError: (error) => {
            console.error("途中中断リクエストエラー:", error);
            alert("途中中断リクエストの送信に失敗しました: " + error.message);
        },
    });

    // 途中中断リクエストに同意
    const { mutate: agreeToCancellation, isPending: isAgreeingToCancellation } = trpc.message.agreeToCancellation.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("途中中断同意エラー:", error);
            alert("途中中断同意に失敗しました: " + error.message);
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
        // バリデーション: 全てのフィールドが入力されているかチェック
        if (!contractAmount.trim()) {
            return;
        }
        if (!projectContent.trim()) {
            return;
        }
        if (!completionYear || !completionMonth || !completionDay) {
            return;
        }

        // 完了予定日をISO形式に変換
        const completionDateStr = `${completionYear}-${completionMonth.padStart(2, "0")}-${completionDay.padStart(2, "0")}`;

        // 契約条件提示を作成
        createProposal({
            threadId,
            proposerId: userId,
            contractAmount: parseInt(contractAmount, 10),
            projectContent,
            completionDate: completionDateStr,
        });
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

    // 型ガード: threadが必要なプロパティを持っているか確認
    const hasRequiredProps = (obj: unknown): obj is {
        status: "scout" | "negotiation" | "agreed" | "contract" | "CasterCancelRequesting" | "OrderCancelRequesting" | "DeliveredAndReviewing" | "completed" | "cancelled";
        ordererId: string;
        casterId: string;
        orderer: { id: string; email: string; ordererProfile: { fullName: string } | null };
        caster: { id: string; email: string; casterProfile: { fullName: string } | null };
        messages: Array<{ id: string; senderId: string; content: string; createdAt: Date }>;
        contractProposals?: Array<{
            id: string;
            proposerId: string;
            contractAmount: number;
            projectContent: string;
            completionDate: Date;
            isAgreed: boolean;
            proposer: {
                id: string;
                casterProfile: { fullName: string } | null;
                ordererProfile: { fullName: string } | null;
            };
        }>;
    } => {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "status" in obj &&
            "ordererId" in obj &&
            "casterId" in obj &&
            "orderer" in obj &&
            "caster" in obj &&
            "messages" in obj
        );
    };

    if (!hasRequiredProps(thread)) {
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
                スレッドデータが不正です
            </div>
        );
    }

    const status = thread.status;
    const isOrderer = thread.ordererId === userId;
    const otherUser = isOrderer ? thread.caster : thread.orderer;

    // 決済ステータスを取得（合意済み提案がある場合のみ）
    const agreedProposal = thread.contractProposals?.find((p) => p.isAgreed);
    const { data: paymentStatus } = trpc.payment.getPaymentStatus.useQuery(
        { contractProposalId: agreedProposal?.id || "" },
        { enabled: !!agreedProposal?.id }
    );

    // 新しい条件を提示するボタンの有効/無効判定
    const isFormValid =
        status === "completed" ||
        (contractAmount.trim() &&
            projectContent.trim() &&
            completionYear &&
            completionMonth &&
            completionDay &&
            !isProposalPending);
    
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
                    // DeliveredAndReviewingやcompletedステータスの場合は「納品」「検収」「完了」タブ用の幅
                    const isDeliveryTab = badge.value === "delivered" || badge.value === "reviewing" || badge.value === "completed";
                    const badgeWidth = isDeliveryTab ? "200px" : badge.value === "scout" ? "191px" : badge.value === "negotiation" ? "173px" : badge.value === "agreed" ? "192px" : "191px";
                    const badgeHeight = "40px";
                    
                    // 各バッジのSVGパスとviewBoxを定義
                    const getSvgConfig = () => {
                        if (badge.value === "scout") {
                            // 応募・スカウト: 左側が直線、右側が矢印
                            return {
                                viewBox: "0 0 191 55",
                                path: "M175.793 0.5L190.429 27.2549L175.793 53.7441L0.5 54.4971V0.5H175.793Z",
                            };
                        } else if (isDeliveryTab) {
                            // 納品・検収・完了タブ: 両側が矢印形状（200px用）
                            return {
                                viewBox: "0 0 200 55",
                                path: "M159.182 0.5L172.441 27.6523L159.187 53.7324L0.805664 54.4961L13.9541 27.8789L14.0625 27.6592L13.9551 27.4385L0.800781 0.5H159.182Z",
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
                                preserveAspectRatio="none"
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
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: badge.isActive ? "#333" : "#a4a4a4",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    whiteSpace: "nowrap",
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
                            fontSize: "12px",
                            fontWeight: "400",
                            color: "#000",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {status === "scout" && (
                            <>
                        {otherUserName || "○○"}さんからメッセージが届いています。
                        <br />
                                あなたがクライアントへ条件を提示すると、「条件交渉」のステップに進みます！
                            </>
                        )}
                        {status === "negotiation" && (
                            <>
                                {otherUserName || "○○"}さんから「条件交渉」が届いています。
                                <br />
                                あなたが条件に合意すると、「条件合意」のステップに進みます！
                            </>
                        )}
                        {status === "agreed" && (
                            <>
                                {isOrderer ? (
                                    <>
                                        {otherUserName || "○○"}さんが条件の提示に合意を行いました。
                                        <br />
                                        契約内容を確認いただき、契約の締結をお願いいたします。
                                    </>
                                ) : (
                                    <>
                                        発注者側の契約のお手続きをお待ちください。
                                    </>
                                )}
                            </>
                        )}
                        {status === "contract" && (
                            <>
                                {isOrderer ? (
                                    <>
                                        仮払いが完了し、契約が締結されました。
                                        <br />
                                        受注者の納品をお待ちください。やむを得ない状況で途中で辞退する場合は
                                        <span
                                            onClick={() => {
                                                setShowCancellationForm(true);
                                                // ページを途中中断リクエストフォームの位置にスクロールする
                                                window.scrollTo({
                                                    top: document.getElementById("cancellation-form")?.offsetTop,
                                                    behavior: "smooth",
                                                });
                                            }}
                                            style={{
                                                color: "#006eff",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            「契約途中終了リクエスト」
                                        </span>
                                        を送信してください。
                                    </>
                                ) : (
                                    <>
                                        対応が完了した場合
                                        <span
                                            onClick={() => {
                                                setShowCancellationForm(false);
                                                // ページを一番下にスクロールする
                                                window.scrollTo({
                                                    top: document.getElementById("delivery-form")?.offsetTop,
                                                    behavior: "smooth",
                                                });
                                            }}
                                            style={{
                                                color: "#006eff",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            「納品」
                                        </span>
                                        へ進んでください。
                                        <br />
                                        やむを得ない状況で途中で辞退する場合は
                                        <span
                                            onClick={() => {
                                                setShowCancellationForm(true);
                                                // ページを一番下にスクロールする
                                                window.scrollTo({
                                                    top: document.getElementById("cancellation-form")?.offsetTop,
                                                    behavior: "smooth",
                                                });
                                            }}
                                            style={{
                                                color: "#006eff",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            「契約途中終了リクエスト」
                                        </span>
                                        を送信してください。
                                    </>
                                )}
                            </>
                        )}
                        {status === "CasterCancelRequesting" && (
                            <>
                                {isOrderer ? (
                                    <>
                                        {otherUserName || "○○"}さんが途中中断リクエストを送信しました。
                                        <br />
                                        内容をご確認いただき、同意をお願いいたします。
                                    </>
                                ) : (
                                    <>
                                        途中中断リクエストを送信しました。
                                        <br />
                                        {otherUserName || "○○"}さんの同意をお待ちください。
                                    </>
                                )}
                            </>
                        )}
                        {status === "OrderCancelRequesting" && (
                            <>
                                {isOrderer ? (
                                    <>
                                        途中中断リクエストを送信しました。
                                        <br />
                                        {otherUserName || "○○"}さんの同意をお待ちください。
                                    </>
                                ) : (
                                    <>
                                        {otherUserName || "○○"}さんが途中中断リクエストを送信しました。
                                        <br />
                                        内容をご確認いただき、同意をお願いいたします。
                                    </>
                                )}
                            </>
                        )}
                        {status === "cancelled" && (
                            <>
                                契約が途中解約されました。
                            </>
                        )}
                        {status === "completed" && (
                            <>
                                お仕事が完了しました。
                                <br />
                                お疲れ様でした！
                            </>
                        )}
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
                ) : null}
            </div>

            {/* 契約条件提示履歴 */}
            {status !== "agreed" && (() => {
                // 最新のcontractProposalのみを取得（API側でtake: 1を設定しているが、念のため最初の要素を使用）
                if (!thread.contractProposals || thread.contractProposals.length === 0) {
                    return null;
                }
                
                const latestProposal = thread.contractProposals[0];
                if (!latestProposal) {
                    return null;
                }
                
                const proposal = latestProposal;
                const proposerName = proposal.proposer.casterProfile?.fullName || proposal.proposer.ordererProfile?.fullName || "ユーザー";
                const isOwnProposal = proposal.proposerId === userId;
                const canAgree = !isOwnProposal && !proposal.isAgreed;
                const completionDate = new Date(proposal.completionDate);
                const year = completionDate.getFullYear();
                const month = completionDate.getMonth() + 1;
                const day = completionDate.getDate();
                
                return (
                    <div
                        style={{
                            padding: "0 282px",
                            paddingTop: "15px",
                            paddingBottom: "0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <div key={proposal.id}>
                            {/* 区切り線 */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "1px",
                                    backgroundColor: "#000",
                                    marginBottom: "20px",
                                }}
                            />
                            
                            {/* 条件提示メッセージ */}
                            <div
                                style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "#000",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    marginBottom: "20px",
                                    lineHeight: "1.8",
                                }}
                            >
                                {proposerName}さんが条件の提示を行いました。
                                <br />
                                条件をご確認いただき、合意をお願いいたします。
                            </div>

                            {/* 条件表示カード */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#FFFEDB",
                                        borderRadius: "10px",
                                        padding: "33px 0",
                                        width: "800px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px",
                                    }}
                                >
                                    {/* 契約金額 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            paddingLeft: "88px",
                                            gap: "250px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                color: "#000",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            契約金額（税込み）
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                {proposal.contractAmount.toLocaleString()}
                                            </p>
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
                                    </div>

                                    {/* 案件内容 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            paddingLeft: "88px",
                                            gap: "250px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                color: "#000",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            案件内容
                                        </p>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "13px",
                                                fontWeight: "400",
                                                color: "#000",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            {proposal.projectContent}
                                        </p>
                                    </div>

                                    {/* 完了予定日 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            paddingLeft: "88px",
                                            gap: "250px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                color: "#000",
                                                fontFamily: "'Noto Sans JP', sans-serif",
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
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                {year}
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                年
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                {month}
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                月
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                {day}
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                日
                                            </p>
                                        </div>
                                    </div>

                                    {/* 条件に合意するボタン */}
                                    {canAgree && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "20px",
                                            }}
                                        >
                                            {needsPayoutRegistration ? (
                                                <button
                                                    onClick={() => router.push("/caster/mypage#payout")}
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
                                                        height: "45px",
                                                        width: "350px",
                                                    }}
                                                >
                                                    まずは入金口座を登録しましょう
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => agreeToProposal({ proposalId: proposal.id, userId })}
                                                    disabled={isAgreeingPending}
                                                    style={{
                                                        backgroundColor: "#fead50",
                                                        border: "none",
                                                        borderRadius: "10px",
                                                        padding: "10px 46px",
                                                        fontSize: "16px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                        cursor: isAgreeingPending ? "not-allowed" : "pointer",
                                                        height: "39px",
                                                        width: "250px",
                                                    }}
                                                >
                                                    条件に合意する
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* 合意済みの場合 */}
                                    {proposal.isAgreed && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: "#dfdfdf",
                                                    borderRadius: "10px",
                                                    padding: "10px 46px",
                                                    fontSize: "16px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    height: "39px",
                                                    width: "250px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                条件に合意済み
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* agreedステータス時の契約条件表示と契約を行うボタン */}
            {status === "agreed" && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        // 合意済みの提案を取得
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        const proposerName = agreedProposal.proposer.casterProfile?.fullName || agreedProposal.proposer.ordererProfile?.fullName || "ユーザー";
                        const completionDate = new Date(agreedProposal.completionDate);
                        const year = completionDate.getFullYear();
                        const month = completionDate.getMonth() + 1;
                        const day = completionDate.getDate();

                        return (
                            <div>
                                {/* 区切り線 */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "1px",
                                        backgroundColor: "#000",
                                        marginBottom: "20px",
                                    }}
                                />

                                {/* 合意メッセージ（orderのみ表示） */}
                                {isOrderer && (
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            color: "#000",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            marginBottom: "20px",
                                            lineHeight: "1.8",
                                        }}
                                    >
                                        {proposerName}さんが条件の提示に合意を行いました。
                                        <br />
                                        契約内容を確認いただき、契約の締結をお願いいたします。
                                    </div>
                                )}

                                {/* 契約内容表示 */}
                                {!showContractForm ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: "#FFFEDB",
                                                borderRadius: "10px",
                                                padding: "33px 0",
                                                width: "800px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            {/* 契約金額 */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: "88px",
                                                    gap: "250px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "700",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    契約金額（税込み）
                                                </p>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {agreedProposal.contractAmount.toLocaleString()}
                                                    </p>
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
                                            </div>

                                            {/* 案件内容 */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: "88px",
                                                    gap: "250px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "700",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    案件内容
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    {agreedProposal.projectContent}
                                                </p>
                                            </div>

                                            {/* 完了予定日 */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: "88px",
                                                    gap: "250px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "700",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
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
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {year}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        年
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {month}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        月
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {day}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        日
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 条件に合意済みボタン */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    paddingTop: "20px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: "#dfdfdf",
                                                        borderRadius: "10px",
                                                        padding: "10px 46px",
                                                        fontSize: "16px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                        height: "39px",
                                                        width: "250px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    条件に合意済み
                                                </div>
                                            </div>
                                        </div>

                                        {/* 契約を行うボタン（orderのみ表示） */}
                                        {isOrderer && (
                                            <button
                                                onClick={() => setShowContractForm(true)}
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
                                                }}
                                            >
                                                契約を行う
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    /* 契約フォーム表示（orderのみ） */
                                    isOrderer && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            {/* 契約内容タイトル */}
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "20px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                契約内容
                                            </p>

                                            {/* 契約条件カード */}
                                            <div
                                                style={{
                                                    backgroundColor: "#FFFEDB",
                                                    borderRadius: "10px",
                                                    padding: "33px 0",
                                                    width: "800px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "20px",
                                                }}
                                            >
                                                {/* 契約金額 */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        paddingLeft: "88px",
                                                        gap: "250px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "700",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        契約金額（税込み）
                                                    </p>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {agreedProposal.contractAmount.toLocaleString()}
                                                        </p>
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
                                                </div>

                                                {/* 案件内容 */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        paddingLeft: "88px",
                                                        gap: "250px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "700",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        案件内容
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                        }}
                                                    >
                                                        {agreedProposal.projectContent}
                                                    </p>
                                                </div>

                                                {/* 完了予定日 */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        paddingLeft: "88px",
                                                        gap: "250px",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "13px",
                                                            fontWeight: "700",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
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
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {year}
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            年
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {month}
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            月
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            {day}
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "13px",
                                                                fontWeight: "400",
                                                                color: "#000",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                            }}
                                                        >
                                                            日
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 条件に合意済みボタン */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        paddingTop: "20px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            backgroundColor: "#dfdfdf",
                                                            borderRadius: "10px",
                                                            padding: "10px 46px",
                                                            fontSize: "16px",
                                                            fontWeight: "400",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                            height: "39px",
                                                            width: "250px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        条件に合意済み
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 仮払い登録セクション（agreedステータスの場合のみ表示） */}
                                            {isOrderer && (
                                                <>
                                                    {/* 仮払い登録タイトル */}
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            fontSize: "20px",
                                                            fontWeight: "700",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                            paddingTop: "20px",
                                                        }}
                                                    >
                                                        仮払い登録
                                                    </p>

                                                    {/* 仮払い説明文 */}
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#000",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                            lineHeight: "1.8",
                                                        }}
                                                    >
                                                        <p style={{ margin: 0 }}>
                                                            キャストへの報酬を担保するため仮払いを行わせていただいております。
                                                        </p>
                                                        <p style={{ margin: 0 }}>&nbsp;</p>
                                                        <p style={{ margin: 0 }}>
                                                            万が一キャストと連絡が取れなくなり、案件の継続が難しい場合には全額を返金させていただきます。
                                                        </p>
                                                        <p style={{ margin: 0 }}>&nbsp;</p>
                                                        <p style={{ margin: 0 }}>
                                                            <span style={{ color: "#d70202" }}>支払い完了次第、契約合意</span>
                                                            とさせていただきますので、ご認識のほどよろしくお願いいたします。
                                                        </p>
                                                    </div>

                                                    {/* 決済を行い契約を行うボタン */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            paddingTop: "20px",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                // Stripe決済セッションを作成してリダイレクト
                                                                createCheckout({
                                                                    contractProposalId: agreedProposal.id,
                                                                    threadId,
                                                                    userId,
                                                                });
                                                            }}
                                                            disabled={isCreatingCheckout}
                                                            style={{
                                                                backgroundColor: isCreatingCheckout ? "#999" : "#d70202",
                                                                border: "none",
                                                                borderRadius: "90px",
                                                                padding: "0",
                                                                fontSize: "24px",
                                                                fontWeight: "700",
                                                                color: "#fff",
                                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                                cursor: isCreatingCheckout ? "not-allowed" : "pointer",
                                                                height: "74px",
                                                                width: "402px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            {isCreatingCheckout ? "処理中..." : "決済を行い契約を行う"}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* contractステータスかつ決済完了時の表示（Orderer向け） */}
            {status === "contract" && isOrderer && paymentStatus?.exists && paymentStatus.status === "paid" && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        // 合意済みの提案を取得
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        return (
                            <div>
                                {/* 区切り線 */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "1px",
                                        backgroundColor: "#000",
                                        marginBottom: "20px",
                                    }}
                                />

                                {!showCancellationForm ? (
                                    <>
                                        {/* 決済完了メッセージ */}
                                        <div
                                            style={{
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: "10px",
                                                padding: "20px",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                                color: "#000",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                lineHeight: "1.8",
                                                textAlign: "center",
                                            }}
                                        >
                                            仮払いが完了し、契約が締結されました。
                                            <br />
                                            受注者の納品をお待ちください。
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* 途中中断リクエストフォーム */}
                                        <div
                                            id="cancellation-form"
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                gap: "20px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "20px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                途中中断リクエスト
                                            </p>
                                            <div
                                                style={{
                                                    fontSize: "18px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    lineHeight: "1.8",
                                                }}
                                            >
                                                キャンセル料については、下記をご確認の上申請をお願いいたします。
                                                <br />
                                                <span style={{ color: "#006eff", fontSize: "15px" }}>
                                                    ・発注者都合によるキャンセル料について
                                                </span>
                                                <br />
                                                <span style={{ color: "#006eff", fontSize: "15px" }}>
                                                    ・受注者都合によるキャンセル料について
                                                </span>
                                                <br />
                                                <br />
                                                また、キャンセル理由についてもご記載をお願いいたします。
                                            </div>
                                            <textarea
                                                value={cancellationReason}
                                                onChange={(e) => setCancellationReason(e.target.value)}
                                                placeholder="キャンセル理由について詳しくご記載ください。"
                                                style={{
                                                    width: "800px",
                                                    height: "111px",
                                                    border: "1px solid #000",
                                                    borderRadius: "10px",
                                                    padding: "11px",
                                                    fontSize: "18px",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    resize: "none",
                                                    outline: "none",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    width: "100%",
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        if (cancellationReason.trim()) {
                                                            requestCancellation({
                                                                threadId,
                                                                userId,
                                                                reason: cancellationReason,
                                                            });
                                                        }
                                                    }}
                                                    disabled={!cancellationReason.trim() || isRequestingCancellation}
                                                    style={{
                                                        backgroundColor: !cancellationReason.trim() || isRequestingCancellation ? "#999" : "#d70202",
                                                        border: "none",
                                                        borderRadius: "90px",
                                                        padding: "0",
                                                        fontSize: "24px",
                                                        fontWeight: "700",
                                                        color: "#fff",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                        cursor: !cancellationReason.trim() || isRequestingCancellation ? "not-allowed" : "pointer",
                                                        height: "74px",
                                                        width: "402px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {isRequestingCancellation ? "送信中..." : "途中中断リクエストを送信する"}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* CasterCancelRequestingステータス時の表示（Orderer向け） */}
            {status === "CasterCancelRequesting" && isOrderer && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        const completionDate = new Date(agreedProposal.completionDate);
                        const year = completionDate.getFullYear();
                        const month = completionDate.getMonth() + 1;
                        const day = completionDate.getDate();

                        return (
                            <div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "1px",
                                        backgroundColor: "#000",
                                        marginBottom: "20px",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#FFFEDB",
                                            borderRadius: "10px",
                                            padding: "33px 88px",
                                            width: "800px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                契約金額（税込み）
                                            </p>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                {agreedProposal.contractAmount.toLocaleString()}円
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                案件内容
                                            </p>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                {agreedProposal.projectContent}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                完了予定日
                                            </p>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                {year}年{month}月{day}日
                                            </p>
                                        </div>
                                    </div>
                                    {thread.cancellationReason && (
                                        <div
                                            style={{
                                                backgroundColor: "#FFFEDB",
                                                borderRadius: "10px",
                                                padding: "33px 88px",
                                                width: "800px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                    キャンセル理由
                                                </p>
                                                <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                    {thread.cancellationReason}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            agreeToCancellation({
                                                threadId,
                                                userId,
                                            });
                                        }}
                                        disabled={isAgreeingToCancellation}
                                        style={{
                                            backgroundColor: isAgreeingToCancellation ? "#999" : "#fead50",
                                            border: "none",
                                            borderRadius: "10px",
                                            padding: "10px 40px",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            color: "#000",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: isAgreeingToCancellation ? "not-allowed" : "pointer",
                                            height: "39px",
                                            width: "250px",
                                        }}
                                    >
                                        {isAgreeingToCancellation ? "処理中..." : "同意を行う"}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* OrderCancelRequestingステータス時の表示（Caster向け） */}
            {status === "OrderCancelRequesting" && !isOrderer && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        const completionDate = new Date(agreedProposal.completionDate);
                        const year = completionDate.getFullYear();
                        const month = completionDate.getMonth() + 1;
                        const day = completionDate.getDate();

                        return (
                            <div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "1px",
                                        backgroundColor: "#000",
                                        marginBottom: "20px",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#FFFEDB",
                                            borderRadius: "10px",
                                            padding: "33px 88px",
                                            width: "800px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                契約金額（税込み）
                                            </p>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                {agreedProposal.contractAmount.toLocaleString()}円
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                案件内容
                                            </p>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                {agreedProposal.projectContent}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                完了予定日
                                            </p>
                                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                {year}年{month}月{day}日
                                            </p>
                                        </div>
                                    </div>
                                    {thread.cancellationReason && (
                                        <div
                                            style={{
                                                backgroundColor: "#FFFEDB",
                                                borderRadius: "10px",
                                                padding: "33px 88px",
                                                width: "800px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", fontFamily: "'Noto Sans JP', sans-serif" }}>
                                                    キャンセル理由
                                                </p>
                                                <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#000", fontFamily: "'Noto Sans JP', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                    {thread.cancellationReason}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            agreeToCancellation({
                                                threadId,
                                                userId,
                                            });
                                        }}
                                        disabled={isAgreeingToCancellation}
                                        style={{
                                            backgroundColor: isAgreeingToCancellation ? "#999" : "#fead50",
                                            border: "none",
                                            borderRadius: "10px",
                                            padding: "10px 40px",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            color: "#000",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: isAgreeingToCancellation ? "not-allowed" : "pointer",
                                            height: "39px",
                                            width: "250px",
                                        }}
                                    >
                                        {isAgreeingToCancellation ? "処理中..." : "同意を行う"}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* contractステータスかつ決済完了時の表示（Caster向け） */}
            {status === "contract" && !isOrderer && paymentStatus?.exists && paymentStatus.status === "paid" && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        // 合意済みの提案を取得
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        const completionDate = new Date(agreedProposal.completionDate);
                        const year = completionDate.getFullYear();
                        const month = completionDate.getMonth() + 1;
                        const day = completionDate.getDate();
                        const isDelivered = paymentStatus?.casterPayoutStatus === "delivered" || paymentStatus?.casterPayoutStatus === "transferred";

                        return (
                            <div>
                                {/* 区切り線、契約内容タイトル、契約条件カード */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "0",
                                    }}
                                >
                                    {/* 区切り線 */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "1px",
                                            backgroundColor: "#000",
                                            marginBottom: "20px",
                                        }}
                                    />

                                    {/* 契約内容タイトル */}
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#000",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        契約内容
                                    </p>

                                    {/* 契約条件カード */}
                                    <div
                                        style={{
                                            backgroundColor: "#FFFEDB",
                                            borderRadius: "10px",
                                            padding: "33px 0",
                                            width: "800px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
                                        {/* 案件内容 */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingLeft: "88px",
                                                gap: "250px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                案件内容
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                {agreedProposal.projectContent}
                                            </p>
                                        </div>

                                        {/* 納品日 */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingLeft: "88px",
                                                gap: "250px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                納品日
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    {year}
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    年
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    {month}
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    月
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    {day}
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "13px",
                                                        fontWeight: "400",
                                                        color: "#000",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    日
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!showCancellationForm ? (
                                    <>
                                        {/* 納品を行うボタン */}
                                        <div
                                            id="delivery-form"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "20px",
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    if (agreedProposal?.id && !isDelivered) {
                                                        markAsDelivered({
                                                            contractProposalId: agreedProposal.id,
                                                            userId,
                                                        });
                                                    }
                                                }}
                                                disabled={isDelivering || isDelivered}
                                                style={{
                                                    backgroundColor: isDelivering || isDelivered ? "#999" : "#d70202",
                                                    border: "none",
                                                    borderRadius: "90px",
                                                    padding: "0",
                                                    fontSize: "24px",
                                                    fontWeight: "700",
                                                    color: "#fff",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    cursor: isDelivering || isDelivered ? "not-allowed" : "pointer",
                                                    height: "74px",
                                                    width: "402px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {isDelivering ? "処理中..." : isDelivered ? "納品済み" : "納品を行う"}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* 途中中断リクエストフォーム */}
                                        <div
                                            id="cancellation-form"
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                paddingTop: "20px",
                                                gap: "20px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "20px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                途中中断リクエスト
                                            </p>
                                            <div
                                                style={{
                                                    fontSize: "18px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    lineHeight: "1.8",
                                                }}
                                            >
                                                キャンセル料については、下記をご確認の上申請をお願いいたします。
                                                <br />
                                                <span style={{ color: "#006eff", fontSize: "15px" }}>
                                                    ・発注者都合によるキャンセル料について
                                                </span>
                                                <br />
                                                <span style={{ color: "#006eff", fontSize: "15px" }}>
                                                    ・受注者都合によるキャンセル料について
                                                </span>
                                                <br />
                                                <br />
                                                また、キャンセル理由についてもご記載をお願いいたします。
                                            </div>
                                            <textarea
                                                value={cancellationReason}
                                                onChange={(e) => setCancellationReason(e.target.value)}
                                                placeholder="キャンセル理由について詳しくご記載ください。"
                                                style={{
                                                    width: "800px",
                                                    height: "111px",
                                                    border: "1px solid #000",
                                                    borderRadius: "10px",
                                                    padding: "11px",
                                                    fontSize: "18px",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    resize: "none",
                                                    outline: "none",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    width: "100%",
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        if (cancellationReason.trim()) {
                                                            requestCancellation({
                                                                threadId,
                                                                userId,
                                                                reason: cancellationReason,
                                                            });
                                                        }
                                                    }}
                                                    disabled={!cancellationReason.trim() || isRequestingCancellation}
                                                    style={{
                                                        backgroundColor: !cancellationReason.trim() || isRequestingCancellation ? "#999" : "#d70202",
                                                        border: "none",
                                                        borderRadius: "90px",
                                                        padding: "0",
                                                        fontSize: "24px",
                                                        fontWeight: "700",
                                                        color: "#fff",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                        cursor: !cancellationReason.trim() || isRequestingCancellation ? "not-allowed" : "pointer",
                                                        height: "74px",
                                                        width: "402px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {isRequestingCancellation ? "送信中..." : "途中中断リクエストを送信する"}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* DeliveredAndReviewingステータス時の表示（Caster側） */}
            {status === "DeliveredAndReviewing" && !isOrderer && paymentStatus?.exists && paymentStatus.status === "paid" && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        const ordererName = thread.orderer.ordererProfile?.fullName || thread.orderer.email || "発注者";

                        return (
                            <div>
                                {/* 区切り線、契約内容タイトル、契約条件カード */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "0",
                                    }}
                                >
                                    {/* 区切り線 */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "1px",
                                            backgroundColor: "#000",
                                            marginBottom: "20px",
                                        }}
                                    />

                                    {/* 契約内容タイトル */}
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#000",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        契約内容
                                    </p>

                                    {/* 契約条件カード */}
                                    <div
                                        style={{
                                            backgroundColor: "#FFFEDB",
                                            borderRadius: "10px",
                                            padding: "33px 0",
                                            width: "800px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
                                        {/* 案件内容 */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingLeft: "88px",
                                                gap: "250px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                案件内容
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                {agreedProposal.projectContent}
                                            </p>
                                        </div>

                                        {/* 納品日 */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingLeft: "88px",
                                                gap: "250px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: "#000",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                }}
                                            >
                                                納品日
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                }}
                                            >
                                                {(() => {
                                                    const completionDate = new Date(agreedProposal.completionDate);
                                                    const year = completionDate.getFullYear();
                                                    const month = completionDate.getMonth() + 1;
                                                    const day = completionDate.getDate();
                                                    return (
                                                        <>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: "13px",
                                                                    fontWeight: "400",
                                                                    color: "#000",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                {year}
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: "13px",
                                                                    fontWeight: "400",
                                                                    color: "#000",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                年
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: "13px",
                                                                    fontWeight: "400",
                                                                    color: "#000",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                {month}
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: "13px",
                                                                    fontWeight: "400",
                                                                    color: "#000",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                月
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: "13px",
                                                                    fontWeight: "400",
                                                                    color: "#000",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                {day}
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: "13px",
                                                                    fontWeight: "400",
                                                                    color: "#000",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                }}
                                                            >
                                                                日
                                                            </p>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 検収中メッセージ */}
                                <div
                                    style={{
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        fontSize: "14px",
                                        fontWeight: "400",
                                        color: "#000",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        lineHeight: "1.8",
                                        textAlign: "center",
                                    }}
                                >
                                    {ordererName}さんが検収中です。
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* DeliveredAndReviewingステータス時の表示（Order側） */}
            {status === "DeliveredAndReviewing" && isOrderer && paymentStatus?.exists && paymentStatus.status === "paid" && thread.contractProposals && thread.contractProposals.length > 0 && (
                <div
                    style={{
                        padding: "0 282px",
                        paddingTop: "15px",
                        paddingBottom: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {(() => {
                        const agreedProposal = thread.contractProposals.find((p) => p.isAgreed);
                        if (!agreedProposal) {
                            return null;
                        }

                        const casterName = thread.caster.casterProfile?.fullName || thread.caster.email || "受注者";
                        const ordererName = thread.orderer.ordererProfile?.fullName || thread.orderer.email || "発注者";

                        return (
                            <div>
                                {/* 区切り線 */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "1px",
                                        backgroundColor: "#000",
                                        marginBottom: "20px",
                                    }}
                                />

                                {/* 納品完了メッセージ */}
                                <div
                                    style={{
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        fontSize: "14px",
                                        fontWeight: "400",
                                        color: "#000",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        lineHeight: "1.8",
                                        textAlign: "center",
                                    }}
                                >
                                    {casterName}さんが納品を完了しました。
                                    <br />
                                    {ordererName}さんは内容確認の上、検収処理をお願いいたします。
                                </div>

                                {/* 検収を行うボタン */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        paddingTop: "20px",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            if (agreedProposal?.id) {
                                                completeReview({
                                                    contractProposalId: agreedProposal.id,
                                                    userId,
                                                });
                                            }
                                        }}
                                        disabled={isCompletingReview}
                                        style={{
                                            backgroundColor: isCompletingReview ? "#999" : "#FEAD50",
                                            border: "none",
                                            borderRadius: "90px",
                                            padding: "0",
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            color: "#fff",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: isCompletingReview ? "not-allowed" : "pointer",
                                            height: "74px",
                                            width: "402px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {isCompletingReview ? "処理中..." : "検収完了"}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

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
                                        width: "70px",
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
                                    <option value=""></option>
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
                                    <option value=""></option>
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
                                    <option value=""></option>
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
                    padding: "40px 282px",
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
                {needsPayoutRegistration ? (
                    <button
                        onClick={() => router.push("/caster/mypage#payout")}
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
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                        }}
                    >
                        まずは入金口座を登録しましょう
                    </button>
                ) : (
                    <button
                        onClick={handleProposeNewTerms}
                        disabled={!isFormValid}
                        style={{
                            backgroundColor: !isFormValid ? "#d9d9d9" : "#fead50",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 46px",
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "#000",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            cursor: !isFormValid ? "not-allowed" : "pointer",
                            height: "39px",
                            width: "250px",
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                        }}
                    >
                        新しい条件を提示する
                    </button>
                )}
            </div>
        </div>
    );
};

export default Message;


