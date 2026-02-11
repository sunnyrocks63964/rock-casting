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
  bio: z.string().max(500).optional(),
  achievements: z.string().max(2000).optional(),
  mainProfileImage: z.string().url().optional().nullable(),
  subProfileImages: z.array(z.string().url()).max(4).optional(),
  residence: z.string().max(200).optional(),
  birthdate: z.string().datetime().optional().nullable(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional().nullable(),
  height: z.number().int().min(0).max(300).optional().nullable(),
  weight: z.number().int().min(0).max(500).optional().nullable(),
  snsInstagram: z.string().url().optional().nullable(),
  snsX: z.string().url().optional().nullable(),
  snsYoutube: z.string().url().optional().nullable(),
  snsFacebook: z.string().url().optional().nullable(),
  workStyle: z.string().max(50).optional(),
  minBudget: z.number().int().min(0).optional().nullable(),
  maxBudget: z.number().int().min(0).optional().nullable(),
});

// ===================================
// 発注者プロフィールスキーマ
// ===================================

/// 発注者プロフィール更新（すべて任意）
export const OrdererProfileUpdateSchema = z.object({
  fullName: z.string().max(100).optional(),
  mainProfileImage: z.string().url().optional().nullable(),
  industry: z.string().max(100).optional(),
  websiteUrl: z.array(urlSchema).optional(),
  desiredWorkAreas: z.array(z.string()).max(47).optional(),
  desiredOccupations: z.array(z.string()).max(20).optional(),
});

