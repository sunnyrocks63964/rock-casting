/**
 * 稼働エリア関連のヘルパー関数
 * CasterWorkAreaとCasterTravelAreaの作成処理
 * OrderDesireWorkAreaの作成処理
 */

import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";

// トランザクションクライアントの型
export type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

/**
 * workAreaDataからCasterWorkAreaとCasterTravelAreaを作成するヘルパー関数
 * トランザクションクライアントを直接使用してトランザクションコンテキストを保持
 */
export async function createWorkAreas({
  prisma,
  casterProfileId,
  workAreas,
  travelAreas,
}: {
  prisma: PrismaClient | TransactionClient;
  casterProfileId: string;
  workAreas: Array<{ prefectureCode: number; tokyoWardCode?: number }>;
  travelAreas: Array<{ prefectureCode: number; tokyoWardCode?: number }>;
}) {
  try {
    // 必要な都道府県コードと東京23区コードを収集
    const prefectureCodes = new Set<number>();
    const tokyoWardCodes = new Set<number>();
    
    for (const area of workAreas) {
      prefectureCodes.add(area.prefectureCode);
      if (area.tokyoWardCode !== undefined) {
        tokyoWardCodes.add(area.tokyoWardCode);
      }
    }
    
    for (const area of travelAreas) {
      prefectureCodes.add(area.prefectureCode);
      if (area.tokyoWardCode !== undefined) {
        tokyoWardCodes.add(area.tokyoWardCode);
      }
    }

    // 都道府県と東京23区を一括取得
    const [prefectures, tokyoWards] = await Promise.all([
      prisma.prefecture.findMany({
        where: { code: { in: Array.from(prefectureCodes) } },
      }),
      tokyoWardCodes.size > 0
        ? prisma.tokyoWard.findMany({
            where: { code: { in: Array.from(tokyoWardCodes) } },
          })
        : Promise.resolve([]),
    ]);

    // マップを作成して高速検索
    const prefectureMap = new Map(prefectures.map((p) => [p.code, p]));
    const tokyoWardMap = new Map(tokyoWards.map((w) => [w.code, w]));

    // 稼働エリアのデータを準備
    const workAreasToCreate: Array<{
      casterProfileId: string;
      prefectureId: string;
      tokyoWardId?: string;
    }> = [];

    for (const area of workAreas) {
      const prefecture = prefectureMap.get(area.prefectureCode);
      if (!prefecture) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `都道府県コード ${area.prefectureCode} が見つかりません`,
        });
      }

      const workAreaData: {
        casterProfileId: string;
        prefectureId: string;
        tokyoWardId?: string;
      } = {
        casterProfileId,
        prefectureId: prefecture.id,
      };

      if (area.tokyoWardCode !== undefined) {
        const tokyoWard = tokyoWardMap.get(area.tokyoWardCode);
        if (!tokyoWard) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `東京23区コード ${area.tokyoWardCode} が見つかりません`,
          });
        }
        workAreaData.tokyoWardId = tokyoWard.id;
      }

      workAreasToCreate.push(workAreaData);
    }

    // 出張対応エリアのデータを準備
    const travelAreasToCreate: Array<{
      casterProfileId: string;
      prefectureId: string;
      tokyoWardId?: string;
    }> = [];

    for (const area of travelAreas) {
      const prefecture = prefectureMap.get(area.prefectureCode);
      if (!prefecture) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `都道府県コード ${area.prefectureCode} が見つかりません`,
        });
      }

      const travelAreaData: {
        casterProfileId: string;
        prefectureId: string;
        tokyoWardId?: string;
      } = {
        casterProfileId,
        prefectureId: prefecture.id,
      };

      if (area.tokyoWardCode !== undefined) {
        const tokyoWard = tokyoWardMap.get(area.tokyoWardCode);
        if (!tokyoWard) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `東京23区コード ${area.tokyoWardCode} が見つかりません`,
          });
        }
        travelAreaData.tokyoWardId = tokyoWard.id;
      }

      travelAreasToCreate.push(travelAreaData);
    }

    // バッチでエリアを作成
    if (workAreasToCreate.length > 0) {
      await prisma.casterWorkArea.createMany({
        data: workAreasToCreate,
      });
    }

    if (travelAreasToCreate.length > 0) {
      await prisma.casterTravelArea.createMany({
        data: travelAreasToCreate,
      });
    }
  } catch (error) {
    // TRPCErrorの場合はそのまま再スロー
    if (error instanceof TRPCError) {
      throw error;
    }
    
    // その他のエラーの場合、詳細な情報をログに記録
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    const errorCode = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
    
    console.error("createWorkAreasエラー:", {
      message: errorMessage,
      code: errorCode,
      casterProfileId,
      error,
    });
    
    // トランザクションエラーの場合、より詳細なエラーメッセージを提供
    if (errorCode === "P2028" || errorMessage.includes("Transaction")) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `トランザクションエラーが発生しました: ${errorMessage}`,
      });
    }
    
    throw error;
  }
}

