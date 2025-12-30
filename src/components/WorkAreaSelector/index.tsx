/**
 * 稼働エリア選択コンポーネント
 * 
 * 機能:
 * - 稼働エリアの選択（都道府県、東京23区）
 * - 出張対応エリアの選択
 * - オンライン対応の選択
 * - 地域ブロック単位での一括選択
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  REGIONS,
  PREFECTURES,
  TOKYO_WARDS,
  getPrefecturesByRegion,
  TOKYO_PREFECTURE_CODE,
} from "@/constants/regions";

export interface SelectedArea {
  prefectureCode: number;
  tokyoWardCode?: number; // 東京23区の場合のみ
}

export interface WorkAreaData {
  workAreas: SelectedArea[];
  travelAreas: SelectedArea[];
  onlineAvailable: boolean;
}

interface WorkAreaSelectorProps {
  value: WorkAreaData;
  onChange: (data: WorkAreaData) => void;
  style?: React.CSSProperties;
}

type TabType = "work" | "travel" | "online";

const WorkAreaSelector: React.FC<WorkAreaSelectorProps> = ({
  value,
  onChange,
  style,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("work");
  const [expandedRegions, setExpandedRegions] = useState<Set<number>>(
    new Set([3]) // デフォルトで関東を展開
  );
  const [expandedPrefectures, setExpandedPrefectures] = useState<Set<number>>(
    new Set()
  );

  // 現在のタブに応じた選択済みエリアを取得
  const currentAreas = useMemo(() => {
    return activeTab === "work" ? value.workAreas : value.travelAreas;
  }, [activeTab, value.workAreas, value.travelAreas]);

  // 地域ブロックの展開/折りたたみ
  const toggleRegion = (regionCode: number) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionCode)) {
      newExpanded.delete(regionCode);
    } else {
      newExpanded.add(regionCode);
    }
    setExpandedRegions(newExpanded);
  };

  // 都道府県の展開/折りたたみ（東京都のみ）
  const togglePrefecture = (prefCode: number) => {
    const newExpanded = new Set(expandedPrefectures);
    if (newExpanded.has(prefCode)) {
      newExpanded.delete(prefCode);
    } else {
      newExpanded.add(prefCode);
    }
    setExpandedPrefectures(newExpanded);
  };

  // エリアが選択されているかチェック
  const isAreaSelected = (prefCode: number, wardCode?: number): boolean => {
    return currentAreas.some(
      (area) =>
        area.prefectureCode === prefCode &&
        (wardCode === undefined || area.tokyoWardCode === wardCode)
    );
  };

  // 都道府県全体が選択されているかチェック
  const isPrefectureFullySelected = (prefCode: number): boolean => {
    if (prefCode === TOKYO_PREFECTURE_CODE) {
      // 東京都の場合、23区すべてが選択されているか
      const selectedWards = currentAreas.filter(
        (area) =>
          area.prefectureCode === TOKYO_PREFECTURE_CODE &&
          area.tokyoWardCode !== undefined
      );
      return selectedWards.length === TOKYO_WARDS.length;
    } else {
      // 他の都道府県の場合、都道府県全体が選択されているか
      return currentAreas.some(
        (area) =>
          area.prefectureCode === prefCode && area.tokyoWardCode === undefined
      );
    }
  };

  // 地域ブロック全体が選択されているかチェック
  const isRegionFullySelected = (regionCode: number): boolean => {
    const prefectures = getPrefecturesByRegion(regionCode);
    return prefectures.every((pref) => isPrefectureFullySelected(pref.code));
  };

  // 都道府県の選択/解除
  const togglePrefectureSelection = (prefCode: number) => {
    const newAreas = [...currentAreas];

    if (prefCode === TOKYO_PREFECTURE_CODE) {
      // 東京都の場合、23区すべてを選択/解除
      const isFullySelected = isPrefectureFullySelected(TOKYO_PREFECTURE_CODE);
      
      if (isFullySelected) {
        // すべて解除
        const filtered = newAreas.filter(
          (area) => area.prefectureCode !== TOKYO_PREFECTURE_CODE
        );
        updateAreas(filtered);
      } else {
        // すべて選択
        const filtered = newAreas.filter(
          (area) => area.prefectureCode !== TOKYO_PREFECTURE_CODE
        );
        TOKYO_WARDS.forEach((ward) => {
          filtered.push({
            prefectureCode: TOKYO_PREFECTURE_CODE,
            tokyoWardCode: ward.code,
          });
        });
        updateAreas(filtered);
      }
    } else {
      // 他の都道府県の場合
      const isSelected = isPrefectureFullySelected(prefCode);
      
      if (isSelected) {
        // 解除
        const filtered = newAreas.filter(
          (area) => area.prefectureCode !== prefCode
        );
        updateAreas(filtered);
      } else {
        // 選択
        const filtered = newAreas.filter(
          (area) => area.prefectureCode !== prefCode
        );
        filtered.push({ prefectureCode: prefCode });
        updateAreas(filtered);
      }
    }
  };

  // 東京23区の選択/解除
  const toggleWardSelection = (wardCode: number) => {
    const newAreas = [...currentAreas];
    const isSelected = isAreaSelected(TOKYO_PREFECTURE_CODE, wardCode);

    if (isSelected) {
      // 解除
      const filtered = newAreas.filter(
        (area) =>
          !(
            area.prefectureCode === TOKYO_PREFECTURE_CODE &&
            area.tokyoWardCode === wardCode
          )
      );
      updateAreas(filtered);
    } else {
      // 選択
      newAreas.push({
        prefectureCode: TOKYO_PREFECTURE_CODE,
        tokyoWardCode: wardCode,
      });
      updateAreas(newAreas);
    }
  };

  // 地域ブロック全体の選択/解除
  const toggleRegionSelection = (regionCode: number) => {
    const prefectures = getPrefecturesByRegion(regionCode);
    const isFullySelected = isRegionFullySelected(regionCode);
    let newAreas = [...currentAreas];

    if (isFullySelected) {
      // 地域内のすべての都道府県を解除
      prefectures.forEach((pref) => {
        newAreas = newAreas.filter(
          (area) => area.prefectureCode !== pref.code
        );
      });
    } else {
      // 地域内のすべての都道府県を選択
      prefectures.forEach((pref) => {
        // 既存の選択を削除
        newAreas = newAreas.filter(
          (area) => area.prefectureCode !== pref.code
        );
        
        if (pref.code === TOKYO_PREFECTURE_CODE) {
          // 東京都の場合、23区すべてを追加
          TOKYO_WARDS.forEach((ward) => {
            newAreas.push({
              prefectureCode: TOKYO_PREFECTURE_CODE,
              tokyoWardCode: ward.code,
            });
          });
        } else {
          // 他の都道府県の場合
          newAreas.push({ prefectureCode: pref.code });
        }
      });
    }

    updateAreas(newAreas);
  };

  // エリアを更新
  const updateAreas = (newAreas: SelectedArea[]) => {
    if (activeTab === "work") {
      onChange({ ...value, workAreas: newAreas });
    } else if (activeTab === "travel") {
      onChange({ ...value, travelAreas: newAreas });
    }
  };

  // オンライン対応の切り替え
  const toggleOnlineAvailable = () => {
    onChange({ ...value, onlineAvailable: !value.onlineAvailable });
  };

  // 選択済みエリアの表示用テキスト生成
  const getSelectedAreasText = (areas: SelectedArea[]): string => {
    if (areas.length === 0) return "未選択";
    
    const prefCodes = new Set(areas.map((a) => a.prefectureCode));
    const prefNames: string[] = [];
    
    prefCodes.forEach((code) => {
      const pref = PREFECTURES.find((p) => p.code === code);
      if (!pref) return;
      
      if (code === TOKYO_PREFECTURE_CODE) {
        const wards = areas.filter(
          (a) => a.prefectureCode === code && a.tokyoWardCode !== undefined
        );
        if (wards.length === TOKYO_WARDS.length) {
          prefNames.push("東京都（全域）");
        } else {
          wards.forEach((ward) => {
            const wardData = TOKYO_WARDS.find((w) => w.code === ward.tokyoWardCode);
            if (wardData) {
              prefNames.push(`東京都${wardData.name}`);
            }
          });
        }
      } else {
        prefNames.push(pref.name);
      }
    });
    
    return prefNames.join("、");
  };

  return (
    <div style={style}>
      {/* タブ */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("work")}
          style={{
            padding: "12px 24px",
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: activeTab === "work" ? "bold" : "normal",
            color: activeTab === "work" ? "#dc2626" : "#6b7280",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "work" ? "3px solid #dc2626" : "3px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          稼働エリア
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("travel")}
          style={{
            padding: "12px 24px",
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: activeTab === "travel" ? "bold" : "normal",
            color: activeTab === "travel" ? "#dc2626" : "#6b7280",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "travel" ? "3px solid #dc2626" : "3px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          出張対応エリア
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("online")}
          style={{
            padding: "12px 24px",
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: activeTab === "online" ? "bold" : "normal",
            color: activeTab === "online" ? "#dc2626" : "#6b7280",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "online" ? "3px solid #dc2626" : "3px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          オンライン対応
        </button>
      </div>

      {/* 選択済みエリアの表示 */}
      {activeTab !== "online" && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f9fafb",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            選択中: {currentAreas.length}件
          </div>
          <div
            style={{
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.6",
            }}
          >
            {getSelectedAreasText(currentAreas)}
          </div>
        </div>
      )}

      {/* コンテンツエリア */}
      {activeTab === "online" ? (
        // オンライン対応タブ
        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              fontFamily: "Noto Sans JP",
              fontSize: "18px",
              color: "black",
            }}
          >
            <input
              type="checkbox"
              checked={value.onlineAvailable}
              onChange={toggleOnlineAvailable}
              style={{
                width: "24px",
                height: "24px",
                marginRight: "12px",
                cursor: "pointer",
              }}
            />
            <span>オンラインでの対応が可能です</span>
          </label>
          <p
            style={{
              marginTop: "15px",
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            リモートワークやオンラインミーティングでの業務に対応できる場合はチェックしてください
          </p>
        </div>
      ) : (
        // 稼働エリア・出張対応エリアタブ
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          {REGIONS.map((region) => {
            const isExpanded = expandedRegions.has(region.code);
            const isFullySelected = isRegionFullySelected(region.code);
            const prefectures = getPrefecturesByRegion(region.code);

            return (
              <div key={region.code} style={{ marginBottom: "5px" }}>
                {/* 地域ブロック */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: isFullySelected ? "#fee2e2" : "#f9fafb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleRegion(region.code)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      marginRight: "10px",
                      fontSize: "18px",
                      color: "#6b7280",
                    }}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                  <input
                    type="checkbox"
                    checked={isFullySelected}
                    onChange={() => toggleRegionSelection(region.code)}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    onClick={() => toggleRegion(region.code)}
                    style={{
                      flex: 1,
                      fontFamily: "Noto Sans JP",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {region.name}
                  </span>
                </div>

                {/* 都道府県リスト */}
                {isExpanded && (
                  <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                    {prefectures.map((pref) => {
                      const isPrefSelected = isPrefectureFullySelected(pref.code);
                      const isPrefExpanded = expandedPrefectures.has(pref.code);
                      const isTokyo = pref.code === TOKYO_PREFECTURE_CODE;

                      return (
                        <div key={pref.code} style={{ marginBottom: "5px" }}>
                          {/* 都道府県 */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px",
                              backgroundColor: isPrefSelected
                                ? "#fecaca"
                                : "white",
                              borderRadius: "6px",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            {isTokyo && (
                              <button
                                type="button"
                                onClick={() => togglePrefecture(pref.code)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "0",
                                  marginRight: "8px",
                                  fontSize: "14px",
                                  color: "#6b7280",
                                }}
                              >
                                {isPrefExpanded ? "▼" : "▶"}
                              </button>
                            )}
                            <input
                              type="checkbox"
                              checked={isPrefSelected}
                              onChange={() => togglePrefectureSelection(pref.code)}
                              style={{
                                width: "18px",
                                height: "18px",
                                marginRight: "8px",
                                marginLeft: isTokyo ? "0" : "22px",
                                cursor: "pointer",
                              }}
                            />
                            <span
                              onClick={() =>
                                isTokyo && togglePrefecture(pref.code)
                              }
                              style={{
                                flex: 1,
                                fontFamily: "Noto Sans JP",
                                fontSize: "15px",
                                color: "black",
                                cursor: isTokyo ? "pointer" : "default",
                              }}
                            >
                              {pref.name}
                              {isTokyo && " (23区を選択)"}
                            </span>
                          </div>

                          {/* 東京23区リスト */}
                          {isTokyo && isPrefExpanded && (
                            <div
                              style={{
                                marginLeft: "30px",
                                marginTop: "5px",
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "5px",
                              }}
                            >
                              {TOKYO_WARDS.map((ward) => {
                                const isWardSelected = isAreaSelected(
                                  TOKYO_PREFECTURE_CODE,
                                  ward.code
                                );

                                return (
                                  <label
                                    key={ward.code}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "8px",
                                      backgroundColor: isWardSelected
                                        ? "#fecaca"
                                        : "white",
                                      borderRadius: "4px",
                                      border: "1px solid #e5e7eb",
                                      cursor: "pointer",
                                      transition: "all 0.2s",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isWardSelected}
                                      onChange={() =>
                                        toggleWardSelection(ward.code)
                                      }
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        marginRight: "8px",
                                        cursor: "pointer",
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontFamily: "Noto Sans JP",
                                        fontSize: "14px",
                                        color: "black",
                                      }}
                                    >
                                      {ward.name}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkAreaSelector;

