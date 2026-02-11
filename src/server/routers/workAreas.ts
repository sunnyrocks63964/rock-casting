/**
 * 稼働エリア関連のヘルパー関数
 * CasterWorkAreaとCasterTravelAreaの作成処理
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
    // 稼働エリアを作成
    for (const area of workAreas) {
      const prefecture = await prisma.prefecture.findUnique({
        where: { code: area.prefectureCode },
      });

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
        const tokyoWard = await prisma.tokyoWard.findUnique({
          where: { code: area.tokyoWardCode },
        });

        if (!tokyoWard) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `東京23区コード ${area.tokyoWardCode} が見つかりません`,
          });
        }

        workAreaData.tokyoWardId = tokyoWard.id;
      }

      await prisma.casterWorkArea.create({
        data: workAreaData,
      });
    }

    // 出張対応エリアを作成
    for (const area of travelAreas) {
      const prefecture = await prisma.prefecture.findUnique({
        where: { code: area.prefectureCode },
      });

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
        const tokyoWard = await prisma.tokyoWard.findUnique({
          where: { code: area.tokyoWardCode },
        });

        if (!tokyoWard) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `東京23区コード ${area.tokyoWardCode} が見つかりません`,
          });
        }

        travelAreaData.tokyoWardId = tokyoWard.id;
      }

      await prisma.casterTravelArea.create({
        data: travelAreaData,
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

