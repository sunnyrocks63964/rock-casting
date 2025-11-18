/**
 * ユーザープロフィール用のZodスキーマ
 * キャスト・発注者の詳細情報
 */

import { z } from "zod";

// ===================================
// キャストプロフィールスキーマ
// ===================================

// URL検証（再利用可能）
export const urlSchema = z.string().refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "有効なURLを入力してください" }
  );  

/// キャストプロフィール更新（すべて任意）
export const CasterProfileUpdateSchema = z.object({
  fullName: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  occupation: z.string().max(100).optional(),
});

// ===================================
// 発注者プロフィールスキーマ
// ===================================

/// 発注者プロフィール更新（すべて任意）
export const OrdererProfileUpdateSchema = z.object({
  fullName: z.string().max(100).optional(),
  websiteUrl: z.array(urlSchema).optional(),
  desiredWorkAreas: z.array(z.string()).max(47).optional(),
  desiredOccupations: z.array(z.string()).max(20).optional(),
});

