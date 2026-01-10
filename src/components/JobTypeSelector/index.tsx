/**
 * 職種選択コンポーネント
 * 
 * 機能:
 * - 複数の職種を選択可能
 * - 職種ごとに詳細なスキル・属性を選択
 * - カテゴリごとの展開/折りたたみ
 * - 選択済み項目の表示
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  jobTypeFilterData,
  JobType,
} from "@/components/TopOrder/JobTypeFilterDetail";

interface JobTypeSkill {
  category: string;
  values: string[];
}

interface SelectedJobType {
  jobType: JobType;
  skills: JobTypeSkill[];
}

export interface JobTypeSelectorData {
  selectedJobTypes: SelectedJobType[];
}

interface JobTypeSelectorProps {
  value: JobTypeSelectorData;
  onChange: (data: JobTypeSelectorData) => void;
  style?: React.CSSProperties;
}

const jobTypeLabels: Record<JobType, string> = {
  photographer: "フォトグラファー",
  model: "モデル",
  artist: "アーティスト",
  creator: "クリエイター",
};

const JobTypeSelector: React.FC<JobTypeSelectorProps> = ({
  value,
  onChange,
  style,
}) => {
  const [activeJobType, setActiveJobType] = useState<JobType>("photographer");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // 現在のジョブタイプが選択されているか
  const isJobTypeSelected = useMemo(() => {
    return value.selectedJobTypes.some((jt) => jt.jobType === activeJobType);
  }, [value.selectedJobTypes, activeJobType]);

  // 現在のジョブタイプの選択済みスキル
  const currentJobTypeData = useMemo(() => {
    return value.selectedJobTypes.find((jt) => jt.jobType === activeJobType);
  }, [value.selectedJobTypes, activeJobType]);

  // カテゴリの展開/折りたたみ
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // 職種の選択/解除
  const toggleJobType = (jobType: JobType) => {
    const newSelectedJobTypes = [...value.selectedJobTypes];
    const index = newSelectedJobTypes.findIndex((jt) => jt.jobType === jobType);

    if (index >= 0) {
      // 解除
      newSelectedJobTypes.splice(index, 1);
    } else {
      // 選択（空のスキルで初期化）
      newSelectedJobTypes.push({
        jobType,
        skills: [],
      });
    }

    onChange({ selectedJobTypes: newSelectedJobTypes });
  };

  // カテゴリ内のアイテムが選択されているか
  const isItemSelected = (category: string, item: string): boolean => {
    if (!currentJobTypeData) return false;
    const skill = currentJobTypeData.skills.find((s) => s.category === category);
    return skill?.values.includes(item) ?? false;
  };

  // カテゴリ全体が選択されているか
  const isCategoryFullySelected = (category: string, items: string[]): boolean => {
    if (!currentJobTypeData) return false;
    const skill = currentJobTypeData.skills.find((s) => s.category === category);
    return skill?.values.length === items.length && items.length > 0;
  };

  // アイテムの選択/解除
  const toggleItem = (category: string, item: string) => {
    if (!isJobTypeSelected) {
      // 職種が選択されていない場合は、まず職種を選択
      toggleJobType(activeJobType);
    }

    const newSelectedJobTypes = [...value.selectedJobTypes];
    const jobTypeIndex = newSelectedJobTypes.findIndex(
      (jt) => jt.jobType === activeJobType
    );

    if (jobTypeIndex < 0) {
      // 職種が選択されていない場合（通常ここには来ない）
      newSelectedJobTypes.push({
        jobType: activeJobType,
        skills: [{ category, values: [item] }],
      });
    } else {
      const skills = [...newSelectedJobTypes[jobTypeIndex].skills];
      const skillIndex = skills.findIndex((s) => s.category === category);

      if (skillIndex < 0) {
        // カテゴリが存在しない場合は追加
        skills.push({ category, values: [item] });
      } else {
        const values = [...skills[skillIndex].values];
        const itemIndex = values.indexOf(item);

        if (itemIndex >= 0) {
          // アイテムを解除
          values.splice(itemIndex, 1);
          if (values.length === 0) {
            // カテゴリ内のアイテムがすべて解除されたらカテゴリごと削除
            skills.splice(skillIndex, 1);
          } else {
            skills[skillIndex] = { category, values };
          }
        } else {
          // アイテムを追加
          values.push(item);
          skills[skillIndex] = { category, values };
        }
      }

      newSelectedJobTypes[jobTypeIndex] = {
        ...newSelectedJobTypes[jobTypeIndex],
        skills,
      };
    }

    onChange({ selectedJobTypes: newSelectedJobTypes });
  };

  // カテゴリ全体の選択/解除
  const toggleCategorySelection = (category: string, items: string[]) => {
    if (!isJobTypeSelected) {
      // 職種が選択されていない場合は、まず職種を選択
      toggleJobType(activeJobType);
    }

    const isFullySelected = isCategoryFullySelected(category, items);
    const newSelectedJobTypes = [...value.selectedJobTypes];
    const jobTypeIndex = newSelectedJobTypes.findIndex(
      (jt) => jt.jobType === activeJobType
    );

    if (jobTypeIndex < 0) return;

    const skills = [...newSelectedJobTypes[jobTypeIndex].skills];
    const skillIndex = skills.findIndex((s) => s.category === category);

    if (isFullySelected) {
      // すべて解除
      if (skillIndex >= 0) {
        skills.splice(skillIndex, 1);
      }
    } else {
      // すべて選択
      if (skillIndex >= 0) {
        skills[skillIndex] = { category, values: [...items] };
      } else {
        skills.push({ category, values: [...items] });
      }
    }

    newSelectedJobTypes[jobTypeIndex] = {
      ...newSelectedJobTypes[jobTypeIndex],
      skills,
    };

    onChange({ selectedJobTypes: newSelectedJobTypes });
  };

  // 選択済みアイテム数を取得
  const getSelectedCount = (jobType?: JobType): number => {
    const jt = jobType
      ? value.selectedJobTypes.find((j) => j.jobType === jobType)
      : currentJobTypeData;
    if (!jt) return 0;
    return jt.skills.reduce((sum, skill) => sum + skill.values.length, 0);
  };

  // 選択済みカテゴリ数を取得
  const getSelectedCategoryCount = (): number => {
    return currentJobTypeData?.skills.length ?? 0;
  };

  const filterData = jobTypeFilterData[activeJobType];
  const categories = Object.values(filterData);

  return (
    <div style={style}>
      {/* 職種タブ */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "2px solid #e5e7eb",
          flexWrap: "wrap",
        }}
      >
        {(Object.keys(jobTypeLabels) as JobType[]).map((jobType) => {
          const isActive = activeJobType === jobType;
          const isSelected = value.selectedJobTypes.some(
            (jt) => jt.jobType === jobType
          );
          const count = getSelectedCount(jobType);

          return (
            <button
              key={jobType}
              type="button"
              onClick={() => setActiveJobType(jobType)}
              style={{
                padding: "10px 20px",
                fontFamily: "Noto Sans JP",
                fontSize: "15px",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#dc2626" : "#6b7280",
                background: isSelected ? "#fee2e2" : "none",
                border: "none",
                borderBottom:
                  isActive ? "3px solid #dc2626" : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                borderRadius: "6px 6px 0 0",
                position: "relative",
              }}
            >
              {jobTypeLabels[jobType]}
              {isSelected && count > 0 && (
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "12px",
                    color: "#dc2626",
                    fontWeight: "bold",
                  }}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 職種選択チェックボックス */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f9fafb",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          <input
            type="checkbox"
            checked={isJobTypeSelected}
            onChange={() => toggleJobType(activeJobType)}
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          />
          <span>{jobTypeLabels[activeJobType]}として活動する</span>
        </label>
        {isJobTypeSelected && (
          <div
            style={{
              marginTop: "10px",
              fontFamily: "Noto Sans JP",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            選択中: {getSelectedCategoryCount()}カテゴリ / {getSelectedCount()}項目
          </div>
        )}
      </div>

      {/* カテゴリリスト */}
      {isJobTypeSelected && (
        <div
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.name);
            const isFullySelected = isCategoryFullySelected(
              category.name,
              category.items
            );
            const selectedItems = currentJobTypeData?.skills.find(
              (s) => s.category === category.name
            )?.values ?? [];

            return (
              <div key={category.name} style={{ marginBottom: "5px" }}>
                {/* カテゴリヘッダー */}
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
                    onClick={() => toggleCategory(category.name)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      marginRight: "10px",
                      fontSize: "16px",
                      color: "#6b7280",
                    }}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                  <input
                    type="checkbox"
                    checked={isFullySelected}
                    onChange={() =>
                      toggleCategorySelection(category.name, category.items)
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    onClick={() => toggleCategory(category.name)}
                    style={{
                      flex: 1,
                      fontFamily: "Noto Sans JP",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {category.name}
                    {selectedItems.length > 0 && (
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "13px",
                          color: "#dc2626",
                          fontWeight: "normal",
                        }}
                      >
                        ({selectedItems.length}/{category.items.length})
                      </span>
                    )}
                  </span>
                </div>

                {/* カテゴリアイテム */}
                {isExpanded && (
                  <div
                    style={{
                      marginLeft: "20px",
                      marginTop: "5px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {category.items.map((item) => {
                      const isSelected = isItemSelected(category.name, item);

                      return (
                        <label
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            backgroundColor: isSelected ? "#fecaca" : "white",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItem(category.name, item)}
                            style={{
                              width: "16px",
                              height: "16px",
                              marginRight: "8px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "Noto Sans JP",
                              fontSize: "14px",
                              color: "black",
                              lineHeight: "1.4",
                            }}
                          >
                            {item}
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

      {/* 職種未選択時のメッセージ */}
      {!isJobTypeSelected && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#9ca3af",
            fontFamily: "Noto Sans JP",
            fontSize: "15px",
          }}
        >
          「{jobTypeLabels[activeJobType]}として活動する」にチェックを入れて、<br />
          詳細な職種情報を選択してください
        </div>
      )}
    </div>
  );
};

export default JobTypeSelector;

