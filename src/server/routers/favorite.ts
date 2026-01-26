/**
 * お気に入り関連のtRPC Router
 * 発注者がキャストをお気に入りに追加・削除・一覧取得
 * キャストが案件をお気に入りに追加・削除・一覧取得
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const favoriteRouter = createTRPCRouter({
  /**
   * お気に入りに追加
   */
  addFavorite: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        casterId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { ordererId, casterId } = input;

      try {
        // 既にお気に入りに追加されているか確認
        const existingFavorite = await ctx.prisma.ordererFavoriteCaster.findUnique({
          where: {
            ordererId_casterId: {
              ordererId,
              casterId,
            },
          },
        });

        if (existingFavorite) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "既にお気に入りに追加されています",
          });
        }

        // お気に入りに追加
        const favorite = await ctx.prisma.ordererFavoriteCaster.create({
          data: {
            ordererId,
            casterId,
          },
        });

        return favorite;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("お気に入り追加エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り追加中にエラーが発生しました",
        });
      }
    }),

  /**
   * お気に入りから削除
   */
  removeFavorite: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        casterId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { ordererId, casterId } = input;

      try {
        await ctx.prisma.ordererFavoriteCaster.delete({
          where: {
            ordererId_casterId: {
              ordererId,
              casterId,
            },
          },
        });

        return { success: true };
      } catch (error) {
        console.error("お気に入り削除エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り削除中にエラーが発生しました",
        });
      }
    }),

  /**
   * お気に入り一覧取得
   */
  getFavoriteCasters: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(15),
      })
    )
    .query(async ({ input, ctx }) => {
      const { ordererId, page, limit } = input;
      const skip = (page - 1) * limit;

      try {
        const [favorites, total] = await Promise.all([
          ctx.prisma.ordererFavoriteCaster.findMany({
            where: {
              ordererId,
            },
            include: {
              caster: {
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
              },
            },
            skip,
            take: limit,
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.ordererFavoriteCaster.count({
            where: {
              ordererId,
            },
          }),
        ]);

        return {
          casters: favorites
            .map((favorite) => favorite.caster)
            .filter((caster) => caster.casterProfile !== null),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } catch (error) {
        console.error("お気に入り一覧取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り一覧取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * お気に入り状態を確認
   */
  isFavorite: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        casterId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { ordererId, casterId } = input;

      try {
        const favorite = await ctx.prisma.ordererFavoriteCaster.findUnique({
          where: {
            ordererId_casterId: {
              ordererId,
              casterId,
            },
          },
        });

        return { isFavorite: favorite !== null };
      } catch (error) {
        console.error("お気に入り状態確認エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り状態確認中にエラーが発生しました",
        });
      }
    }),

  /**
   * キャストが案件をお気に入りに追加
   */
  addFavoriteProject: publicProcedure
    .input(
      z.object({
        casterId: z.string().uuid(),
        projectId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { casterId, projectId } = input;

      try {
        // 既にお気に入りに追加されているか確認
        const existingFavorite = await ctx.prisma.casterFavoriteOrderProject.findUnique({
          where: {
            casterId_projectId: {
              casterId,
              projectId,
            },
          },
        });

        if (existingFavorite) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "既にお気に入りに追加されています",
          });
        }

        // お気に入りに追加
        const favorite = await ctx.prisma.casterFavoriteOrderProject.create({
          data: {
            casterId,
            projectId,
          },
        });

        return favorite;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("お気に入り追加エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り追加中にエラーが発生しました",
        });
      }
    }),

  /**
   * キャストが案件をお気に入りから削除
   */
  removeFavoriteProject: publicProcedure
    .input(
      z.object({
        casterId: z.string().uuid(),
        projectId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { casterId, projectId } = input;

      try {
        await ctx.prisma.casterFavoriteOrderProject.delete({
          where: {
            casterId_projectId: {
              casterId,
              projectId,
            },
          },
        });

        return { success: true };
      } catch (error) {
        console.error("お気に入り削除エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り削除中にエラーが発生しました",
        });
      }
    }),

  /**
   * キャストのお気に入り案件一覧取得
   */
  getFavoriteProjects: publicProcedure
    .input(
      z.object({
        casterId: z.string().uuid(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(15),
      })
    )
    .query(async ({ input, ctx }) => {
      const { casterId, page, limit } = input;
      const skip = (page - 1) * limit;

      try {
        const [favorites, total] = await Promise.all([
          ctx.prisma.casterFavoriteOrderProject.findMany({
            where: {
              casterId,
            },
            include: {
              project: {
                include: {
                  user: {
                    include: {
                      organization: true,
                      ordererProfile: true,
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
          ctx.prisma.casterFavoriteOrderProject.count({
            where: {
              casterId,
            },
          }),
        ]);

        return {
          projects: favorites.map((favorite) => favorite.project),
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } catch (error) {
        console.error("お気に入り一覧取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り一覧取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * キャストが案件をお気に入りに登録しているか確認
   */
  isFavoriteProject: publicProcedure
    .input(
      z.object({
        casterId: z.string().uuid(),
        projectId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { casterId, projectId } = input;

      try {
        const favorite = await ctx.prisma.casterFavoriteOrderProject.findUnique({
          where: {
            casterId_projectId: {
              casterId,
              projectId,
            },
          },
        });

        return { isFavorite: favorite !== null };
      } catch (error) {
        console.error("お気に入り状態確認エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "お気に入り状態確認中にエラーが発生しました",
        });
      }
    }),
});
