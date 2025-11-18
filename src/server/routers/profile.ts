/**
 * プロフィール関連のtRPC Router
 * プロフィール取得・更新（キャスト/発注者）
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  CasterProfileUpdateSchema,
  OrdererProfileUpdateSchema,
} from "@/lib/validations/userSchema";

export const profileRouter = createTRPCRouter({
  // ===================================
  // キャストプロフィール
  // ===================================

  /**
   * キャストプロフィール取得
   */
  getCasterProfile: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        const profile = await ctx.prisma.casterProfile.findUnique({
          where: { userId },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
            },
          },
        });

        if (!profile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "キャストプロフィールが見つかりません",
          });
        }

        return profile;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("プロフィール取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "プロフィール取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * キャストプロフィール更新
   */
  updateCasterProfile: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        data: CasterProfileUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, data } = input;

      try {
        // プロフィールの存在確認
        const existingProfile = await ctx.prisma.casterProfile.findUnique({
          where: { userId },
        });

        if (!existingProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "キャストプロフィールが見つかりません",
          });
        }

        // プロフィール更新
        const updatedProfile = await ctx.prisma.casterProfile.update({
          where: { userId },
          data,
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });

        return {
          success: true,
          profile: updatedProfile,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("プロフィール更新エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "プロフィール更新中にエラーが発生しました",
        });
      }
    }),

  // ===================================
  // 発注者プロフィール
  // ===================================

  /**
   * 発注者プロフィール取得
   */
  getOrdererProfile: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        const profile = await ctx.prisma.ordererProfile.findUnique({
          where: { userId },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
            },
          },
        });

        if (!profile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "発注者プロフィールが見つかりません",
          });
        }

        return profile;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("プロフィール取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "プロフィール取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * 発注者プロフィール更新
   */
  updateOrdererProfile: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        data: OrdererProfileUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, data } = input;

      try {
        // プロフィールの存在確認
        const existingProfile = await ctx.prisma.ordererProfile.findUnique({
          where: { userId },
        });

        if (!existingProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "発注者プロフィールが見つかりません",
          });
        }

        // プロフィール更新
        const updatedProfile = await ctx.prisma.ordererProfile.update({
          where: { userId },
          data,
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });

        return {
          success: true,
          profile: updatedProfile,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("プロフィール更新エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "プロフィール更新中にエラーが発生しました",
        });
      }
    }),

  // ===================================
  // ユーザー情報
  // ===================================

  /**
   * ユーザー情報取得（両方のプロフィールを含む）
   */
  getUserInfo: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
          include: {
            casterProfile: true,
            ordererProfile: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ユーザーが見つかりません",
          });
        }

        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("ユーザー情報取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ユーザー情報取得中にエラーが発生しました",
        });
      }
    }),
});

