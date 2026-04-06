"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Input, Select, InputNumber, Button, message, Checkbox, Space } from "antd";
import dayjs from "dayjs";
import JobTypeSelector, { type JobTypeSelectorData } from "@/components/JobTypeSelector";
import WorkAreaSelector, { type WorkAreaData } from "@/components/WorkAreaSelector";
import { type JobType } from "@/components/TopOrder/JobTypeFilterDetail";

const { TextArea } = Input;
const { Option } = Select;

const jobTypeLabels: Record<JobType, string> = {
    photographer: "フォトグラファー",
    model: "モデル",
    artist: "アーティスト",
    creator: "クリエイター",
};

interface DesktopCasterMyPageProps {
    userId: string;
}

const DesktopCasterMyPage: React.FC<DesktopCasterMyPageProps> = ({ userId }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // データ取得
    const { data: profileData, isLoading, refetch } = trpc.profile.getCasterProfile.useQuery({
        userId,
    });

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { data: payoutData } = trpc.profile.getCasterPayouts.useQuery({
        casterId: userId,
        year: selectedYear,
    });

    // Stripeアカウント情報を取得
    const { data: stripeAccountData, refetch: refetchStripeAccount } = trpc.profile.getCasterStripeAccount.useQuery({
        userId,
    });

    // URLパラメータでStripeから戻ってきた場合、アカウント情報を再取得
    useEffect(() => {
        const success = searchParams.get("success");
        const refresh = searchParams.get("refresh");
        if (success === "true" || refresh === "true") {
            refetchStripeAccount();
            // URLパラメータをクリア
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, [searchParams, refetchStripeAccount]);

    // URLハッシュでスクロール処理
    const payoutSectionRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const hash = window.location.hash;
        if (hash === "#payout" && payoutSectionRef.current) {
            setTimeout(() => {
                payoutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveTab("payout");
            }, 100);
        }
    }, []);

    // Stripe Connectアカウントリンク作成
    const createAccountLinkMutation = trpc.payment.createStripeConnectAccountLink.useMutation({
        onSuccess: (data) => {
            if (data.url) {
                window.open(data.url, "_blank");
            }
        },
        onError: (error) => {
            message.error(`アカウントリンクの作成に失敗しました: ${error.message}`);
        },
    });

    // Stripe Connectログインリンク作成（口座情報変更用）
    const createLoginLinkMutation = trpc.payment.createStripeConnectLoginLink.useMutation({
        onSuccess: (data) => {
            if (data.url) {
                window.open(data.url, "_blank");
            }
        },
        onError: (error) => {
            message.error(`ログインリンクの作成に失敗しました: ${error.message}`);
        },
    });

    // 状態管理
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [jobTypeData, setJobTypeData] = useState<JobTypeSelectorData>({
        selectedJobTypes: [],
    });
    const [workAreaData, setWorkAreaData] = useState<WorkAreaData>({
        workAreas: [],
        travelAreas: [],
        onlineAvailable: false,
    });
    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        achievements: "",
        mainProfileImage: "",
        subProfileImages: [] as string[],
        residence: "",
        birthYear: null as number | null,
        birthMonth: null as number | null,
        birthDay: null as number | null,
        gender: null as string | null,
        height: null as number | null,
        weight: null as number | null,
        snsInstagram: "",
        snsX: "",
        snsYoutube: "",
        snsFacebook: "",
        workStyle: [] as string[],
        minBudget: null as number | null,
        maxBudget: null as number | null,
    });

    // スクロール用のref
    const profileSectionRef = useRef<HTMLDivElement>(null);
    const previewSectionRef = useRef<HTMLDivElement>(null);
    const mainProfileImageInputRef = useRef<HTMLInputElement>(null);
    const subProfileImagesInputRef = useRef<HTMLInputElement>(null);

    // プロフィール更新
    const updateProfileMutation = trpc.profile.updateCasterProfile.useMutation({
        onSuccess: () => {
            message.success("プロフィールを更新しました");
            setHasChanges(false);
            refetch();
        },
        onError: (error) => {
            message.error(`更新に失敗しました: ${error.message}`);
        },
    });

    // データを読み込んだら初期値を設定
    useEffect(() => {
        if (profileData) {
            const profile = profileData as typeof profileData & {
                bio?: string | null;
                achievements?: string | null;
                mainProfileImage?: string | null;
                subProfileImages?: string[];
                residence?: string | null;
                birthdate?: Date | null;
                gender?: string | null;
                height?: number | null;
                weight?: number | null;
                snsInstagram?: string | null;
                snsX?: string | null;
                snsYoutube?: string | null;
                snsFacebook?: string | null;
                workStyle?: string | null;
                minBudget?: number | null;
                maxBudget?: number | null;
            };
            
            const birthdate = profile.birthdate ? dayjs(profile.birthdate) : null;
            const workStyleArray = profile.workStyle ? profile.workStyle.split(",") : [];
            
            setFormData({
                fullName: profile.fullName || "",
                bio: profile.bio || "",
                achievements: profile.achievements || "",
                mainProfileImage: profile.mainProfileImage || "",
                subProfileImages: profile.subProfileImages || [],
                residence: profile.residence || "",
                birthYear: birthdate ? birthdate.year() : null,
                birthMonth: birthdate ? birthdate.month() + 1 : null,
                birthDay: birthdate ? birthdate.date() : null,
                gender: profile.gender || null,
                height: profile.height || null,
                weight: profile.weight || null,
                snsInstagram: profile.snsInstagram || "",
                snsX: profile.snsX || "",
                snsYoutube: profile.snsYoutube || "",
                snsFacebook: profile.snsFacebook || "",
                workStyle: workStyleArray,
                minBudget: profile.minBudget || null,
                maxBudget: profile.maxBudget || null,
            });

            // 職種データをJobTypeSelectorData形式に変換
            if (profileData.jobTypes && profileData.jobTypes.length > 0) {
                const selectedJobTypes = profileData.jobTypes.map((jobType) => {
                    // スキルをカテゴリごとにグループ化
                    const skillsByCategory: Record<string, string[]> = {};
                    for (const skill of jobType.skills) {
                        if (!skillsByCategory[skill.category]) {
                            skillsByCategory[skill.category] = [];
                        }
                        skillsByCategory[skill.category].push(skill.value);
                    }

                    // JobTypeSkill形式に変換
                    const skills = Object.entries(skillsByCategory).map(([category, values]) => ({
                        category,
                        values,
                    }));

                    return {
                        jobType: jobType.jobType as "photographer" | "model" | "artist" | "creator",
                        skills,
                    };
                });

                setJobTypeData({ selectedJobTypes });
            }

            // 活動エリアデータをWorkAreaData形式に変換
            const workAreas = profileData.workAreas?.map((area) => ({
                prefectureCode: area.prefecture.code,
                tokyoWardCode: area.tokyoWard?.code,
            })) ?? [];
            
            const travelAreas = profileData.travelAreas?.map((area) => ({
                prefectureCode: area.prefecture.code,
                tokyoWardCode: area.tokyoWard?.code,
            })) ?? [];

            setWorkAreaData({
                workAreas,
                travelAreas,
                onlineAvailable: profile.onlineAvailable ?? false,
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
        const birthdate = formData.birthYear && formData.birthMonth && formData.birthDay
            ? dayjs(`${formData.birthYear}-${String(formData.birthMonth).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`).toISOString()
            : undefined;
        
        updateProfileMutation.mutate({
            userId,
            data: {
                fullName: formData.fullName || undefined,
                bio: formData.bio || undefined,
                achievements: formData.achievements || undefined,
                mainProfileImage: formData.mainProfileImage || undefined,
                subProfileImages: formData.subProfileImages.length > 0 ? formData.subProfileImages : undefined,
                residence: formData.residence || undefined,
                birthdate: birthdate,
                gender: formData.gender ? (formData.gender as "male" | "female" | "other" | "prefer_not_to_say") : undefined,
                height: formData.height || undefined,
                weight: formData.weight || undefined,
                snsInstagram: formData.snsInstagram || undefined,
                snsX: formData.snsX || undefined,
                snsYoutube: formData.snsYoutube || undefined,
                snsFacebook: formData.snsFacebook || undefined,
                workStyle: formData.workStyle.length > 0 ? formData.workStyle.join(",") : undefined,
                minBudget: formData.minBudget || undefined,
                maxBudget: formData.maxBudget || undefined,
            },
            jobTypeData: jobTypeData.selectedJobTypes.length > 0 ? jobTypeData : undefined,
            workAreaData: workAreaData.workAreas.length > 0 || workAreaData.travelAreas.length > 0 || workAreaData.onlineAvailable ? workAreaData : undefined,
        });
    };

    // タブクリック時のスクロール処理
    const handleTabClick = (key: string) => {
        setActiveTab(key);
        setTimeout(() => {
            if (key === "profile" && profileSectionRef.current) {
                profileSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (key === "payout" && payoutSectionRef.current) {
                payoutSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (key === "preview" && previewSectionRef.current) {
                previewSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    // 年・月・日の選択肢を生成
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    if (isLoading) {
        return <div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>;
    }

    const profile = profileData as typeof profileData & {
        bio?: string | null;
        achievements?: string | null;
        mainProfileImage?: string | null;
        subProfileImages?: string[];
        residence?: string | null;
        birthdate?: Date | null;
        gender?: string | null;
        height?: number | null;
        weight?: number | null;
        snsInstagram?: string | null;
        snsX?: string | null;
        snsYoutube?: string | null;
        snsFacebook?: string | null;
        workStyle?: string | null;
    };

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
                    onClick={() => handleTabClick("payout")}
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "payout" ? "3px solid #ff6d00" : "none",
                        padding: "10px 40px",
                        cursor: "pointer",
                    }}
                >
                    売上管理
                </button>
                <button
                    onClick={() => handleTabClick("preview")}
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "preview" ? "3px solid #ff6d00" : "none",
                        padding: "10px 40px",
                        cursor: "pointer",
                    }}
                >
                    表示の確認
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

                            {/* 自己紹介 */}
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
                                    自己紹介
                                    <span style={{ fontSize: "12px", fontWeight: "normal", marginLeft: "5px" }}>
                                        （100文字程度）
                                    </span>
                                </label>
                                <TextArea
                                    value={formData.bio}
                                    onChange={(e) => handleFormChange("bio", e.target.value)}
                                    placeholder="自己紹介文を入力してください"
                                    rows={5}
                                    maxLength={500}
                                    style={{
                                        borderRadius: "10px",
                                        border: "1px solid #000",
                                        minHeight: "121px",
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
                                {/* 職種 */}
                                <div style={{ marginBottom: "40px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: "bold",
                                            marginBottom: "20px",
                                            fontSize: "16px",
                                            color: "#000",
                                        }}
                                    >
                                        職種
                                    </label>
                                    <JobTypeSelector
                                        value={jobTypeData}
                                        onChange={(data) => {
                                            setJobTypeData(data);
                                            setHasChanges(true);
                                        }}
                                    />
                                </div>

                                {/* 活動エリア */}
                                <div style={{ marginBottom: "40px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: "bold",
                                            marginBottom: "20px",
                                            fontSize: "16px",
                                            color: "#000",
                                        }}
                                    >
                                        活動エリア
                                    </label>
                                    <WorkAreaSelector
                                        value={workAreaData}
                                        onChange={(data) => {
                                            setWorkAreaData(data);
                                            setHasChanges(true);
                                        }}
                                    />
                                </div>

                                {/* 実績 */}
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
                                        実績
                                    </label>
                                    <TextArea
                                        value={formData.achievements}
                                        onChange={(e) => handleFormChange("achievements", e.target.value)}
                                        placeholder="実績を入力してください"
                                        rows={4}
                                        maxLength={2000}
                                        style={{
                                            borderRadius: "10px",
                                            border: "1px solid #000",
                                            minHeight: "110px",
                                        }}
                                    />
                                </div>

                                {/* プロフィール画像 */}
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
                                        プロフィール画像
                                        <span style={{ fontSize: "12px", fontWeight: "normal", marginLeft: "5px" }}>
                                            ※最大5枚まで画像をアップロードしてください。
                                        </span>
                                    </label>
                                    <input
                                        ref={subProfileImagesInputRef}
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

                                            // 最大5枚までチェック
                                            if (formData.subProfileImages.length >= 5) {
                                                message.error("画像は最大5枚までアップロードできます");
                                                return;
                                            }

                                            // FileReaderで画像を読み込む
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const result = event.target?.result;
                                                if (typeof result === "string") {
                                                    const newImages = [...formData.subProfileImages, result];
                                                    handleFormChange("subProfileImages", newImages);
                                                }
                                            };
                                            reader.onerror = () => {
                                                message.error("画像の読み込みに失敗しました");
                                            };
                                            reader.readAsDataURL(file);

                                            // 同じファイルを選択できるようにリセット
                                            e.target.value = "";
                                        }}
                                    />
                                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                                        {formData.subProfileImages.map((img, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    width: "179px",
                                                    height: "120px",
                                                    borderRadius: "10px",
                                                    overflow: "hidden",
                                                    backgroundColor: "#f0f0f0",
                                                    position: "relative",
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`画像${index + 1}`}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                        ))}
                                        {formData.subProfileImages.length < 5 && (
                                            <div
                                                style={{
                                                    width: "179px",
                                                    height: "120px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "#d9d9d9",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    fontSize: "9px",
                                                    color: "#000",
                                                    textAlign: "center",
                                                }}
                                                onClick={() => {
                                                    subProfileImagesInputRef.current?.click();
                                                }}
                                            >
                                                画像をアップロードしてください
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 居住地 */}
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
                                        居住地
                                        <span style={{ fontSize: "12px", fontWeight: "normal", marginLeft: "5px" }}>
                                            ※発注者には都道県まで表示されます。
                                        </span>
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

                                {/* 生年月日 */}
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
                                        生年月日
                                    </label>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <Select
                                            value={formData.birthYear}
                                            onChange={(value) => handleFormChange("birthYear", value)}
                                            placeholder="年"
                                            style={{
                                                width: "109px",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {years.map((year) => (
                                                <Option key={year} value={year}>
                                                    {year}
                                                </Option>
                                            ))}
                                        </Select>
                                        <span style={{ fontSize: "16px" }}>年</span>
                                        <Select
                                            value={formData.birthMonth}
                                            onChange={(value) => handleFormChange("birthMonth", value)}
                                            placeholder="月"
                                            style={{
                                                width: "109px",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {months.map((month) => (
                                                <Option key={month} value={month}>
                                                    {month}
                                                </Option>
                                            ))}
                                        </Select>
                                        <span style={{ fontSize: "16px" }}>月</span>
                                        <Select
                                            value={formData.birthDay}
                                            onChange={(value) => handleFormChange("birthDay", value)}
                                            placeholder="日"
                                            style={{
                                                width: "109px",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {days.map((day) => (
                                                <Option key={day} value={day}>
                                                    {day}
                                                </Option>
                                            ))}
                                        </Select>
                                        <span style={{ fontSize: "16px" }}>日</span>
                                    </div>
                                </div>

                                {/* 性別 */}
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
                                        性別
                                    </label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <Checkbox
                                            checked={formData.gender === "female"}
                                            onChange={(e) => handleFormChange("gender", e.target.checked ? "female" : null)}
                                        >
                                            女性
                                        </Checkbox>
                                        <Checkbox
                                            checked={formData.gender === "male"}
                                            onChange={(e) => handleFormChange("gender", e.target.checked ? "male" : null)}
                                        >
                                            男性
                                        </Checkbox>
                                        <Checkbox
                                            checked={formData.gender === "other"}
                                            onChange={(e) => handleFormChange("gender", e.target.checked ? "other" : null)}
                                        >
                                            その他
                                        </Checkbox>
                                    </div>
                                </div>

                                {/* 身長 */}
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
                                        身長
                                    </label>
                                    <Space.Compact>
                                        <InputNumber
                                            value={formData.height}
                                            onChange={(value) => handleFormChange("height", value)}
                                            placeholder="170"
                                            min={0}
                                            max={300}
                                            style={{
                                                width: "109px",
                                                borderRadius: "10px 0 0 10px",
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "0 8px",
                                                backgroundColor: "#fafafa",
                                                border: "1px solid #d9d9d9",
                                                borderLeft: "none",
                                                borderRadius: "0 10px 10px 0",
                                                fontSize: "14px",
                                                color: "#000",
                                                minWidth: "40px",
                                            }}
                                        >
                                            cm
                                        </div>
                                    </Space.Compact>
                                </div>

                                {/* 体重 */}
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
                                        体重
                                    </label>
                                    <Space.Compact>
                                        <InputNumber
                                            value={formData.weight}
                                            onChange={(value) => handleFormChange("weight", value)}
                                            placeholder="60"
                                            min={0}
                                            max={500}
                                            style={{
                                                width: "109px",
                                                borderRadius: "10px 0 0 10px",
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "0 8px",
                                                backgroundColor: "#fafafa",
                                                border: "1px solid #d9d9d9",
                                                borderLeft: "none",
                                                borderRadius: "0 10px 10px 0",
                                                fontSize: "14px",
                                                color: "#000",
                                                minWidth: "40px",
                                            }}
                                        >
                                            kg
                                        </div>
                                    </Space.Compact>
                                </div>

                                {/* SNS */}
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
                                        SNS
                                    </label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ width: "100px", fontSize: "16px" }}>Instagram</span>
                                            <Input
                                                value={formData.snsInstagram}
                                                onChange={(e) => handleFormChange("snsInstagram", e.target.value)}
                                                placeholder="URLを記入してください"
                                                style={{
                                                    flex: 1,
                                                    borderRadius: "10px",
                                                    border: "1px solid #000",
                                                    height: "39px",
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ width: "100px", fontSize: "16px" }}>X</span>
                                            <Input
                                                value={formData.snsX}
                                                onChange={(e) => handleFormChange("snsX", e.target.value)}
                                                placeholder="URLを記入してください"
                                                style={{
                                                    flex: 1,
                                                    borderRadius: "10px",
                                                    border: "1px solid #000",
                                                    height: "39px",
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ width: "100px", fontSize: "16px" }}>YouTube</span>
                                            <Input
                                                value={formData.snsYoutube}
                                                onChange={(e) => handleFormChange("snsYoutube", e.target.value)}
                                                placeholder="URLを記入してください"
                                                style={{
                                                    flex: 1,
                                                    borderRadius: "10px",
                                                    border: "1px solid #000",
                                                    height: "39px",
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ width: "100px", fontSize: "16px" }}>Facebook</span>
                                            <Input
                                                value={formData.snsFacebook}
                                                onChange={(e) => handleFormChange("snsFacebook", e.target.value)}
                                                placeholder="URLを記入してください"
                                                style={{
                                                    flex: 1,
                                                    borderRadius: "10px",
                                                    border: "1px solid #000",
                                                    height: "39px",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 活動形態 */}
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
                                        活動形態
                                    </label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <Checkbox
                                            checked={formData.workStyle.includes("フリーランス")}
                                            onChange={(e) => {
                                                const newWorkStyle = e.target.checked
                                                    ? [...formData.workStyle, "フリーランス"]
                                                    : formData.workStyle.filter((s) => s !== "フリーランス");
                                                handleFormChange("workStyle", newWorkStyle);
                                            }}
                                        >
                                            フリーランス
                                        </Checkbox>
                                        <Checkbox
                                            checked={formData.workStyle.includes("副業")}
                                            onChange={(e) => {
                                                const newWorkStyle = e.target.checked
                                                    ? [...formData.workStyle, "副業"]
                                                    : formData.workStyle.filter((s) => s !== "副業");
                                                handleFormChange("workStyle", newWorkStyle);
                                            }}
                                        >
                                            副業
                                        </Checkbox>
                                        <Checkbox
                                            checked={formData.workStyle.includes("その他")}
                                            onChange={(e) => {
                                                const newWorkStyle = e.target.checked
                                                    ? [...formData.workStyle, "その他"]
                                                    : formData.workStyle.filter((s) => s !== "その他");
                                                handleFormChange("workStyle", newWorkStyle);
                                            }}
                                        >
                                            その他
                                        </Checkbox>
                                    </div>
                                </div>

                                {/* 報酬額設定 */}
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
                                        報酬額設定
                                    </label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <InputNumber
                                            value={formData.minBudget}
                                            onChange={(value) => handleFormChange("minBudget", value)}
                                            placeholder="0"
                                            style={{
                                                width: "160px",
                                                height: "39px",
                                                fontSize: "16px",
                                                borderRadius: "10px",
                                            }}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            parser={(value) => {
                                                const parsed = value ? value.replace(/\$\s?|(,*)/g, "") : "";
                                                return parsed ? Number(parsed) : 0;
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                color: "#000",
                                            }}
                                        >
                                            円
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                margin: "0 10px",
                                                color: "#000",
                                            }}
                                        >
                                            ~
                                        </span>
                                        <InputNumber
                                            value={formData.maxBudget}
                                            onChange={(value) => handleFormChange("maxBudget", value)}
                                            placeholder="0"
                                            style={{
                                                width: "160px",
                                                height: "39px",
                                                fontSize: "16px",
                                                borderRadius: "10px",
                                            }}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            parser={(value) => {
                                                const parsed = value ? value.replace(/\$\s?|(,*)/g, "") : "";
                                                return parsed ? Number(parsed) : 0;
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                color: "#000",
                                            }}
                                        >
                                            円
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 売上管理セクション */}
                <div
                    ref={payoutSectionRef}
                    style={{
                        marginBottom: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "30px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>
                            売上管理
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
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                →
                            </button>
                        </div>
                    </div>
                    {payoutData && (
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
                                        return payoutData.monthlyData.map((data) => {
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

                {/* 表示の確認セクション */}
                <div
                    ref={previewSectionRef}
                    style={{
                        marginBottom: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "30px",
                    }}
                >
                    <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#000" }}>
                        表示の確認
                    </h2>
                    <div
                        style={{
                            border: "1px solid #000",
                            borderRadius: "10px",
                            padding: "20px",
                            display: "flex",
                            gap: "20px",
                            backgroundColor: "#fff",
                        }}
                    >
                        {/* プレビュー画像 */}
                        <div
                            style={{
                                width: "204px",
                                height: "136px",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0",
                                overflow: "hidden",
                                flexShrink: 0,
                            }}
                        >
                            {formData.mainProfileImage ? (
                                <img
                                    src={formData.mainProfileImage}
                                    alt="プレビュー"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                        color: "#999",
                                    }}
                                >
                                    画像なし
                                </div>
                            )}
                        </div>

                        {/* プレビュー情報 */}
                        <div style={{ flex: 1 }}>
                            {/* 名前と職種を同じ行に配置 */}
                            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "10px" }}>
                                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#000" }}>
                                    {formData.fullName || "名前未設定"}
                                </div>
                                <div style={{ fontSize: "16px", color: "#000" }}>
                                    {jobTypeData.selectedJobTypes.length > 0
                                        ? jobTypeData.selectedJobTypes
                                              .map((jt) => jobTypeLabels[jt.jobType] || jt.jobType)
                                              .join("、")
                                        : "職種未設定"}
                                </div>
                            </div>
                            {/* 自己紹介 */}
                            <div style={{ fontSize: "14px", color: "#333", marginBottom: "10px", lineHeight: "1.5" }}>
                                {formData.bio || "自己紹介未設定"}
                            </div>
                            {/* 基本情報 */}
                            <div style={{ fontSize: "16px", color: "#333" }}>
                                {formData.residence?.split(/[都道府県]/)[0] || "地域未設定"}/
                                {formData.birthYear
                                    ? `${currentYear - formData.birthYear}歳`
                                    : "年齢未設定"}
                                /
                                {formData.gender === "female"
                                    ? "女性"
                                    : formData.gender === "male"
                                    ? "男性"
                                    : "性別未設定"}
                                /{formData.height ? `${formData.height}cm` : "身長未設定"}
                            </div>
                        </div>

                        {/* 区切り線 */}
                        <div
                            style={{
                                width: "1px",
                                backgroundColor: "#E0E0E0",
                                alignSelf: "stretch",
                            }}
                        />

                        {/* 報酬情報 */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end", minWidth: "200px" }}>
                            {/* 固定報酬制タグ */}
                            <div
                                style={{
                                    backgroundColor: "#D38D8D",
                                    color: "#fff",
                                    borderRadius: "20px",
                                    padding: "4px 12px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                }}
                            >
                                固定報酬制
                            </div>
                            {/* 報酬額 */}
                            <div style={{ fontSize: "18px", color: "#000", fontWeight: "bold" }}>
                                {formData.minBudget && formData.maxBudget
                                    ? `${formData.minBudget.toLocaleString()}円~${formData.maxBudget.toLocaleString()}円`
                                    : formData.minBudget
                                    ? `${formData.minBudget.toLocaleString()}円~`
                                    : formData.maxBudget
                                    ? `~${formData.maxBudget.toLocaleString()}円`
                                    : "報酬額未設定"}
                            </div>
                        </div>

                        {/* 区切り線 */}
                        <div
                            style={{
                                width: "1px",
                                backgroundColor: "#E0E0E0",
                                alignSelf: "stretch",
                            }}
                        />

                        {/* アクションボタン */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end", minWidth: "200px" }}>
                            <Button
                                type="primary"
                                danger
                                onClick={() => router.push(`/cast/detail?userId=${userId}`)}
                                style={{
                                    borderRadius: "90px",
                                    height: "31px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    padding: "0 30px",
                                }}
                            >
                                詳細を確認
                            </Button>
                            <Button
                                style={{
                                    borderRadius: "90px",
                                    height: "31px",
                                    fontSize: "12px",
                                    border: "1px solid #000",
                                    padding: "0 30px",
                                }}
                            >
                                お気に入りに追加
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 入金口座登録セクション */}
                <div
                    style={{
                        marginBottom: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "30px",
                    }}
                >
                    <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#000" }}>
                        入金口座登録
                    </h2>
                    <div
                        style={{
                            border: "1px solid #000",
                            borderRadius: "10px",
                            padding: "20px",
                            backgroundColor: "#fff",
                        }}
                    >
                        {!stripeAccountData ? (
                            // Stripeアカウント未登録
                            <div>
                                <p style={{ marginBottom: "20px", fontSize: "14px", color: "#333" }}>
                                    入金を受け取るために、Stripeアカウントの登録と口座情報の登録が必要です。
                                </p>
                                <Button
                                    type="primary"
                                    danger
                                    size="large"
                                    loading={createAccountLinkMutation.isPending}
                                    onClick={() => {
                                        createAccountLinkMutation.mutate({ userId });
                                    }}
                                    style={{
                                        borderRadius: "90px",
                                        height: "40px",
                                        fontWeight: "bold",
                                        backgroundColor: "#d70202",
                                        border: "none",
                                    }}
                                >
                                    入金口座登録のためにStripeアカウントの登録をしてください
                                </Button>
                            </div>
                        ) : !stripeAccountData.payoutsEnabled ? (
                            // Stripeアカウント登録済みだが口座未登録
                            <div>
                                <p style={{ marginBottom: "20px", fontSize: "14px", color: "#333" }}>
                                    入金を受け取るために、口座情報の登録が必要です。
                                </p>
                                <Button
                                    type="primary"
                                    danger
                                    size="large"
                                    loading={createAccountLinkMutation.isPending}
                                    onClick={() => {
                                        createAccountLinkMutation.mutate({ userId });
                                    }}
                                    style={{
                                        borderRadius: "90px",
                                        height: "40px",
                                        fontWeight: "bold",
                                        backgroundColor: "#d70202",
                                        border: "none",
                                    }}
                                >
                                    入金口座登録をしてください
                                </Button>
                            </div>
                        ) : (
                            // 両方登録済み
                            <div>
                                <p style={{ marginBottom: "20px", fontSize: "14px", color: "#333" }}>
                                    入金口座情報の登録が完了しています。口座情報を変更する場合は、以下のボタンから変更できます。
                                </p>
                                <Button
                                    type="primary"
                                    danger
                                    size="large"
                                    loading={createLoginLinkMutation.isPending}
                                    onClick={() => {
                                        createLoginLinkMutation.mutate({ userId });
                                    }}
                                    style={{
                                        borderRadius: "90px",
                                        height: "40px",
                                        fontWeight: "bold",
                                        backgroundColor: "#d70202",
                                        border: "none",
                                    }}
                                >
                                    入金口座情報の変更
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopCasterMyPage;
