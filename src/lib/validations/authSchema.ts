/**
 * 認証・ユーザー登録用のZodスキーマ（最小限版）
 * tRPCのバリデーションとフォームバリデーションで共有
 */

import { z } from "zod";

// ===================================
// カスタムバリデーション
// ===================================

// Email検証（再利用可能）
export const emailSchema = z.string().refine(
  (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  },
  { message: "有効なメールアドレスを入力してください" }
);

// ===================================
// Enums
// ===================================

// 登録時の役割選択
export const UserRoleSchema = z.enum(["caster", "orderer", "both"]);

// ===================================
// ユーザー登録スキーマ
// ===================================

/// 基本登録情報（メール・パスワードのみ）
export const BaseRegisterSchema = z.object({
  email: emailSchema.min(1, "メールアドレスは必須です"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で設定してください")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "パスワードは大文字、小文字、数字を含む必要があります",
    }),
  passwordConfirm: z.string(),
  role: UserRoleSchema, // "caster" | "orderer" | "both"
}).refine((data) => data.password === data.passwordConfirm, {
  message: "パスワードが一致しません",
  path: ["passwordConfirm"],
});

// ===================================
// ログインスキーマ
// ===================================

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "パスワードを入力してください"),
});

// UserSchemaはLoginSchemaのエイリアス（後方互換性のため）
export const UserSchema = LoginSchema;

// ===================================
// パスワードリセットスキーマ
// ===================================

export const ResetPasswordRequestSchema = z.object({
  email: emailSchema,
});

export const ResetPasswordConfirmSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で設定してください")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "パスワードは大文字、小文字、数字を含む必要があります",
    }),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "パスワードが一致しません",
  path: ["passwordConfirm"],
});
