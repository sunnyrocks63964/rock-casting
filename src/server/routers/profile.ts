/**
 * プロフィール関連のtRPC Router
 * プロフィール取得・更新（キャスト/発注者）
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma, PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  CasterProfileUpdateSchema,
  OrdererProfileUpdateSchema,
} from "@/lib/validations/userSchema";
import type { JobTypeSelectorData } from "@/components/JobTypeSelector";
import { createWorkAreas } from "./workAreas";
import Stripe from "stripe";

// Stripeクライアントの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

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
            travelAreas: {
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
        jobTypeData: z
          .object({
            selectedJobTypes: z.array(
              z.object({
                jobType: z.enum(["photographer", "model", "artist", "creator"]),
                skills: z.array(
                  z.object({
                    category: z.string(),
                    values: z.array(z.string()),
                  })
                ),
              })
            ),
          })
          .optional(),
        workAreaData: z
          .object({
            workAreas: z.array(
              z.object({
                prefectureCode: z.number().int().min(1).max(47),
                tokyoWardCode: z.number().int().min(1).max(23).optional(),
              })
            ),
            travelAreas: z.array(
              z.object({
                prefectureCode: z.number().int().min(1).max(47),
                tokyoWardCode: z.number().int().min(1).max(23).optional(),
              })
            ),
            onlineAvailable: z.boolean(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, data, jobTypeData, workAreaData } = input;

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

        // トランザクションでプロフィール更新と職種更新を実行
        // タイムアウトを30秒に設定（デフォルトは5秒）
        const result = await ctx.prisma.$transaction(
          async (tx) => {
            // プロフィール更新（workAreaDataがある場合はonlineAvailableも更新）
            const profileUpdateData = {
              ...data,
              ...(workAreaData ? { onlineAvailable: workAreaData.onlineAvailable } : {}),
            };
            const updatedProfile = await tx.casterProfile.update({
              where: { userId },
              data: profileUpdateData,
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            });

            // 活動エリアデータが提供されている場合、既存の活動エリアを削除して新規作成
            if (workAreaData) {
              // 既存の稼働エリアと出張対応エリアを削除
              await tx.casterWorkArea.deleteMany({
                where: { casterProfileId: existingProfile.id },
              });
              await tx.casterTravelArea.deleteMany({
                where: { casterProfileId: existingProfile.id },
              });

              // 新しい活動エリアを作成
              await createWorkAreas({
                prisma: tx,
                casterProfileId: existingProfile.id,
                workAreas: workAreaData.workAreas,
                travelAreas: workAreaData.travelAreas,
              });
            }

            // 職種データが提供されている場合、既存の職種を削除して新規作成
            if (jobTypeData) {
              // 既存の職種とスキルを一括削除
              const existingJobTypes = await tx.casterJobType.findMany({
                where: { casterProfileId: existingProfile.id },
                select: { id: true },
              });

              if (existingJobTypes.length > 0) {
                const jobTypeIds = existingJobTypes.map((jt) => jt.id);
                await tx.casterJobSkill.deleteMany({
                  where: { jobTypeId: { in: jobTypeIds } },
                });
                await tx.casterJobType.deleteMany({
                  where: { id: { in: jobTypeIds } },
                });
              }

              // 新しい職種とスキルを作成（バッチ処理）
              const jobTypeIds: string[] = [];
              for (const selectedJobType of jobTypeData.selectedJobTypes) {
                const casterJobType = await tx.casterJobType.create({
                  data: {
                    casterProfileId: existingProfile.id,
                    jobType: selectedJobType.jobType,
                  },
                });
                jobTypeIds.push(casterJobType.id);
              }

              // スキルを一括作成
              const skillsToCreate: Array<{
                jobTypeId: string;
                category: string;
                value: string;
              }> = [];
              let jobTypeIndex = 0;
              for (const selectedJobType of jobTypeData.selectedJobTypes) {
                const jobTypeId = jobTypeIds[jobTypeIndex];
                for (const skill of selectedJobType.skills) {
                  for (const value of skill.values) {
                    skillsToCreate.push({
                      jobTypeId,
                      category: skill.category,
                      value: value,
                    });
                  }
                }
                jobTypeIndex++;
              }

              // バッチでスキルを作成（100件ずつ）
              const batchSize = 100;
              for (let i = 0; i < skillsToCreate.length; i += batchSize) {
                const batch = skillsToCreate.slice(i, i + batchSize);
                await Promise.all(
                  batch.map((skill) =>
                    tx.casterJobSkill.create({
                      data: skill,
                    })
                  )
                );
              }
            }

            return updatedProfile;
          },
          {
            maxWait: 10000, // 10秒待機
            timeout: 30000, // 30秒タイムアウト
          }
        );

        return {
          success: true,
          profile: result,
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
   * キャストの売上管理データ取得
   */
  getCasterPayouts: publicProcedure
    .input(
      z.object({
        casterId: z.string().uuid(),
        year: z.number().int().min(2000).max(2100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { casterId, year } = input;

      try {
        // 指定年の納品済みデータを取得（statusがdeliveredのみ）
        const allPayouts = await ctx.prisma.casterPayout.findMany({
          where: {
            casterId,
            status: "delivered",
          },
          select: {
            amount: true,
            deliveredAt: true,
          },
        });

        // 指定年のデータのみをフィルタリング（deliveredAtを使用）
        const yearStart = new Date(`${year}-01-01`);
        const yearEnd = new Date(`${year + 1}-01-01`);
        const payouts = allPayouts.filter((payout) => {
          if (!payout.deliveredAt) {
            return false;
          }
          return payout.deliveredAt >= yearStart && payout.deliveredAt < yearEnd;
        });

        // 月ごとに集計
        const monthlyData: { month: number; amount: number }[] = [];
        for (let month = 1; month <= 12; month++) {
          const monthlyPayouts = payouts.filter((payout) => {
            if (!payout.deliveredAt) {
              return false;
            }
            const payoutMonth = payout.deliveredAt.getMonth() + 1;
            return payoutMonth === month;
          });

          const totalAmount = monthlyPayouts.reduce(
            (sum, payout) => sum + payout.amount,
            0
          );

          monthlyData.push({ month, amount: totalAmount });
        }

        return {
          year,
          monthlyData,
          totalAmount: monthlyData.reduce((sum, data) => sum + data.amount, 0),
        };
      } catch (error) {
        console.error("売上データ取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "売上データ取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * 発注者の支払い管理データ取得
   */
  getOrdererPayments: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        year: z.number().int().min(2000).max(2100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { ordererId, year } = input;

      try {
        // 指定年の支払い済みデータを取得（statusがpaidのみ）
        const allPayments = await ctx.prisma.orderPayment.findMany({
          where: {
            ordererId,
            status: "paid",
          },
          select: {
            totalAmount: true,
            paidAt: true,
          },
        });

        // 指定年のデータのみをフィルタリング
        const yearStart = new Date(`${year}-01-01`);
        const yearEnd = new Date(`${year + 1}-01-01`);
        const payments = allPayments.filter((payment) => {
          if (!payment.paidAt) {
            return false;
          }
          return payment.paidAt >= yearStart && payment.paidAt < yearEnd;
        });

        // 月ごとに集計
        const monthlyData: { month: number; amount: number }[] = [];
        for (let month = 1; month <= 12; month++) {
          const monthlyPayments = payments.filter((payment) => {
            if (!payment.paidAt) {
              return false;
            }
            const paymentMonth = payment.paidAt.getMonth() + 1;
            return paymentMonth === month;
          });

          const totalAmount = monthlyPayments.reduce(
            (sum, payment) => sum + payment.totalAmount,
            0
          );

          monthlyData.push({ month, amount: totalAmount });
        }

        return {
          year,
          monthlyData,
          totalAmount: monthlyData.reduce((sum, data) => sum + data.amount, 0),
        };
      } catch (error) {
        console.error("支払いデータ取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "支払いデータ取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * 発注者の募集中案件取得
   */
  getOrdererProjects: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        const projects = await ctx.prisma.orderProject.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return projects;
      } catch (error) {
        console.error("案件取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "案件取得中にエラーが発生しました",
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
        basicInfoFilters: z
          .object({
            ageMin: z.number().optional(),
            ageMax: z.number().optional(),
            heightMin: z.number().optional(),
            heightMax: z.number().optional(),
            gender: z.array(z.string()).optional(),
            availableDays: z.array(z.string()).optional(),
          })
          .optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, searchKeyword, jobTypeFilters, basicInfoFilters } = input;

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
            // 職種が存在することを条件にする
            // スキル条件がある場合は、それも条件に含める
            const jobTypeCondition: Prisma.UserWhereInput = {
              casterProfile: {
                jobTypes: {
                  some: {
                    jobType: jobType as "photographer" | "model" | "artist" | "creator",
                    ...(skillConditions.length > 0
                      ? {
                          skills: {
                            some: {
                              OR: skillConditions,
                            },
                          },
                        }
                      : {}),
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

        // 基本情報フィルターの適用
        if (basicInfoFilters) {
          const basicInfoFilterConditions: Prisma.UserWhereInput[] = [];

          // 年齢フィルター
          if (basicInfoFilters.ageMin !== undefined || basicInfoFilters.ageMax !== undefined) {
            const today = new Date();
            // 年齢ageMax以下になるには、今日からageMax年前の日付以降に生まれた必要がある
            // 例：ageMax=30の場合、1996年2月26日以降に生まれた人が30歳以下
            const maxBirthdate = basicInfoFilters.ageMax !== undefined
              ? new Date(today.getFullYear() - basicInfoFilters.ageMax, today.getMonth(), today.getDate())
              : null;
            // 年齢ageMin以上になるには、今日からageMin+1年前の日付以前に生まれた必要がある
            // 例：ageMin=20の場合、2006年2月26日以前に生まれた人が20歳以上
            const minBirthdate = basicInfoFilters.ageMin !== undefined
              ? new Date(today.getFullYear() - basicInfoFilters.ageMin - 1, today.getMonth(), today.getDate())
              : null;

            const ageCondition: Prisma.CasterProfileWhereInput = {};
            if (maxBirthdate && minBirthdate) {
              ageCondition.birthdate = { gte: maxBirthdate, lte: minBirthdate };
            } else if (maxBirthdate) {
              ageCondition.birthdate = { gte: maxBirthdate };
            } else if (minBirthdate) {
              ageCondition.birthdate = { lte: minBirthdate };
            }

            if (Object.keys(ageCondition).length > 0) {
              basicInfoFilterConditions.push({
                casterProfile: ageCondition,
              });
            }
          }

          // 身長フィルター
          if (basicInfoFilters.heightMin !== undefined || basicInfoFilters.heightMax !== undefined) {
            const heightCondition: Prisma.CasterProfileWhereInput = {};
            if (basicInfoFilters.heightMin !== undefined && basicInfoFilters.heightMax !== undefined) {
              heightCondition.height = { gte: basicInfoFilters.heightMin, lte: basicInfoFilters.heightMax };
            } else if (basicInfoFilters.heightMin !== undefined) {
              heightCondition.height = { gte: basicInfoFilters.heightMin };
            } else if (basicInfoFilters.heightMax !== undefined) {
              heightCondition.height = { lte: basicInfoFilters.heightMax };
            }

            if (Object.keys(heightCondition).length > 0) {
              basicInfoFilterConditions.push({
                casterProfile: heightCondition,
              });
            }
          }

          // 性別フィルター
          if (basicInfoFilters.gender && basicInfoFilters.gender.length > 0) {
            // UIの値（「男性」「女性」「その他」）をDBの値（male, female, other）に変換
            const genderMap: Record<string, "male" | "female" | "other" | "prefer_not_to_say"> = {
              "男性": "male",
              "女性": "female",
              "その他": "other",
            };
            const dbGenders = basicInfoFilters.gender
              .map((g) => genderMap[g])
              .filter((g): g is "male" | "female" | "other" | "prefer_not_to_say" => g !== undefined);

            if (dbGenders.length > 0) {
              basicInfoFilterConditions.push({
                casterProfile: {
                  gender: {
                    in: dbGenders,
                  },
                },
              });
            }
          }

          // 活動可能日フィルター
          if (basicInfoFilters.availableDays && basicInfoFilters.availableDays.length > 0) {
            // UIの値（「平日」「土日祝」など）を「活動可能日時」カテゴリの値にマッピング
            const availableDaysMap: Record<string, string[]> = {
              "平日": ["平日のみ", "平日・土日祝両方可能"],
              "土日祝": ["土日祝のみ", "平日・土日祝両方可能"],
              "早朝対応可能": ["早朝対応可能"],
              "深夜対応可能": ["深夜対応可能"],
              "即日対応可能": ["即日対応可能"],
            };

            const skillValues: string[] = [];
            basicInfoFilters.availableDays.forEach((day) => {
              const mappedValues = availableDaysMap[day];
              if (mappedValues) {
                skillValues.push(...mappedValues);
              }
            });

            if (skillValues.length > 0) {
              // 活動可能日時はCasterJobSkillの「活動可能日時」カテゴリに保存されている
              basicInfoFilterConditions.push({
                casterProfile: {
                  jobTypes: {
                    some: {
                      skills: {
                        some: {
                          category: "活動可能日時",
                          value: {
                            in: skillValues,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          }

          // 基本情報フィルター条件をORで結合（いずれかの条件にマッチすればOK）
          if (basicInfoFilterConditions.length > 0) {
            // 既存の条件がある場合はANDで結合
            if (where.OR) {
              if (where.AND) {
                const existingAndArray = Array.isArray(where.AND) ? where.AND : [where.AND];
                const newAndArray: Prisma.UserWhereInput[] = [...existingAndArray, { OR: basicInfoFilterConditions }];
                where.AND = newAndArray;
              } else {
                where.AND = [
                  { OR: where.OR },
                  { OR: basicInfoFilterConditions },
                ];
                delete where.OR;
              }
            } else if (where.AND) {
              const existingAndArray = Array.isArray(where.AND) ? where.AND : [where.AND];
              const newAndArray: Prisma.UserWhereInput[] = [...existingAndArray, { OR: basicInfoFilterConditions }];
              where.AND = newAndArray;
            } else {
              where.OR = basicInfoFilterConditions;
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

  /**
   * キャストのStripeアカウント情報取得
   * Stripe APIから最新の情報を取得してデータベースを更新する
   */
  getCasterStripeAccount: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        // ユーザーのCasterProfileを取得
        const casterProfile = await ctx.prisma.casterProfile.findUnique({
          where: { userId },
        });

        if (!casterProfile) {
          return null;
        }

        // Stripeアカウント情報を取得
        const stripeAccount = await ctx.prisma.casterStripeAccount.findUnique({
          where: { casterProfileId: casterProfile.id },
        });

        if (!stripeAccount) {
          return null;
        }

        // Stripe APIから最新のアカウント情報を取得
        try {
          const stripeAccountInfo = await stripe.accounts.retrieve(
            stripeAccount.stripeAccountId
          );

          // データベースを更新
          const updatedAccount = await ctx.prisma.casterStripeAccount.update({
            where: { id: stripeAccount.id },
            data: {
              businessType: stripeAccountInfo.business_type || null,
              country: stripeAccountInfo.country || null,
              isActive: stripeAccountInfo.details_submitted || false,
              isVerified:
                stripeAccountInfo.charges_enabled ||
                stripeAccountInfo.payouts_enabled ||
                false,
              chargesEnabled: stripeAccountInfo.charges_enabled || false,
              payoutsEnabled: stripeAccountInfo.payouts_enabled || false,
              verifiedAt:
                stripeAccountInfo.payouts_enabled && !stripeAccount.verifiedAt
                  ? new Date()
                  : stripeAccount.verifiedAt,
            },
          });

          return updatedAccount;
        } catch (stripeError) {
          // Stripe APIエラーの場合、データベースの情報を返す
          console.error("Stripe API取得エラー:", stripeError);
          return stripeAccount;
        }
      } catch (error) {
        console.error("Stripeアカウント情報取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripeアカウント情報取得中にエラーが発生しました",
        });
      }
    }),
});

