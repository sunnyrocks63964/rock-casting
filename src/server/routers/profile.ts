/**
 * プロフィール関連のtRPC Router
 * プロフィール取得・更新（キャスト/発注者）
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
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
            jobTypes: {
              include: {
                skills: true,
              },
            },
            workAreas: {
              include: {
                prefecture: true,
                city: true,
                tokyoWard: true,
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

  /**
   * キャスト一覧取得
   */
  getCasterList: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(15),
        searchKeyword: z.string().optional(),
        jobTypeFilters: z
          .record(
            z.string(),
            z.record(z.string(), z.array(z.string()))
          )
          .optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, searchKeyword, jobTypeFilters } = input;

      try {
        const skip = (page - 1) * limit;

        // 検索条件の構築
        const where: Prisma.UserWhereInput = {
          casterProfile: {
            isNot: null,
          },
        };

        // キーワード検索（名前、職業、エリアで検索）
        if (searchKeyword && searchKeyword.trim()) {
          where.OR = [
            {
              casterProfile: {
                fullName: {
                  contains: searchKeyword.trim(),
                  mode: "insensitive",
                },
              },
            },
            {
              casterProfile: {
                occupation: {
                  contains: searchKeyword.trim(),
                  mode: "insensitive",
                },
              },
            },
            {
              casterProfile: {
                area: {
                  contains: searchKeyword.trim(),
                  mode: "insensitive",
                },
              },
            },
          ];
        }

        // 職種フィルターの適用
        if (jobTypeFilters && Object.keys(jobTypeFilters).length > 0) {
          const jobTypeFilterConditions: Prisma.UserWhereInput[] = [];

          // 各職種ごとにフィルター条件を構築
          Object.entries(jobTypeFilters).forEach(([jobType, categories]) => {
            // この職種に選択されたカテゴリがあるかチェック
            const hasSelectedCategories = Object.values(categories).some(
              (values) => values.length > 0
            );

            if (!hasSelectedCategories) {
              return;
            }

            // 各カテゴリごとのスキル条件を構築
            const skillConditions: Prisma.CasterJobSkillWhereInput[] = [];
            Object.entries(categories).forEach(([category, values]) => {
              if (values.length > 0) {
                skillConditions.push({
                  category,
                  value: {
                    in: values,
                  },
                });
              }
            });

            // この職種にマッチする条件を構築
            // 職種が存在し、かつ選択されたスキル条件のいずれかにマッチする必要がある
            const jobTypeCondition: Prisma.UserWhereInput = {
              casterProfile: {
                jobTypes: {
                  some: {
                    jobType: jobType as "photographer" | "model" | "artist" | "creator",
                    skills: {
                      some: {
                        OR: skillConditions,
                      },
                    },
                  },
                },
              },
            };

            jobTypeFilterConditions.push(jobTypeCondition);
          });

          // 職種フィルター条件をORで結合（いずれかの職種にマッチすればOK）
          if (jobTypeFilterConditions.length > 0) {
            // 既存のOR条件がある場合はANDで結合、ない場合は直接設定
            if (where.OR) {
              where.AND = [
                { OR: where.OR },
                { OR: jobTypeFilterConditions },
              ];
              delete where.OR;
            } else {
              where.OR = jobTypeFilterConditions;
            }
          }
        }

        // キャスト一覧を取得
        const [casters, total] = await Promise.all([
          ctx.prisma.user.findMany({
            where,
            include: {
              casterProfile: {
                include: {
                  jobTypes: {
                    include: {
                      skills: true,
                    },
                  },
                  workAreas: {
                    include: {
                      prefecture: true,
                      city: true,
                      tokyoWard: true,
                    },
                  },
                },
              },
            },
            skip,
            take: limit,
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.user.count({
            where,
          }),
        ]);

        return {
          casters: casters.filter((user) => user.casterProfile !== null),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } catch (error) {
        console.error("キャスト一覧取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "キャスト一覧取得中にエラーが発生しました",
        });
      }
    }),
});

