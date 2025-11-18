import { z } from "zod";
import {
  CasterProfileUpdateSchema,
  OrdererProfileUpdateSchema,
} from "@/lib/validations/userSchema";

// ===================================
// ユーザープロフィール型定義
// ===================================

export type CasterProfileUpdate = z.infer<typeof CasterProfileUpdateSchema>;
export type OrdererProfileUpdate = z.infer<typeof OrdererProfileUpdateSchema>;

