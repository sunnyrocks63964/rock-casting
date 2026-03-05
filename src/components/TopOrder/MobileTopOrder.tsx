"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronRight, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { inferRouterOutputs } from "@trpc/server";
import img11 from "./images/search_magnifying_glass.png";
import topOrderBgIcon from "./images/top_order_bg.png";
import JobTypeFilterDetail, {
    JobType,
    jobTypeFilterData,
} from "./JobTypeFilterDetail";
import { trpc } from "@/lib/trpc/client";
import { type AppRouter } from "@/server/routers/_app";
import { supabase } from "@/lib/supabase";
import { useFavoriteCasters } from "@/hooks/useFavoriteCasters";

// tRPC の型推論を使用して型を取得
type RouterOutputs = inferRouterOutputs<AppRouter>;
type CasterListOutput = RouterOutputs["profile"]["getCasterList"];
type Caster = CasterListOutput["casters"][number];
type CasterProfile = NonNullable<Caster["casterProfile"]>;
type JobTypeWithSkills = CasterProfile["jobTypes"][number];
type WorkAreaWithRelations = CasterProfile["workAreas"][number];

const MobileTopOrder = () => {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openJobType, setOpenJobType] = useState<JobType | null>(null);
    const [openJobTypeSelector, setOpenJobTypeSelector] = useState(false);
    const [openBasicInfoFilter, setOpenBasicInfoFilter] = useState(false);
    const [ordererId, setOrdererId] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<
        Record<JobType, Record<string, string[]>>
    >({
        photographer: {},
        model: {},
        artist: {},
        creator: {},
    });
    // 適用されたフィルター（実際にAPIに送信されるフィルター）
    const [appliedFilters, setAppliedFilters] = useState<
        Partial<Record<JobType, Record<string, string[]>>> | undefined
    >(undefined);
    // 適用された基本情報フィルター
    const [appliedBasicInfoFilters, setAppliedBasicInfoFilters] = useState<{
        ageMin?: number;
        ageMax?: number;
        heightMin?: number;
        heightMax?: number;
        gender?: string[];
        availableDays?: string[];
    } | undefined>(undefined);
    // 基本情報のstate
    const [ageMin, setAgeMin] = useState("");
    const [ageMax, setAgeMax] = useState("");
    const [heightMin, setHeightMin] = useState("");
    const [heightMax, setHeightMax] = useState("");
    const [gender, setGender] = useState<string[]>([]);
    // 活動可能日のstate
    const [availableDays, setAvailableDays] = useState<string[]>([]);

    const jobTypeLabels: Record<JobType, string> = {
        photographer: "フォトグラファー",
        model: "モデル",
        artist: "アーティスト",
        creator: "クリエイター",
    };

    // ユーザーIDを取得
    useEffect(() => {
        const getUserId = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session?.user) {
                setOrdererId(session.user.id);
            }
        };
        getUserId();
    }, []);

    // お気に入り管理フック
    const { isFavorite, addFavorite, removeFavorite, isAdding, isRemoving } = useFavoriteCasters({ ordererId });

    // キャスト一覧を取得
    const { data: casterListData, isLoading: isLoadingCasters } = trpc.profile.getCasterList.useQuery({
        page: currentPage,
        limit: 15,
        searchKeyword: searchKeyword || undefined,
        jobTypeFilters: appliedFilters,
        basicInfoFilters: appliedBasicInfoFilters,
    });

    // お気に入り追加/削除処理
    const handleAddFavorite = async (casterId: string) => {
        if (!ordererId) {
            return;
        }

        try {
            if (isFavorite(casterId)) {
                await removeFavorite(casterId);
            } else {
                await addFavorite(casterId);
            }
        } catch (error) {
            console.error("お気に入り操作エラー:", error);
        }
    };

    // お気に入り状態を判定（追加中または削除中）
    const isFavoriteOrAdding = (casterId: string): boolean => {
        return isAdding(casterId) || isRemoving(casterId);
    };

    // お気に入りボタンのテキストを取得
    const getFavoriteButtonText = (casterId: string): string => {
        if (isRemoving(casterId)) {
            return "お気に入り解除中";
        }
        if (isAdding(casterId)) {
            return "お気に入り追加中";
        }
        if (isFavorite(casterId)) {
            return "お気に入り済み";
        }
        return "お気に入りに追加";
    };

    // キャストデータを取得
    const casters = useMemo(() => {
        return casterListData?.casters || [];
    }, [casterListData]);

    // 職種名を取得するヘルパー関数
    const getJobTypeNames = (jobTypes: JobTypeWithSkills[]): string => {
        if (!jobTypes || jobTypes.length === 0) return "";
        return jobTypes.map((jt) => jobTypeLabels[jt.jobType as JobType] || jt.jobType).join("、");
    };

    // エリア情報を取得するヘルパー関数
    const getAreaInfo = (workAreas: WorkAreaWithRelations[]): string => {
        if (!workAreas || workAreas.length === 0) return "";
        const areas = workAreas.map((wa) => {
            if (wa.tokyoWard) {
                return wa.tokyoWard.name;
            }
            if (wa.city) {
                return wa.city.name;
            }
            if (wa.prefecture) {
                return wa.prefecture.name;
            }
            return "";
        }).filter(Boolean);
        return areas.length > 0 ? areas[0] : "";
    };

    // 年齢を計算するヘルパー関数
    const calculateAge = (birthdate: Date | null | undefined): number | null => {
        if (!birthdate) return null;
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // 性別を日本語に変換するヘルパー関数
    const getGenderLabel = (gender: string | null | undefined): string => {
        if (!gender) return "性別未設定";
        if (gender === "female") return "女性";
        if (gender === "male") return "男性";
        return "性別未設定";
    };

    // 検索キーワードが変更されたときにページをリセット
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword]);

    // フィルターが変更されたときにページをリセット
    useEffect(() => {
        setCurrentPage(1);
    }, [appliedFilters, appliedBasicInfoFilters]);

    const handleJobTypeClick = (jobType: JobType) => {
        setOpenJobType(jobType);
    };

    const handleFilterChange = (jobType: JobType, category: string, items: string[]) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [jobType]: {
                ...prev[jobType],
                [category]: items,
            },
        }));
    };

    const hasSelectedFilters = (jobType: JobType): boolean => {
        const filters = selectedFilters[jobType];
        return Object.values(filters).some((items) => items.length > 0);
    };

    const getSelectedItemsList = (jobType: JobType): string[] => {
        const filters = selectedFilters[jobType];
        const filterData = jobTypeFilterData[jobType];
        const categoryDisplays: string[] = [];

        // 各カテゴリ（ジャンル）ごとに処理
        Object.keys(filterData).forEach((categoryKey) => {
            const category = filterData[categoryKey];
            const selectedItems = filters[categoryKey] || [];
            const totalItems = category.items.length;

            // 選択項目がある場合のみ表示
            if (selectedItems.length > 0) {
                if (selectedItems.length === totalItems) {
                    // 全て選択されている場合は「ジャンル名　全選択」
                    categoryDisplays.push(`${category.name}　全選択`);
                } else {
                    // 一部選択されている場合は選択項目を列挙
                    categoryDisplays.push(`${category.name}：${selectedItems.join("、")}`);
                }
            }
        });

        return categoryDisplays;
    };

    const handleApplyFilters = () => {
        // 選択されたフィルターを適用（空のフィルターは除外）
        const filtersToApply: Partial<Record<JobType, Record<string, string[]>>> = {};

        // 型安全に職種をループ
        const jobTypes: JobType[] = ["photographer", "model", "artist", "creator"];
        jobTypes.forEach((jobType) => {
            const categories = selectedFilters[jobType];
            const filteredCategories: Record<string, string[]> = {};
            Object.entries(categories).forEach(([category, values]) => {
                if (values.length > 0) {
                    filteredCategories[category] = values;
                }
            });
            if (Object.keys(filteredCategories).length > 0) {
                filtersToApply[jobType] = filteredCategories;
            }
        });

        // フィルターが空の場合はundefinedを設定（全キャストを表示）
        const hasAnyFilter = Object.keys(filtersToApply).length > 0;
        setAppliedFilters(hasAnyFilter ? filtersToApply : undefined);

        // 基本情報フィルターを適用
        const basicInfoFiltersToApply: {
            ageMin?: number;
            ageMax?: number;
            heightMin?: number;
            heightMax?: number;
            gender?: string[];
            availableDays?: string[];
        } = {};

        // 年齢フィルター
        if (ageMin.trim()) {
            const ageMinNum = parseInt(ageMin.trim(), 10);
            if (!Number.isNaN(ageMinNum)) {
                basicInfoFiltersToApply.ageMin = ageMinNum;
            }
        }
        if (ageMax.trim()) {
            const ageMaxNum = parseInt(ageMax.trim(), 10);
            if (!Number.isNaN(ageMaxNum)) {
                basicInfoFiltersToApply.ageMax = ageMaxNum;
            }
        }

        // 身長フィルター
        if (heightMin.trim()) {
            const heightMinNum = parseInt(heightMin.trim(), 10);
            if (!Number.isNaN(heightMinNum)) {
                basicInfoFiltersToApply.heightMin = heightMinNum;
            }
        }
        if (heightMax.trim()) {
            const heightMaxNum = parseInt(heightMax.trim(), 10);
            if (!Number.isNaN(heightMaxNum)) {
                basicInfoFiltersToApply.heightMax = heightMaxNum;
            }
        }

        // 性別フィルター
        if (gender.length > 0) {
            basicInfoFiltersToApply.gender = gender;
        }

        // 活動可能日フィルター
        if (availableDays.length > 0) {
            basicInfoFiltersToApply.availableDays = availableDays;
        }

        // 基本情報フィルターが空の場合はundefinedを設定
        const hasAnyBasicInfoFilter = Object.keys(basicInfoFiltersToApply).length > 0;
        setAppliedBasicInfoFilters(hasAnyBasicInfoFilter ? basicInfoFiltersToApply : undefined);
    };

    const handleReset = () => {
        // 職種フィルターをリセット
        setSelectedFilters({
            photographer: {},
            model: {},
            artist: {},
            creator: {},
        });
        // 適用されたフィルターもリセット
        setAppliedFilters(undefined);
        // 基本情報をリセット
        setAgeMin("");
        setAgeMax("");
        setHeightMin("");
        setHeightMax("");
        setGender([]);
        // 活動可能日をリセット
        setAvailableDays([]);
        // 適用された基本情報フィルターもリセット
        setAppliedBasicInfoFilters(undefined);
    };

    return (
        <div
            style={{
                paddingTop: "98px",
                paddingBottom: "60px",
                paddingLeft: "14px",
                paddingRight: "14px",
                backgroundColor: "#060606",
                minHeight: "100vh",
            }}
        >
            {/* 検索バー */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                    height: "37px",
                }}
            >
                {/* 検索入力フィールド */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px 0 0 10px",
                        height: "37px",
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "9px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="フリーワードで検索"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setCurrentPage(1);
                            }
                        }}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: "#d3d3d3",
                            backgroundColor: "transparent",
                        }}
                    />
                </div>
                {/* 検索ボタン */}
                <button
                    onClick={() => {
                        setCurrentPage(1);
                    }}
                    style={{
                        backgroundColor: "#ff6d00",
                        border: "none",
                        borderRadius: "0 10px 10px 0",
                        width: "27px",
                        height: "37px",
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
                            width: "14px",
                            height: "14px",
                        }}
                    />
                </button>
            </div>

            {/* 検索結果表示 */}
            {casterListData && (
                <p
                    style={{
                        fontSize: "16px",
                        color: "white",
                        textAlign: "center",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        marginBottom: "20px",
                    }}
                >
                    {casterListData.total}件のうち、{Math.min((currentPage - 1) * 15 + 1, casterListData.total)}~{Math.min(currentPage * 15, casterListData.total)}件を表示
                </p>
            )}

            {/* パッケージ予約説明 */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid black",
                }}
            >
                <img
                    src={topOrderBgIcon.src}
                    alt="パッケージ予約"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.3,
                    }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h2
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            textAlign: "center",
                        }}
                    >
                        パッケージ予約とは？
                    </h2>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "black",
                            marginBottom: "20px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            lineHeight: "1.6",
                        }}
                    >
                        同じ職種のキャストや、異なる職種のキャストを複数名まとめて予約できる機能です。システムが自動的にキャストを選出し、契約手続きまで一括で完了させます。
                    </p>
                    <button
                        onClick={() => {
                            router.push("/order/package_reservate");
                        }}
                        style={{
                            backgroundColor: "#d70202",
                            color: "white",
                            border: "none",
                            borderRadius: "90px",
                            padding: "10px 0",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        パッケージ予約はこちら
                    </button>
                </div>
            </div>

            {/* フィルターオプション */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px",
                }}
            >
                <button
                    onClick={() => {
                        // 職種選択モーダルを開く
                        setOpenJobTypeSelector(true);
                    }}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "10px 23px",
                        border: "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "4px",
                        cursor: "pointer",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "16px",
                        color: "black",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <span>職種から絞り込む</span>
                        <FaChevronRight
                            style={{
                                width: "15px",
                                height: "15px",
                                color: "black",
                            }}
                        />
                    </div>
                    {/* 選択されたフィルターを表示 */}
                    {(["photographer", "model", "artist", "creator"] as JobType[]).some((jobType) =>
                        hasSelectedFilters(jobType)
                    ) && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                width: "100%",
                                marginTop: "4px",
                            }}
                        >
                            {(["photographer", "model", "artist", "creator"] as JobType[]).map((jobType) => {
                                if (!hasSelectedFilters(jobType)) return null;
                                const selectedItemsList = getSelectedItemsList(jobType);
                                return (
                                    <div key={jobType} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                color: "#666",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {jobTypeLabels[jobType]}
                                        </span>
                                        {selectedItemsList.map((item, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#666",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    lineHeight: "1.4",
                                                    paddingLeft: "8px",
                                                }}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </button>
                <button
                    onClick={() => setOpenBasicInfoFilter(true)}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "10px 23px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "16px",
                        color: "black",
                    }}
                >
                    <span>基本情報から絞り込む</span>
                    <FaChevronRight
                        style={{
                            width: "15px",
                            height: "15px",
                            color: "black",
                        }}
                    />
                </button>
                <button
                    onClick={handleReset}
                    style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid black",
                        borderRadius: "90px",
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        cursor: "pointer",
                        width: "100%",
                    }}
                >
                    絞り込みリセット
                </button>
            </div>

            {/* キャスト一覧 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                {isLoadingCasters ? (
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
                ) : casters.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        キャストが見つかりませんでした
                    </div>
                ) : (
                    casters.map((user) => {
                        const profile = user.casterProfile;
                        if (!profile) return null;

                        const jobTypeNames = getJobTypeNames(profile.jobTypes || []);
                        const areaInfo = getAreaInfo(profile.workAreas || []);
                        const age = calculateAge(profile.birthdate);
                        const residence = profile.residence || areaInfo || profile.area || "";

                        return (
                            <div
                                key={user.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    border: "1px solid black",
                                }}
                            >
                                {/* キャスト情報 */}
                                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                                    {/* プレビュー画像 */}
                                    <div
                                        style={{
                                            width: "140px",
                                            height: "93px",
                                            borderRadius: "10px",
                                            backgroundColor: "#f0f0f0",
                                            overflow: "hidden",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {profile.mainProfileImage ? (
                                            <img
                                                src={profile.mainProfileImage}
                                                alt="プロフィール画像"
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
                                        <div style={{ fontSize: "16px", marginBottom: "4px", color: "#000", textAlign: "center" }}>
                                            {jobTypeNames || "職種未設定"}
                                        </div>
                                        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px", color: "#000", textAlign: "center" }}>
                                            {profile.fullName || "名前未設定"}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#333", textAlign: "center" }}>
                                            {residence ? residence.split(/[都道府県]/)[0] : "地域未設定"}/
                                            {age !== null ? `${age}歳` : "年齢未設定"}
                                            /{getGenderLabel(profile.gender || null)}
                                            /{profile.height ? `${profile.height}cm` : "身長未設定"}
                                        </div>
                                    </div>
                                </div>

                                {/* 紹介文 */}
                                <div style={{ fontSize: "16px", color: "#333", marginBottom: "12px" }}>
                                    {profile.bio || "自己紹介未設定"}
                                </div>

                                {/* アクションボタン */}
                                <div style={{ display: "flex", gap: "17px", justifyContent: "center" }}>
                                    <button
                                        onClick={() => router.push(`/cast/detail?userId=${user.id}`)}
                                        style={{
                                            backgroundColor: "#d70202",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "90px",
                                            height: "31px",
                                            fontSize: "10px",
                                            fontWeight: "bold",
                                            padding: "0 20px",
                                            cursor: "pointer",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        予約に進む
                                    </button>
                                    <button
                                        onClick={() => handleAddFavorite(user.id)}
                                        disabled={isFavoriteOrAdding(user.id) || !ordererId}
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            border: "1px solid black",
                                            borderRadius: "90px",
                                            height: "31px",
                                            fontSize: "10px",
                                            padding: "0 20px",
                                            cursor: isFavoriteOrAdding(user.id) || !ordererId ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            opacity: isFavoriteOrAdding(user.id) || !ordererId ? 0.6 : 1,
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        {isFavorite(user.id) ? (
                                            <FaBookmark
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    fill: "#ff6d00",
                                                    color: "#ff6d00",
                                                }}
                                            />
                                        ) : (
                                            <FaRegBookmark
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                }}
                                            />
                                        )}
                                        {getFavoriteButtonText(user.id)}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ページネーション */}
            {casterListData && casterListData.totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "40px",
                    }}
                >
                    {Array.from({ length: casterListData.totalPages }, (_, i) => i + 1).map((page) => (
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

            {/* 職種選択モーダル */}
            {openJobTypeSelector && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                    }}
                    onClick={() => setOpenJobTypeSelector(false)}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            maxWidth: "90vw",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "30px",
                            position: "relative",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 閉じるボタン */}
                        <button
                            onClick={() => setOpenJobTypeSelector(false)}
                            style={{
                                position: "absolute",
                                top: "20px",
                                right: "20px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "0",
                                fontSize: "24px",
                                color: "black",
                            }}
                            aria-label="閉じる"
                        >
                            ×
                        </button>

                        {/* タイトル */}
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "black",
                                marginBottom: "30px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            職種から絞り込む
                        </h2>

                        {/* 職種リスト */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            {(["photographer", "model", "artist", "creator"] as JobType[]).map((jobType) => {
                                const hasSelected = hasSelectedFilters(jobType);
                                const selectedItemsList = getSelectedItemsList(jobType);

                                return (
                                    <button
                                        key={jobType}
                                        onClick={() => {
                                            setOpenJobTypeSelector(false);
                                            setOpenJobType(jobType);
                                        }}
                                        style={{
                                            backgroundColor: "white",
                                            borderRadius: "10px",
                                            padding: "16px",
                                            border: "1px solid #e5e5e5",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: "4px",
                                            cursor: "pointer",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            textAlign: "left",
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "16px",
                                                    color: "black",
                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                {jobTypeLabels[jobType]}
                                            </span>
                                            <FaChevronRight
                                                style={{
                                                    width: "15px",
                                                    height: "15px",
                                                    color: "black",
                                                }}
                                            />
                                        </div>
                                        {hasSelected && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "2px",
                                                    width: "100%",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                {selectedItemsList.map((item, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#666",
                                                            fontFamily: "'Noto Sans JP', sans-serif",
                                                            lineHeight: "1.4",
                                                            paddingLeft: "8px",
                                                        }}
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 職種フィルターモーダル */}
            {openJobType && (
                <JobTypeFilterDetail
                    jobType={openJobType}
                    selectedFilters={selectedFilters[openJobType]}
                    onFilterChange={(category, items) =>
                        handleFilterChange(openJobType, category, items)
                    }
                    onClose={() => {
                        // モーダルを閉じたときにフィルターを適用
                        handleApplyFilters();
                        setOpenJobType(null);
                    }}
                />
            )}

            {/* 基本情報フィルターモーダル */}
            {openBasicInfoFilter && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                    }}
                    onClick={() => setOpenBasicInfoFilter(false)}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            maxWidth: "90vw",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "30px",
                            position: "relative",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 閉じるボタン */}
                        <button
                            onClick={() => setOpenBasicInfoFilter(false)}
                            style={{
                                position: "absolute",
                                top: "20px",
                                right: "20px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "0",
                                fontSize: "24px",
                                color: "black",
                            }}
                            aria-label="閉じる"
                        >
                            ×
                        </button>

                        {/* タイトル */}
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "black",
                                marginBottom: "30px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                            }}
                        >
                            基本情報から絞り込む
                        </h2>

                        {/* 年齢 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "14px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                年齢
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder=""
                                    value={ageMin}
                                    onChange={(e) => setAgeMin(e.target.value)}
                                    style={{
                                        width: "80px",
                                        height: "30px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "14px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    ～
                                </span>
                                <input
                                    type="text"
                                    placeholder=""
                                    value={ageMax}
                                    onChange={(e) => setAgeMax(e.target.value)}
                                    style={{
                                        width: "80px",
                                        height: "30px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "14px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {/* 身長 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "14px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                身長
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder=""
                                    value={heightMin}
                                    onChange={(e) => setHeightMin(e.target.value)}
                                    style={{
                                        width: "80px",
                                        height: "30px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "14px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    ～
                                </span>
                                <input
                                    type="text"
                                    placeholder=""
                                    value={heightMax}
                                    onChange={(e) => setHeightMax(e.target.value)}
                                    style={{
                                        width: "80px",
                                        height: "30px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "14px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {/* 性別 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "14px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                性別
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={gender.includes("男性")}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setGender([...gender, "男性"]);
                                            } else {
                                                setGender(gender.filter((g) => g !== "男性"));
                                            }
                                        }}
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        男性
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={gender.includes("女性")}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setGender([...gender, "女性"]);
                                            } else {
                                                setGender(gender.filter((g) => g !== "女性"));
                                            }
                                        }}
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        女性
                                    </span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={gender.includes("その他")}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setGender([...gender, "その他"]);
                                            } else {
                                                setGender(gender.filter((g) => g !== "その他"));
                                            }
                                        }}
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        その他
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* 活動可能日 */}
                        <div style={{ marginBottom: "30px" }}>
                            <label
                                style={{
                                    fontSize: "14px",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    display: "block",
                                    marginBottom: "8px",
                                }}
                            >
                                活動可能日
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                }}
                            >
                                {["平日", "土日祝", "早朝対応可能", "深夜対応可能", "即日対応可能"].map((day) => (
                                    <label
                                        key={day}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={availableDays.includes(day)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAvailableDays([...availableDays, day]);
                                                } else {
                                                    setAvailableDays(availableDays.filter((d) => d !== day));
                                                }
                                            }}
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                borderRadius: "3px",
                                                border: "1px solid black",
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "black",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            {day}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 確定ボタン */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "12px",
                            }}
                        >
                            <button
                                onClick={handleReset}
                                style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "1px solid black",
                                    borderRadius: "90px",
                                    padding: "12px 40px",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    cursor: "pointer",
                                }}
                            >
                                リセット
                            </button>
                            <button
                                onClick={() => {
                                    handleApplyFilters();
                                    setOpenBasicInfoFilter(false);
                                }}
                                style={{
                                    backgroundColor: "#d70202",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "90px",
                                    padding: "12px 40px",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    cursor: "pointer",
                                }}
                            >
                                確定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileTopOrder;
