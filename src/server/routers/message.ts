/**
 * メッセージ関連のtRPC Router
 * メッセージスレッドの作成、メッセージの送信・取得
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
  /**
   * メッセージスレッド作成（スカウト時に呼ばれる）
   */
  createThread: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        casterId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { ordererId, casterId } = input;

      if (ordererId === casterId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "発注者と受注者は異なるユーザーである必要があります",
        });
      }

      try {
        // 既存のスレッドを確認
        const existingThread = await ctx.prisma.messageThread.findUnique({
          where: {
            ordererId_casterId: {
              ordererId,
              casterId,
            },
          },
        });

        if (existingThread) {
          return {
            success: true,
            threadId: existingThread.id,
            isNew: false,
          };
        }

        // 新しいスレッドを作成
        const thread = await ctx.prisma.messageThread.create({
          data: {
            ordererId,
            casterId,
          },
        });

        return {
          success: true,
          threadId: thread.id,
          isNew: true,
        };
      } catch (error) {
        console.error("スレッド作成エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッド作成中にエラーが発生しました",
        });
      }
    }),

  /**
   * メッセージ送信
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid(),
        senderId: z.string().uuid(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { threadId, senderId, content } = input;

      try {
        // スレッドの存在確認と権限チェック
        const thread = await ctx.prisma.messageThread.findUnique({
          where: { id: threadId },
        });

        if (!thread) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "スレッドが見つかりません",
          });
        }

        // 送信者がスレッドの参加者であることを確認
        if (thread.ordererId !== senderId && thread.casterId !== senderId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "このスレッドにメッセージを送信する権限がありません",
          });
        }

        // メッセージを作成
        const message = await ctx.prisma.message.create({
          data: {
            threadId,
            senderId,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });

        // スレッドの更新日時を更新
        await ctx.prisma.messageThread.update({
          where: { id: threadId },
          data: { updatedAt: new Date() },
        });

        return {
          success: true,
          message,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("メッセージ送信エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "メッセージ送信中にエラーが発生しました",
        });
      }
    }),

  /**
   * メッセージスレッド取得
   */
  getThread: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { threadId, userId } = input;

      try {
        const thread = await ctx.prisma.messageThread.findUnique({
          where: { id: threadId },
          include: {
            orderer: {
              select: {
                id: true,
                email: true,
                ordererProfile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
            caster: {
              select: {
                id: true,
                email: true,
                casterProfile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        if (!thread) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "スレッドが見つかりません",
          });
        }

        // ユーザーがスレッドの参加者であることを確認
        if (thread.ordererId !== userId && thread.casterId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "このスレッドにアクセスする権限がありません",
          });
        }

        return thread;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("スレッド取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッド取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * ユーザーのメッセージスレッド一覧取得
   */
  getThreads: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      try {
        const threads = await ctx.prisma.messageThread.findMany({
          where: {
            OR: [
              { ordererId: userId },
              { casterId: userId },
            ],
          },
          include: {
            orderer: {
              select: {
                id: true,
                email: true,
                ordererProfile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
            caster: {
              select: {
                id: true,
                email: true,
                casterProfile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });

        return threads;
      } catch (error) {
        console.error("スレッド一覧取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッド一覧取得中にエラーが発生しました",
        });
      }
    }),
});


