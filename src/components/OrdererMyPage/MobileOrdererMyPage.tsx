"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Input, Button, message, Modal } from "antd";
import WorkAreaSelector, { type WorkAreaData } from "@/components/WorkAreaSelector";
import { stringArrayToWorkAreaData, workAreaDataToStringArray } from "@/lib/utils/workAreaUtils";

interface MobileOrdererMyPageProps {
    userId: string;
}

const MobileOrdererMyPage: React.FC<MobileOrdererMyPageProps> = ({ userId }) => {
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
    const [workAreaData, setWorkAreaData] = useState<WorkAreaData>({
        workAreas: [],
        travelAreas: [],
        onlineAvailable: false,
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
                desiredWorkAreas?: string[];
            };
            
            setFormData({
                fullName: profile.fullName || "",
                mainProfileImage: profile.mainProfileImage || "",
                industry: profile.industry || "",
                websiteUrl: profile.websiteUrl || [],
                residence: profile.residence || "",
            });
            
            // 希望活動エリアを読み込む
            if (profile.desiredWorkAreas && profile.desiredWorkAreas.length > 0) {
                const workAreaDataFromDb = stringArrayToWorkAreaData(profile.desiredWorkAreas);
                setWorkAreaData(workAreaDataFromDb);
            } else {
                setWorkAreaData({
                    workAreas: [],
                    travelAreas: [],
                    onlineAvailable: false,
                });
            }
        }
    }, [profileData]);

    // フォーム変更ハンドラ
    const handleFormChange = (field: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    // 希望活動エリア変更ハンドラ
    const handleWorkAreaChange = (data: WorkAreaData) => {
        setWorkAreaData(data);
        setHasChanges(true);
    };

    // 保存ハンドラ
    const handleSave = () => {
        const desiredWorkAreasStringArray = workAreaDataToStringArray(workAreaData);
        
        updateProfileMutation.mutate({
            userId,
            data: {
                fullName: formData.fullName || undefined,
                mainProfileImage: formData.mainProfileImage || undefined,
                industry: formData.industry || undefined,
                websiteUrl: formData.websiteUrl.length > 0 ? formData.websiteUrl : undefined,
                residence: formData.residence || undefined,
                desiredWorkAreas: desiredWorkAreasStringArray.length > 0 ? desiredWorkAreasStringArray : undefined,
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
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    minHeight: "100vh",
                    paddingTop: "98px",
                }}
            >
                読み込み中...
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: "#fff",
                minHeight: "100vh",
                paddingTop: "98px",
                paddingBottom: "80px",
                paddingLeft: "14px",
                paddingRight: "14px",
            }}
        >
            {/* タイトル */}
            <h1
                style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#000",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontFamily: "'Noto Sans JP', sans-serif",
                }}
            >
                マイページ
            </h1>

            {/* タブナビゲーション */}
            <div
                style={{
                    display: "flex",
                    gap: "0",
                    marginBottom: "20px",
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #e0e0e0",
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <button
                    onClick={() => handleTabClick("profile")}
                    style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: activeTab === "profile" ? "#ff6d00" : "#666",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "profile" ? "2px solid #ff6d00" : "2px solid transparent",
                        padding: "12px 20px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    プロフィール
                </button>
                <button
                    onClick={() => handleTabClick("payment")}
                    style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: activeTab === "payment" ? "#ff6d00" : "#666",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "payment" ? "2px solid #ff6d00" : "2px solid transparent",
                        padding: "12px 20px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    支払い管理
                </button>
                <button
                    onClick={() => handleTabClick("projects")}
                    style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: activeTab === "projects" ? "#ff6d00" : "#666",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "projects" ? "2px solid #ff6d00" : "2px solid transparent",
                        padding: "12px 20px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    募集中案件の確認
                </button>
            </div>

            {/* プロフィールセクション */}
            <div ref={profileSectionRef} style={{ marginBottom: "30px" }}>
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "20px",
                        border: "1px solid #e0e0e0",
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
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: "24px",
                        }}
                    >
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                backgroundColor: "#d9d9d9",
                                marginBottom: "16px",
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
                    </div>

                    {/* 表示名 */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
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
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        />
                    </div>

                    {/* 業種 */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
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
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        />
                    </div>

                    {/* 住所 */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
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
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        />
                    </div>

                    {/* ウェブサイト */}
                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            ウェブサイト
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {formData.websiteUrl.map((url, index) => (
                                <div key={index} style={{ display: "flex", gap: "8px" }}>
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
                                            fontFamily: "'Noto Sans JP', sans-serif",
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
                                            fontFamily: "'Noto Sans JP', sans-serif",
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
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                追加
                            </Button>
                        </div>
                    </div>

                    {/* 希望活動エリア */}
                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            希望活動エリア
                        </label>
                        <WorkAreaSelector
                            value={workAreaData}
                            onChange={handleWorkAreaChange}
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
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        変更を保存する
                    </Button>
                </div>
            </div>

            {/* 支払い管理セクション */}
            <div
                ref={paymentSectionRef}
                style={{
                    marginBottom: "30px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    border: "1px solid #e0e0e0",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2
                        style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#000",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        支払い管理
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => setSelectedYear(selectedYear - 1)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            ←
                        </button>
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            {selectedYear}年
                        </span>
                        <button
                            onClick={() => setSelectedYear(selectedYear + 1)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                color: "#000",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            →
                        </button>
                    </div>
                </div>
                {paymentData && (
                    <div style={{ position: "relative", marginTop: "20px" }}>
                        {/* Y軸の数値ラベル（左側） */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: "30px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                fontSize: "10px",
                                color: "#000",
                                paddingRight: "8px",
                                width: "35px",
                                fontFamily: "'Noto Sans JP', sans-serif",
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
                                marginLeft: "45px",
                                position: "relative",
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                padding: "12px",
                                height: "200px",
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
                                        top: `${(7 - index) * (160 / 7)}px`,
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
                                    gap: "4px",
                                    alignItems: "flex-end",
                                    height: "160px",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                {(() => {
                                    // Y軸の最大値（7000）を基準に計算
                                    const yAxisMax = 7000;
                                    return paymentData.monthlyData.map((data) => {
                                        const height = yAxisMax > 0 ? (data.amount / yAxisMax) * 160 : 0;
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
                                                        width: "100%",
                                                        maxWidth: "20px",
                                                        backgroundColor: "#000",
                                                        height: `${Math.max(height, data.amount > 0 ? 8 : 0)}px`,
                                                        borderRadius: "2px 2px 0 0",
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        fontSize: "7px",
                                                        color: "#999",
                                                        marginTop: "4px",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
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
                    marginBottom: "30px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    border: "1px solid #e0e0e0",
                }}
            >
                <h2
                    style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                        color: "#000",
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    募集中案件の確認
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {projectsData && projectsData.length > 0 ? (
                        projectsData.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "10px",
                                    padding: "16px",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <div style={{ marginBottom: "10px" }}>
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            color: "#000",
                                            marginBottom: "8px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        {project.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "14px",
                                            color: "#ff6d00",
                                            fontWeight: "bold",
                                            marginBottom: "8px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        {project.minBudget.toLocaleString()}円 ~ {project.maxBudget.toLocaleString()}円
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginBottom: "8px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        カテゴリ: {project.category}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "14px",
                                            color: "#333",
                                            lineHeight: "1.6",
                                            marginBottom: "8px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        {project.detail}
                                    </div>
                                    <div
                                        style={{
                                            marginTop: "8px",
                                            fontSize: "11px",
                                            color: "#999",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        登録日: {new Date(project.createdAt).toLocaleDateString("ja-JP")}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => {
                                            router.push(`/order/edit_project/${project.id}`);
                                        }}
                                        style={{
                                            borderRadius: "90px",
                                            height: "31px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            fontFamily: "'Noto Sans JP', sans-serif",
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
                                            fontSize: "12px",
                                            border: "1px solid #000",
                                            fontFamily: "'Noto Sans JP', sans-serif",
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
                                fontSize: "14px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            募集中の案件はありません
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileOrdererMyPage;
