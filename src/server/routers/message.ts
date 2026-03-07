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
   * 複数のメッセージスレッドを一括作成（まとめてキャスティング時に呼ばれる）
   */
  createMultipleThreads: publicProcedure
    .input(
      z.object({
        ordererId: z.string().uuid(),
        casterIds: z.array(z.string().uuid()).min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { ordererId, casterIds } = input;

      try {
        const results = await Promise.all(
          casterIds.map(async (casterId) => {
            // 自分自身とのスレッドは作成しない
            if (ordererId === casterId) {
              return {
                casterId,
                success: false,
                error: "発注者と受注者は異なるユーザーである必要があります",
              };
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
                  casterId,
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
                casterId,
                success: true,
                threadId: thread.id,
                isNew: true,
              };
            } catch (error) {
              console.error(`スレッド作成エラー (casterId: ${casterId}):`, error);
              return {
                casterId,
                success: false,
                error: "スレッド作成中にエラーが発生しました",
              };
            }
          })
        );

        const successCount = results.filter((r) => r.success).length;
        const newThreadCount = results.filter((r) => r.success && r.isNew).length;
        const existingThreadCount = results.filter((r) => r.success && !r.isNew).length;
        const errorCount = results.filter((r) => !r.success).length;

        return {
          success: true,
          results,
          summary: {
            total: casterIds.length,
            success: successCount,
            new: newThreadCount,
            existing: existingThreadCount,
            errors: errorCount,
          },
        };
      } catch (error) {
        console.error("複数スレッド作成エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "複数スレッド作成中にエラーが発生しました",
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
            contractProposals: {
              include: {
                proposer: {
                  select: {
                    id: true,
                    email: true,
                    casterProfile: {
                      select: {
                        fullName: true,
                      },
                    },
                    ordererProfile: {
                      select: {
                        fullName: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
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

  /**
   * 契約条件提示を作成
   */
  createContractProposal: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid(),
        proposerId: z.string().uuid(),
        contractAmount: z.number().int().positive(),
        projectContent: z.string().min(1).max(5000),
        completionDate: z.string(), // ISO 8601形式の日付文字列
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { threadId, proposerId, contractAmount, projectContent, completionDate } = input;

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

        // 提案者がスレッドの参加者であることを確認
        if (thread.ordererId !== proposerId && thread.casterId !== proposerId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "この条件を提示する権限がありません",
          });
        }

        // 契約条件提示を作成
        const proposal = await ctx.prisma.contractProposal.create({
          data: {
            threadId,
            proposerId,
            contractAmount,
            projectContent,
            completionDate: new Date(completionDate),
          },
        });

        // スレッドのステータスをnegotiationに更新
        await ctx.prisma.messageThread.update({
          where: { id: threadId },
          data: { 
            status: "negotiation",
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          proposal,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("契約条件提示作成エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "契約条件提示作成中にエラーが発生しました",
        });
      }
    }),

  /**
   * スレッドの契約条件提示一覧を取得
   */
  getContractProposals: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { threadId, userId } = input;

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

        // ユーザーがスレッドの参加者であることを確認
        if (thread.ordererId !== userId && thread.casterId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "このスレッドにアクセスする権限がありません",
          });
        }

        // 契約条件提示一覧を取得
        const proposals = await ctx.prisma.contractProposal.findMany({
          where: { threadId },
          include: {
            proposer: {
              select: {
                id: true,
                email: true,
                casterProfile: {
                  select: {
                    fullName: true,
                  },
                },
                ordererProfile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return proposals;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("契約条件提示一覧取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "契約条件提示一覧取得中にエラーが発生しました",
        });
      }
    }),

  /**
   * 契約条件提示に合意
   */
  agreeToProposal: publicProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { proposalId, userId } = input;

      try {
        // 提案の存在確認
        const proposal = await ctx.prisma.contractProposal.findUnique({
          where: { id: proposalId },
          include: {
            thread: true,
          },
        });

        if (!proposal) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "契約条件提示が見つかりません",
          });
        }

        // ユーザーがスレッドの参加者であることを確認
        if (proposal.thread.ordererId !== userId && proposal.thread.casterId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "この条件に合意する権限がありません",
          });
        }

        // 自分自身の提案には合意できない
        if (proposal.proposerId === userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "自分自身の提案には合意できません",
          });
        }

        // 既に合意済みの場合はエラー
        if (proposal.isAgreed) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "この提案は既に合意済みです",
          });
        }

        // 合意を記録
        const updatedProposal = await ctx.prisma.contractProposal.update({
          where: { id: proposalId },
          data: {
            isAgreed: true,
            agreedAt: new Date(),
            agreedBy: userId,
          },
        });

        // スレッドのステータスをagreedに更新
        await ctx.prisma.messageThread.update({
          where: { id: proposal.threadId },
          data: { 
            status: "agreed",
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          proposal: updatedProposal,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("契約条件合意エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "契約条件合意中にエラーが発生しました",
        });
      }
    }),

  /**
   * ユーザーのメッセージスレッド一覧取得（ステータスフィルタリング対応）
   */
  getThreadsByStatus: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        status: z.enum(["all", "scout", "negotiation", "agreed"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId, status } = input;

      try {
        const whereCondition = {
          OR: [
            { ordererId: userId },
            { casterId: userId },
          ],
          ...(status && status !== "all" ? { status } : {}),
        };

        const threads = await ctx.prisma.messageThread.findMany({
          where: whereCondition,
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
            contractProposals: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
          orderBy: {
            createdAt: "desc",
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

  /**
   * 途中中断リクエスト送信
   */
  requestCancellation: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid(),
        userId: z.string().uuid(),
        reason: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { threadId, userId, reason } = input;

      try {
        const thread = await ctx.prisma.messageThread.findUnique({
          where: { id: threadId },
        });

        if (!thread) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "スレッドが見つかりません",
          });
        }

        if (thread.ordererId !== userId && thread.casterId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "このスレッドへのアクセス権限がありません",
          });
        }

        if (thread.status !== "contract") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "契約ステータスでない場合は中断リクエストを送信できません",
          });
        }

        const isCaster = thread.casterId === userId;
        const newStatus = isCaster ? "CasterCancelRequesting" : "OrderCancelRequesting";

        const updatedThread = await ctx.prisma.messageThread.update({
          where: { id: threadId },
          data: {
            status: newStatus,
            cancellationReason: reason,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          thread: updatedThread,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("途中中断リクエストエラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "途中中断リクエスト送信中にエラーが発生しました",
        });
      }
    }),

  /**
   * 途中中断リクエストに同意
   */
  agreeToCancellation: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { threadId, userId } = input;

      try {
        const thread = await ctx.prisma.messageThread.findUnique({
          where: { id: threadId },
        });

        if (!thread) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "スレッドが見つかりません",
          });
        }

        if (thread.ordererId !== userId && thread.casterId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "このスレッドへのアクセス権限がありません",
          });
        }

        if (thread.status !== "CasterCancelRequesting" && thread.status !== "OrderCancelRequesting") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "途中中断リクエスト中でない場合は同意できません",
          });
        }

        const isCaster = thread.casterId === userId;
        const isCasterRequesting = thread.status === "CasterCancelRequesting";
        const isOrderRequesting = thread.status === "OrderCancelRequesting";

        if ((isCaster && isCasterRequesting) || (!isCaster && isOrderRequesting)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "自分が送信したリクエストには同意できません",
          });
        }

        const updatedThread = await ctx.prisma.messageThread.update({
          where: { id: threadId },
          data: {
            status: "cancelled",
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          thread: updatedThread,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("途中中断同意エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "途中中断同意中にエラーが発生しました",
        });
      }
    }),

  /**
   * 契約一覧取得（contract, CasterCancelRequesting, OrderCancelRequesting, DeliveredAndReviewing, completedステータスのみ）
   */
  getContractThreads: publicProcedure
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
            status: {
              in: ["contract", "CasterCancelRequesting", "OrderCancelRequesting", "DeliveredAndReviewing", "completed"],
            },
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
            contractProposals: {
              where: {
                isAgreed: true,
              },
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
        console.error("契約一覧取得エラー:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "契約一覧取得中にエラーが発生しました",
        });
      }
    }),
});


