"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import img11 from "../TopOrder/images/search_magnifying_glass.png";
import favoriteIcon from "../TopOrder/images/favorite.png";
import JobTypeFilterDetail, {
    JobType,
    jobTypeFilterData,
} from "../TopOrder/JobTypeFilterDetail";

const TopCaster = () => {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openJobType, setOpenJobType] = useState<JobType | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<
        Record<JobType, Record<string, string[]>>
    >({
        photographer: {},
        model: {},
        artist: {},
        creator: {},
    });
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

    const handleReset = () => {
        // 職種フィルターをリセット
        setSelectedFilters({
            photographer: {},
            model: {},
            artist: {},
            creator: {},
        });
        // 基本情報をリセット
        setAgeMin("");
        setAgeMax("");
        setHeightMin("");
        setHeightMax("");
        setGender([]);
        // 活動可能日をリセット
        setAvailableDays([]);
    };

    return (
        <div
            style={{
                paddingTop: "146px",
                paddingBottom: "60px",
                paddingLeft: "clamp(20px, 4vw, 60px)",
                paddingRight: "clamp(20px, 4vw, 60px)",
                display: "flex",
                gap: "40px",
                maxWidth: "1920px",
                margin: "0 auto",
            }}
        >
            {/* 左側: フィルターサイドバー */}
            <aside
                style={{
                    width: "262px",
                    flexShrink: 0,
                }}
            >
                {/* フィルター */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        職種
                    </h3>
                    <div
                        style={{
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "16px",
                        }}
                    >
                        {(["photographer", "model", "artist", "creator"] as JobType[]).map(
                            (jobType, index, array) => {
                                const hasSelected = hasSelectedFilters(jobType);
                                const selectedItemsList = getSelectedItemsList(jobType);
                                const isLast = index === array.length - 1;

                                return (
                                    <div key={jobType}>
                                        <div
                                            onClick={() => handleJobTypeClick(jobType)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: isLast ? "0" : "12px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "4px",
                                                    flex: 1,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "black",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    {jobTypeLabels[jobType]}
                                                </span>
                                                {hasSelected && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "2px",
                                                        }}
                                                    >
                                                        {selectedItemsList.map((item, idx) => (
                                                            <span
                                                                key={idx}
                                                                style={{
                                                                    fontSize: "9px",
                                                                    color: "#666",
                                                                    fontFamily: "'Noto Sans JP', sans-serif",
                                                                    lineHeight: "1.4",
                                                                }}
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {hasSelected ? (
                                                <FaChevronDown
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        color: "black",
                                                    }}
                                                />
                                            ) : (
                                                <FaChevronRight
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        color: "black",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* 基本情報フィルター */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        基本情報
                    </h3>
                    <div
                        style={{
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "16px",
                        }}
                    >
                        {/* 年齢 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "11px",
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
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
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
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {/* 身長 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "11px",
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
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
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
                                        width: "67px",
                                        height: "20px",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                        fontSize: "9px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {/* 性別 */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    fontSize: "11px",
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
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
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
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
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
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "3px",
                                            border: "1px solid black",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        その他
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 活動可能日 */}
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            marginBottom: "16px",
                            marginTop: "20px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        活動可能日
                    </h3>
                    <div
                        style={{
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "16px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
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
                                    checked={availableDays.includes("平日")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAvailableDays([...availableDays, "平日"]);
                                        } else {
                                            setAvailableDays(availableDays.filter((d) => d !== "平日"));
                                        }
                                    }}
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    平日
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
                                    checked={availableDays.includes("土日祝")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAvailableDays([...availableDays, "土日祝"]);
                                        } else {
                                            setAvailableDays(availableDays.filter((d) => d !== "土日祝"));
                                        }
                                    }}
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    土日祝
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
                                    checked={availableDays.includes("早朝対応可能")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAvailableDays([...availableDays, "早朝対応可能"]);
                                        } else {
                                            setAvailableDays(availableDays.filter((d) => d !== "早朝対応可能"));
                                        }
                                    }}
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    早朝対応可能
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
                                    checked={availableDays.includes("深夜対応可能")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAvailableDays([...availableDays, "深夜対応可能"]);
                                        } else {
                                            setAvailableDays(availableDays.filter((d) => d !== "深夜対応可能"));
                                        }
                                    }}
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    深夜対応可能
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
                                    checked={availableDays.includes("即日対応可能")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAvailableDays([...availableDays, "即日対応可能"]);
                                        } else {
                                            setAvailableDays(availableDays.filter((d) => d !== "即日対応可能"));
                                        }
                                    }}
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        borderRadius: "3px",
                                        border: "1px solid black",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    即日対応可能
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* フィルターボタン */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <button
                        style={{
                            backgroundColor: "#d70202",
                            color: "white",
                            border: "none",
                            borderRadius: "90px",
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            cursor: "pointer",
                        }}
                    >
                        絞り込む
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
                        }}
                    >
                        リセット
                    </button>
                </div>
            </aside>

            {/* 右側: メインコンテンツ */}
            <div
                style={{
                    flex: 1,
                }}
            >
                {/* 検索バー */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                        height: "60px",
                    }}
                >
                    {/* 検索入力フィールド */}
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px 0 0 10px",
                            height: "60px",
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "20px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="フリーワードで検索"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
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
                        style={{
                            backgroundColor: "#ff6d00",
                            border: "none",
                            borderRadius: "0 10px 10px 0",
                            width: "60px",
                            height: "60px",
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
                                width: "30px",
                                height: "30px",
                            }}
                        />
                    </button>
                </div>
                {/* 検索結果表示 */}
                <p
                    style={{
                        fontSize: "16px",
                        color: "white",
                        textAlign: "center",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        marginBottom: "20px",
                    }}
                >
                    100件のうち、1~15件を表示
                </p>

                {/* 案件一覧 */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {Array.from({ length: 15 }).map((_, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: "20px",
                                display: "flex",
                                gap: "20px",
                            }}
                        >
                            {/* 左側: 案件情報 */}
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "#333",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: 0,
                                    }}
                                >
                                    株式会社○○
                                </p>
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: 0,
                                    }}
                                >
                                    七五三祝いの写真撮影をお願いします
                                </h3>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "#333",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: 0,
                                        lineHeight: "1.6",
                                    }}
                                >
                                    依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依頼内容依
                                </p>
                            </div>

                            {/* 右側: 価格とボタン */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "12px",
                                    minWidth: "200px",
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
                                    }}
                                >
                                    固定報酬制
                                </div>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "black",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: 0,
                                    }}
                                >
                                    3,000円～
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        width: "100%",
                                    }}
                                >
                                    <button
                                        onClick={() => router.push("/project/detail")}
                                        style={{
                                            backgroundColor: "#d70202",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "90px",
                                            padding: "8px 24px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        詳細を確認
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            border: "1px solid black",
                                            borderRadius: "90px",
                                            padding: "8px 24px",
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            width: "100%",
                                        }}
                                    >
                                        <img
                                            src={favoriteIcon.src}
                                            alt="お気に入り"
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                            }}
                                        />
                                        お気に入りに追加
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ページネーション */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "40px",
                    }}
                >
                    {[1, 2, 3, 4].map((page) => (
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
            </div>

            {/* フィルター詳細モーダル */}
            {openJobType && (
                <JobTypeFilterDetail
                    jobType={openJobType}
                    selectedFilters={selectedFilters[openJobType]}
                    onFilterChange={(category, items) =>
                        handleFilterChange(openJobType, category, items)
                    }
                    onClose={() => setOpenJobType(null)}
                />
            )}
        </div>
    );
};

export default TopCaster;

