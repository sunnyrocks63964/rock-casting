/**
 * 稼働エリア関連のヘルパー関数
 * CasterWorkAreaとCasterTravelAreaの作成処理
 */

import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";

// トランザクションクライアントの型
export type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

// PrismaClientとTransactionClientの両方で使用できる共通の型
// 実際のPrismaクライアントの型から必要なプロパティを抽出
// Prismaの型定義では、モデルプロパティは動的に生成されるため、インデックスアクセスを使用
type PrismaClientLike = {
  prefecture: {
    findUnique: <T extends { where: { code: number } }>(
      args: T
    ) => Promise<{ id: string } | null>;
  };
  tokyoWard: {
    findUnique: <T extends { where: { code: number } }>(
      args: T
    ) => Promise<{ id: string } | null>;
  };
  casterWorkArea: {
    create: <T extends {
      data: {
        casterProfileId: string;
        prefectureId: string;
        tokyoWardId?: string;
      };
    }>(
      args: T
    ) => Promise<void>;
  };
  casterTravelArea: {
    create: <T extends {
      data: {
        casterProfileId: string;
        prefectureId: string;
        tokyoWardId?: string;
      };
    }>(
      args: T
    ) => Promise<void>;
  };
};

// プロパティが有効なモデルオブジェクトかチェックするヘルパー関数
function isValidModel(
  prop: unknown,
  methodName: string
): prop is { [key: string]: (...args: unknown[]) => unknown } {
  return (
    typeof prop === "object" &&
    prop !== null &&
    methodName in prop &&
    typeof (prop as { [key: string]: unknown })[methodName] === "function"
  );
}

// findUniqueメソッドを持つモデルかチェックする型ガード
function hasFindUniqueMethod(
  prop: unknown
): prop is {
  findUnique: (args: { where: { code: number } }) => Promise<{ id: string } | null>;
} {
  return (
    typeof prop === "object" &&
    prop !== null &&
    "findUnique" in prop &&
    typeof (prop as { findUnique: unknown }).findUnique === "function"
  );
}

// createメソッドを持つモデルかチェックする型ガード
function hasCreateMethod(
  prop: unknown
): prop is {
  create: (args: {
    data: {
      casterProfileId: string;
      prefectureId: string;
      tokyoWardId?: string;
    };
  }) => Promise<void>;
} {
  return (
    typeof prop === "object" &&
    prop !== null &&
    "create" in prop &&
    typeof (prop as { create: unknown }).create === "function"
  );
}

// PrismaClientとTransactionClientをPrismaClientLikeに変換するヘルパー関数
// 型ガードを使用して型安全にアクセス（型アサーションなし）
function toPrismaClientLike(client: PrismaClient | TransactionClient): PrismaClientLike {
  // 型ガード: PrismaClientとTransactionClientは両方とも同じモデルプロパティを持つ
  // プロパティの存在とメソッドの存在を確認して型安全にアクセス
  // 必要なプロパティとメソッドの定義
  const models = [
    { name: "prefecture", method: "findUnique" },
    { name: "tokyoWard", method: "findUnique" },
    { name: "casterWorkArea", method: "create" },
    { name: "casterTravelArea", method: "create" },
  ] as const;

  // すべてのプロパティが存在し、有効なモデルオブジェクトかチェック
  const isValid = models.every(
    ({ name, method }) =>
      name in client &&
      isValidModel((client as Record<string, unknown>)[name], method)
  );

  if (!isValid) {
    throw new Error("Invalid Prisma client type");
  }

  // 型ガードにより、TypeScriptはこれらのプロパティとメソッドが存在することを認識
  // プロパティの存在を確認してから、型ガードで検証
  if (
    !("prefecture" in client) ||
    !("tokyoWard" in client) ||
    !("casterWorkArea" in client) ||
    !("casterTravelArea" in client)
  ) {
    throw new Error("Invalid Prisma client type");
  }

  // `in`演算子で存在確認済みなので、プロパティを安全に取得
  // 型アサーションは最小限（プロパティアクセスのため）
  const prefecture = (client as { prefecture?: unknown }).prefecture;
  const tokyoWard = (client as { tokyoWard?: unknown }).tokyoWard;
  const casterWorkArea = (client as { casterWorkArea?: unknown }).casterWorkArea;
  const casterTravelArea = (client as { casterTravelArea?: unknown }).casterTravelArea;

  // 型ガードで各プロパティを検証
  if (
    !hasFindUniqueMethod(prefecture) ||
    !hasFindUniqueMethod(tokyoWard) ||
    !hasCreateMethod(casterWorkArea) ||
    !hasCreateMethod(casterTravelArea)
  ) {
    throw new Error("Invalid Prisma client type");
  }

  // 型ガードにより、TypeScriptは各プロパティが正しい型であることを認識
  return {
    prefecture: {
      findUnique: (args: { where: { code: number } }) => prefecture.findUnique(args),
    },
    tokyoWard: {
      findUnique: (args: { where: { code: number } }) => tokyoWard.findUnique(args),
    },
    casterWorkArea: {
      create: (args: {
        data: {
          casterProfileId: string;
          prefectureId: string;
          tokyoWardId?: string;
        };
      }) => casterWorkArea.create(args),
    },
    casterTravelArea: {
      create: (args: {
        data: {
          casterProfileId: string;
          prefectureId: string;
          tokyoWardId?: string;
        };
      }) => casterTravelArea.create(args),
    },
  };
}

/**
 * workAreaDataからCasterWorkAreaとCasterTravelAreaを作成するヘルパー関数
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
  // PrismaClientLikeに変換して型安全にアクセス
  const client = toPrismaClientLike(prisma);

  // 稼働エリアを作成
  for (const area of workAreas) {
    const prefecture = await client.prefecture.findUnique({
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
      const tokyoWard = await client.tokyoWard.findUnique({
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

    await client.casterWorkArea.create({
      data: workAreaData,
    });
  }

  // 出張対応エリアを作成
  for (const area of travelAreas) {
    const prefecture = await client.prefecture.findUnique({
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
      const tokyoWard = await client.tokyoWard.findUnique({
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

    await client.casterTravelArea.create({
      data: travelAreaData,
    });
  }
}

