import { z } from "zod";
import {
  UserRoleSchema,
  BaseRegisterSchema,
  UserSchema,
  ResetPasswordRequestSchema,
  ResetPasswordConfirmSchema,
} from "@/lib/validations/authSchema";

// ===================================
// 認証関連型定義
// ===================================

export type UserRole = z.infer<typeof UserRoleSchema>;
export type BaseRegister = z.infer<typeof BaseRegisterSchema>;
export type User = z.infer<typeof UserSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type ResetPasswordConfirm = z.infer<typeof ResetPasswordConfirmSchema>;
