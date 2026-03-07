/**
 * 希望活動エリアの変換ユーティリティ
 * WorkAreaDataと文字列配列の相互変換
 * CasterWorkArea/CasterTravelAreaとWorkAreaDataの相互変換
 */

import type { WorkAreaData, SelectedArea } from "@/components/WorkAreaSelector";
import type { CasterWorkArea, CasterTravelArea } from "@prisma/client";

/**
 * SelectedAreaを文字列に変換
 * 形式: "都道府県コード" または "都道府県コード:東京23区コード"
 */
export function selectedAreaToString(area: SelectedArea): string {
  if (area.tokyoWardCode !== undefined) {
    return `${area.prefectureCode}:${area.tokyoWardCode}`;
  }
  return `${area.prefectureCode}`;
}

/**
 * 文字列をSelectedAreaに変換
 * 形式: "都道府県コード" または "都道府県コード:東京23区コード"
 */
export function stringToSelectedArea(str: string): SelectedArea | null {
  const parts = str.split(":");
  if (parts.length === 1) {
    const prefectureCode = parseInt(parts[0], 10);
    if (isNaN(prefectureCode)) {
      return null;
    }
    return { prefectureCode };
  }
  if (parts.length === 2) {
    const prefectureCode = parseInt(parts[0], 10);
    const tokyoWardCode = parseInt(parts[1], 10);
    if (isNaN(prefectureCode) || isNaN(tokyoWardCode)) {
      return null;
    }
    return { prefectureCode, tokyoWardCode };
  }
  return null;
}

/**
 * WorkAreaDataを文字列配列に変換
 * desiredWorkAreasフィールドに保存する形式
 */
export function workAreaDataToStringArray(data: WorkAreaData): string[] {
  const result: string[] = [];
  
  // workAreasを文字列配列に変換
  data.workAreas.forEach((area) => {
    const str = selectedAreaToString(area);
    if (str) {
      result.push(str);
    }
  });
  
  return result;
}

/**
 * 文字列配列をWorkAreaDataに変換
 * desiredWorkAreasフィールドから読み込む形式
 */
export function stringArrayToWorkAreaData(stringArray: string[]): WorkAreaData {
  const workAreas: SelectedArea[] = [];
  
  stringArray.forEach((str) => {
    const area = stringToSelectedArea(str);
    if (area) {
      workAreas.push(area);
    }
  });
  
  return {
    workAreas,
    travelAreas: [], // OrdererProfileでは出張対応エリアは使用しない
    onlineAvailable: false, // OrdererProfileではオンライン対応は使用しない
  };
}

/**
 * CasterWorkAreaとCasterTravelAreaをWorkAreaDataに変換
 * CasterProfileから読み込む形式
 */
export function casterWorkAreasToWorkAreaData(
  workAreas: Array<CasterWorkArea & { prefecture: { code: number } | null; tokyoWard: { code: number } | null }>,
  travelAreas: Array<CasterTravelArea & { prefecture: { code: number } | null; tokyoWard: { code: number } | null }>,
  onlineAvailable: boolean
): WorkAreaData {
  const workAreasData: SelectedArea[] = [];
  const travelAreasData: SelectedArea[] = [];

  workAreas.forEach((area) => {
    if (area.prefecture) {
      workAreasData.push({
        prefectureCode: area.prefecture.code,
        tokyoWardCode: area.tokyoWard?.code,
      });
    }
  });

  travelAreas.forEach((area) => {
    if (area.prefecture) {
      travelAreasData.push({
        prefectureCode: area.prefecture.code,
        tokyoWardCode: area.tokyoWard?.code,
      });
    }
  });

  return {
    workAreas: workAreasData,
    travelAreas: travelAreasData,
    onlineAvailable,
  };
}
