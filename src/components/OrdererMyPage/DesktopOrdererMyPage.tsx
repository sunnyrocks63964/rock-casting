"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Input, Button, message, Modal } from "antd";

const { TextArea } = Input;

interface DesktopOrdererMyPageProps {
    userId: string;
}

const DesktopOrdererMyPage: React.FC<DesktopOrdererMyPageProps> = ({ userId }) => {
    const router = useRouter();
    
    // データ取得
    const { data: profileData, isLoading, refetch } = trpc.profile.getOrdererProfile.useQuery({
        userId,
    });

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { data: paymentData } = trpc.profile.getOrdererPayments.useQuery({
        ordererId: userId,
        year: selectedYear,
    });

    const { data: projectsData, refetch: refetchProjects } = trpc.profile.getOrdererProjects.useQuery({
        userId,
    });

    // 状態管理
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        fullName: "",
        mainProfileImage: "",
        industry: "",
        websiteUrl: [] as string[],
        residence: "",
    });

    // スクロール用のref
    const profileSectionRef = useRef<HTMLDivElement>(null);
    const paymentSectionRef = useRef<HTMLDivElement>(null);
    const projectsSectionRef = useRef<HTMLDivElement>(null);
    const mainProfileImageInputRef = useRef<HTMLInputElement>(null);

    // プロフィール更新
    const updateProfileMutation = trpc.profile.updateOrdererProfile.useMutation({
        onSuccess: () => {
            message.success("プロフィールを更新しました");
            setHasChanges(false);
            refetch();
        },
        onError: (error) => {
            message.error(`更新に失敗しました: ${error.message}`);
        },
    });

    // 案件削除
    const deleteProjectMutation = trpc.project.deleteProject.useMutation({
        onSuccess: () => {
            message.success("案件を削除しました");
            refetchProjects();
        },
        onError: (error) => {
            message.error(`案件の削除に失敗しました: ${error.message}`);
        },
    });

    // 案件削除の確認と実行
    const handleDeleteProject = (projectId: string) => {
        Modal.confirm({
            title: "案件を削除します",
            okText: "削除",
            okType: "danger",
            cancelText: "キャンセル",
            onOk: () => {
                deleteProjectMutation.mutate({
                    projectId,
                    userId,
                });
            },
        });
    };

    // データを読み込んだら初期値を設定
    useEffect(() => {
        if (profileData) {
            const profile = profileData as typeof profileData & {
                mainProfileImage?: string | null;
                industry?: string | null;
                websiteUrl?: string[];
                residence?: string | null;
            };
            
            setFormData({
                fullName: profile.fullName || "",
                mainProfileImage: profile.mainProfileImage || "",
                industry: profile.industry || "",
                websiteUrl: profile.websiteUrl || [],
                residence: profile.residence || "",
            });
        }
    }, [profileData]);

    // フォーム変更ハンドラ
    const handleFormChange = (field: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    // 保存ハンドラ
    const handleSave = () => {
        updateProfileMutation.mutate({
            userId,
            data: {
                fullName: formData.fullName || undefined,
                mainProfileImage: formData.mainProfileImage || undefined,
                industry: formData.industry || undefined,
                websiteUrl: formData.websiteUrl.length > 0 ? formData.websiteUrl : undefined,
                residence: formData.residence || undefined,
            },
        });
    };

    // タブクリック時のスクロール処理
    const handleTabClick = (key: string) => {
        setActiveTab(key);
        setTimeout(() => {
            if (key === "profile" && profileSectionRef.current) {
                profileSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (key === "payment" && paymentSectionRef.current) {
                paymentSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (key === "projects" && projectsSectionRef.current) {
                projectsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    if (isLoading) {
        return <div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>;
    }

    return (
        <div
            style={{
                backgroundColor: "#fff",
                minHeight: "100vh",
                paddingTop: "118px",
                paddingBottom: "60px",
            }}
        >
            {/* タイトル */}
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    marginBottom: "40px",
                    color: "#000",
                    backgroundColor: "#fff",
                    padding: "20px 0",
                }}
            >
                マイページ
            </h1>

            {/* タブナビゲーション */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0",
                    marginBottom: "40px",
                    backgroundColor: "#fff",
                    padding: "20px 0",
                }}
            >
                <button
                    onClick={() => handleTabClick("profile")}
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "profile" ? "3px solid #ff6d00" : "none",
                        padding: "10px 40px",
                        cursor: "pointer",
                    }}
                >
                    プロフィール
                </button>
                <button
                    onClick={() => handleTabClick("payment")}
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "payment" ? "3px solid #ff6d00" : "none",
                        padding: "10px 40px",
                        cursor: "pointer",
                    }}
                >
                    支払い管理
                </button>
                <button
                    onClick={() => handleTabClick("projects")}
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "projects" ? "3px solid #ff6d00" : "none",
                        padding: "10px 40px",
                        cursor: "pointer",
                    }}
                >
                    募集中案件の確認
                </button>
            </div>

            <div
                style={{
                    maxWidth: "1640px",
                    margin: "0 auto",
                    padding: "0 20px",
                }}
            >
                {/* プロフィールセクション */}
                <div ref={profileSectionRef} style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
                        {/* 左側固定プロフィール */}
                        <div
                            style={{
                                width: "262px",
                                flexShrink: 0,
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                padding: "30px",
                                position: "sticky",
                                top: "20px",
                            }}
                        >
                            {/* プロフィール画像 */}
                            <input
                                ref={mainProfileImageInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) {
                                        return;
                                    }

                                    // 画像ファイルかチェック
                                    if (!file.type.startsWith("image/")) {
                                        message.error("画像ファイルを選択してください");
                                        return;
                                    }

                                    // FileReaderで画像を読み込む
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const result = event.target?.result;
                                        if (typeof result === "string") {
                                            handleFormChange("mainProfileImage", result);
                                        }
                                    };
                                    reader.onerror = () => {
                                        message.error("画像の読み込みに失敗しました");
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    backgroundColor: "#d9d9d9",
                                    margin: "0 auto 20px",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => {
                                    mainProfileImageInputRef.current?.click();
                                }}
                            >
                                {formData.mainProfileImage ? (
                                    <img
                                        src={formData.mainProfileImage}
                                        alt="プロフィール"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            textAlign: "center",
                                        }}
                                    >
                                        画像を選択
                                    </div>
                                )}
                            </div>

                            {/* 表示名 */}
                            <div style={{ marginBottom: "20px" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: "bold",
                                        marginBottom: "10px",
                                        fontSize: "16px",
                                        color: "#000",
                                    }}
                                >
                                    表示名
                                </label>
                                <Input
                                    value={formData.fullName}
                                    onChange={(e) => handleFormChange("fullName", e.target.value)}
                                    placeholder="山田 花子"
                                    style={{
                                        borderRadius: "10px",
                                        border: "1px solid #000",
                                        height: "39px",
                                    }}
                                />
                            </div>

                            {/* 保存ボタン */}
                            <Button
                                type="primary"
                                danger
                                size="large"
                                block
                                disabled={!hasChanges}
                                loading={updateProfileMutation.isPending}
                                onClick={handleSave}
                                style={{
                                    borderRadius: "90px",
                                    height: "40px",
                                    fontWeight: "bold",
                                    backgroundColor: hasChanges ? "#d70202" : "#ccc",
                                    border: "none",
                                }}
                            >
                                変更を保存する
                            </Button>
                        </div>

                        {/* 右側詳細情報 */}
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "10px",
                                    padding: "40px",
                                }}
                            >
                                {/* 業種 */}
                                <div style={{ marginBottom: "40px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                            fontSize: "16px",
                                            color: "#000",
                                        }}
                                    >
                                        業種
                                    </label>
                                    <Input
                                        value={formData.industry}
                                        onChange={(e) => handleFormChange("industry", e.target.value)}
                                        placeholder="例: 広告代理店"
                                        style={{
                                            borderRadius: "10px",
                                            border: "1px solid #000",
                                            height: "39px",
                                        }}
                                    />
                                </div>

                                {/* 住所 */}
                                <div style={{ marginBottom: "40px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                            fontSize: "16px",
                                            color: "#000",
                                        }}
                                    >
                                        住所
                                    </label>
                                    <Input
                                        value={formData.residence}
                                        onChange={(e) => handleFormChange("residence", e.target.value)}
                                        placeholder="東京都千代田区丸の内1丁目9-1"
                                        style={{
                                            borderRadius: "10px",
                                            border: "1px solid #000",
                                            height: "39px",
                                        }}
                                    />
                                </div>

                                {/* ウェブサイト */}
                                <div style={{ marginBottom: "40px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                            fontSize: "16px",
                                            color: "#000",
                                        }}
                                    >
                                        ウェブサイト
                                    </label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {formData.websiteUrl.map((url, index) => (
                                            <div key={index} style={{ display: "flex", gap: "10px" }}>
                                                <Input
                                                    value={url}
                                                    onChange={(e) => {
                                                        const newUrls = [...formData.websiteUrl];
                                                        newUrls[index] = e.target.value;
                                                        handleFormChange("websiteUrl", newUrls);
                                                    }}
                                                    placeholder="https://example.com"
                                                    style={{
                                                        flex: 1,
                                                        borderRadius: "10px",
                                                        border: "1px solid #000",
                                                        height: "39px",
                                                    }}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        const newUrls = formData.websiteUrl.filter((_, i) => i !== index);
                                                        handleFormChange("websiteUrl", newUrls);
                                                    }}
                                                    style={{
                                                        borderRadius: "10px",
                                                        border: "1px solid #000",
                                                        height: "39px",
                                                    }}
                                                >
                                                    削除
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => {
                                                handleFormChange("websiteUrl", [...formData.websiteUrl, ""]);
                                            }}
                                            style={{
                                                borderRadius: "10px",
                                                border: "1px solid #000",
                                                height: "39px",
                                                width: "fit-content",
                                            }}
                                        >
                                            追加
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 支払い管理セクション */}
                <div
                    ref={paymentSectionRef}
                    style={{
                        marginBottom: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "30px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}>
                            支払い管理
                        </h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button
                                onClick={() => setSelectedYear(selectedYear - 1)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                ←
                            </button>
                            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}>{selectedYear}年</span>
                            <button
                                onClick={() => setSelectedYear(selectedYear + 1)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                →
                            </button>
                        </div>
                    </div>
                    {paymentData && (
                        <div style={{ position: "relative", marginTop: "40px" }}>
                            {/* Y軸の数値ラベル（左側） */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    bottom: "40px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    fontSize: "14px",
                                    color: "#000",
                                    paddingRight: "20px",
                                    width: "50px",
                                }}
                            >
                                <div>7,000</div>
                                <div>6,000</div>
                                <div>5,000</div>
                                <div>4,000</div>
                                <div>3,000</div>
                                <div>2,000</div>
                                <div>1,000</div>
                                <div>0</div>
                            </div>
                            {/* グラフエリア */}
                            <div
                                style={{
                                    marginLeft: "70px",
                                    position: "relative",
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    height: "280px",
                                }}
                            >
                                {/* 水平グリッドライン */}
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            top: `${(7 - index) * (240 / 7)}px`,
                                            height: "1px",
                                            backgroundColor: "#ff6b35",
                                            opacity: 0.3,
                                        }}
                                    />
                                ))}
                                {/* 棒グラフ */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "flex-end",
                                        height: "240px",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    {(() => {
                                        // Y軸の最大値（7000）を基準に計算
                                        const yAxisMax = 7000;
                                        return paymentData.monthlyData.map((data) => {
                                            const height = yAxisMax > 0 ? (data.amount / yAxisMax) * 240 : 0;
                                            return (
                                                <div
                                                    key={data.month}
                                                    style={{
                                                        flex: 1,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: "25px",
                                                            backgroundColor: "#000",
                                                            height: `${Math.max(height, data.amount > 0 ? 10 : 0)}px`,
                                                        }}
                                                    />
                                                    <div style={{ fontSize: "14px", color: "#999" }}>
                                                        {data.month}月
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 募集中案件の確認セクション */}
                <div
                    ref={projectsSectionRef}
                    style={{
                        marginBottom: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "30px",
                    }}
                >
                    <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#000" }}>
                        募集中案件の確認
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {projectsData && projectsData.length > 0 ? (
                            projectsData.map((project) => (
                                <div
                                    key={project.id}
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#000" }}>
                                            {project.title}
                                        </div>
                                        <div style={{ fontSize: "16px", color: "#ff6d00", fontWeight: "bold" }}>
                                            {project.minBudget.toLocaleString()}円 ~ {project.maxBudget.toLocaleString()}円
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                                        カテゴリ: {project.category}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>
                                        {project.detail}
                                    </div>
                                    <div style={{ marginTop: "10px", fontSize: "12px", color: "#999" }}>
                                        登録日: {new Date(project.createdAt).toLocaleDateString("ja-JP")}
                                    </div>
                                    <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => {
                                                router.push(`/order/edit_project/${project.id}`);
                                            }}
                                            style={{
                                                borderRadius: "90px",
                                                height: "31px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            編集する
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleDeleteProject(project.id);
                                            }}
                                            loading={deleteProjectMutation.isPending}
                                            style={{
                                                borderRadius: "90px",
                                                height: "31px",
                                                fontSize: "14px",
                                                border: "1px solid #000",
                                            }}
                                        >
                                            募集を終了する
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    color: "#999",
                                    fontSize: "16px",
                                }}
                            >
                                募集中の案件はありません
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopOrdererMyPage;