/**
 * 希望活動エリアデータからOrderDesireWorkAreaを作成するヘルパー関数
 * トランザクションクライアントを直接使用してトランザクションコンテキストを保持
 */
export async function createOrderDesireWorkAreas({
  prisma,
  ordererProfileId,
  workAreas,
}: {
  prisma: PrismaClient | TransactionClient;
  ordererProfileId: string;
  workAreas: Array<{ prefectureCode: number; tokyoWardCode?: number }>;
}) {
  try {
    // 必要な都道府県コードと東京23区コードを収集
    const prefectureCodes = new Set<number>();
    const tokyoWardCodes = new Set<number>();
    
    for (const area of workAreas) {
      prefectureCodes.add(area.prefectureCode);
      if (area.tokyoWardCode !== undefined) {
        tokyoWardCodes.add(area.tokyoWardCode);
      }
    }

    // 都道府県と東京23区を一括取得
    const [prefectures, tokyoWards] = await Promise.all([
      prisma.prefecture.findMany({
        where: { code: { in: Array.from(prefectureCodes) } },
      }),
      tokyoWardCodes.size > 0
        ? prisma.tokyoWard.findMany({
            where: { code: { in: Array.from(tokyoWardCodes) } },
          })
        : Promise.resolve([]),
    ]);

    // マップを作成して高速検索
    const prefectureMap = new Map(prefectures.map((p) => [p.code, p]));
    const tokyoWardMap = new Map(tokyoWards.map((w) => [w.code, w]));

    // 希望活動エリアのデータを準備
    const workAreasToCreate: Array<{
      ordererProfileId: string;
      prefectureId: string;
      tokyoWardId?: string;
    }> = [];

    for (const area of workAreas) {
      const prefecture = prefectureMap.get(area.prefectureCode);
      if (!prefecture) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `都道府県コード ${area.prefectureCode} が見つかりません`,
        });
      }

      const workAreaData: {
        ordererProfileId: string;
        prefectureId: string;
        tokyoWardId?: string;
      } = {
        ordererProfileId,
        prefectureId: prefecture.id,
      };

      if (area.tokyoWardCode !== undefined) {
        const tokyoWard = tokyoWardMap.get(area.tokyoWardCode);
        if (!tokyoWard) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `東京23区コード ${area.tokyoWardCode} が見つかりません`,
          });
        }
        workAreaData.tokyoWardId = tokyoWard.id;
      }

      workAreasToCreate.push(workAreaData);
    }

    // バッチでエリアを作成
    if (workAreasToCreate.length > 0) {
      await prisma.orderDesireWorkArea.createMany({
        data: workAreasToCreate,
      });
    }
  } catch (error) {
    // TRPCErrorの場合はそのまま再スロー
    if (error instanceof TRPCError) {
      throw error;
    }
    
    // その他のエラーの場合、詳細な情報をログに記録
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    const errorCode = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
    
    console.error("createOrderDesireWorkAreasエラー:", {
      message: errorMessage,
      code: errorCode,
      ordererProfileId,
      error,
    });
    
    // トランザクションエラーの場合、より詳細なエラーメッセージを提供
    if (errorCode === "P2028" || errorMessage.includes("Transaction")) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `トランザクションエラーが発生しました: ${errorMessage}`,
      });
    }
    
    throw error;
  }
}

