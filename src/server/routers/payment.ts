/**
 * 決済関連のtRPC Router
 * Stripe Checkoutセッションの作成、決済ステータスの管理
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import Stripe from "stripe";

// Stripeクライアントの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

export const paymentRouter = createTRPCRouter({
  /**
   * Stripe Checkoutセッションを作成
   * 発注者が「決済を行い契約を行う」ボタンを押したときに呼ばれる
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        contractProposalId: z.string().uuid(),
        threadId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { contractProposalId, threadId, userId } = input;

      try {
        // 契約提案を取得
        const contractProposal = await ctx.prisma.contractProposal.findUnique({
          where: { id: contractProposalId },
          include: {
            thread: {
              include: {
                orderer: {
                  include: {
                    ordererProfile: true,
                    casterProfile: true,
                  },
                },
                caster: {
                  include: {
                    ordererProfile: true,
                    casterProfile: true,
                  },
                },
              },
            },
          },
        });

        if (!contractProposal) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "契約提案が見つかりません",
          });
        }

        // ユーザーが発注者であることを確認
        if (contractProposal.thread.ordererId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "この操作は発注者のみが実行できます",
          });
        }

        // 契約提案が合意済みであることを確認
        if (!contractProposal.isAgreed) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "契約提案が合意状態ではありません",
          });
        }

        // 既存の決済レコードがあるか確認
        const existingPayment = await ctx.prisma.orderPayment.findFirst({
          where: {
            contractProposalId,
            status: { in: ["pending", "paid"] },
          },
        });

        // 既に決済が完了している場合はエラー
        if (existingPayment?.status === "paid") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "既に決済が完了しています",
          });
        }

        // pending状態で既存のCheckoutセッションがある場合、そのセッションのURLを返す
        if (existingPayment?.status === "pending" && existingPayment.stripeCheckoutSessionId) {
          try {
            // Stripe APIでセッションの状態を確認
            const existingSession = await stripe.checkout.sessions.retrieve(
              existingPayment.stripeCheckoutSessionId
            );

            // セッションが未完了（open）の場合、既存のURLを返す
            if (existingSession.status === "open") {
              return {
                success: true,
                checkoutUrl: existingSession.url,
                sessionId: existingSession.id,
              };
            }

            // セッションが完了または期限切れの場合、新しいセッションを作成
            // （既存のOrderPaymentをそのまま使用）
          } catch (error) {
            console.error("既存セッションの取得エラー:", error);
            // エラーが発生した場合も新しいセッションを作成
          }
        }

        // 金額計算
        const totalAmount = contractProposal.contractAmount;
        const platformFee = Math.floor(totalAmount * 0.2); // 20%の手数料
        const casterAmount = totalAmount - platformFee; // 80%を受注者へ

        // OrderPaymentレコードを取得または作成
        const orderPayment = existingPayment?.status === "pending"
          ? existingPayment
          : await ctx.prisma.orderPayment.create({
              data: {
                contractProposalId,
                threadId,
                ordererId: contractProposal.thread.ordererId,
                casterId: contractProposal.thread.casterId,
                totalAmount,
                platformFee,
                casterAmount,
                status: "pending",
              },
            });

        // 受注者の名前を取得
        const casterName = 
          contractProposal.thread.caster.casterProfile?.fullName || 
          contractProposal.thread.caster.ordererProfile?.fullName || 
          "受注者";

        // Stripe Checkoutセッションを作成
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "jpy",
                product_data: {
                  name: "契約金額（仮払い）",
                  description: `受注者: ${casterName}`,
                },
                unit_amount: totalAmount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/message/${threadId}?payment=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/message/${threadId}?payment=cancelled`,
          metadata: {
            orderPaymentId: orderPayment.id,
            contractProposalId,
            threadId,
            ordererId: contractProposal.thread.ordererId,
            casterId: contractProposal.thread.casterId,
          },
        });

        // CheckoutセッションIDをOrderPaymentに保存
        await ctx.prisma.orderPayment.update({
          where: { id: orderPayment.id },
          data: {
            stripeCheckoutSessionId: session.id,
          },
        });

        return {
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("Checkout session creation error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "決済セッションの作成に失敗しました",
        });
      }
    }),

  /**
   * 決済ステータスを確認
   */
  getPaymentStatus: publicProcedure
    .input(
      z.object({
        contractProposalId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { contractProposalId } = input;

      const orderPayment = await ctx.prisma.orderPayment.findFirst({
        where: { contractProposalId },
        include: {
          casterPayout: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (!orderPayment) {
        return {
          exists: false,
          status: null,
          totalAmount: null,
          paidAt: null,
          casterPayoutStatus: null,
        };
      }

      return {
        exists: true,
        status: orderPayment.status,
        totalAmount: orderPayment.totalAmount,
        paidAt: orderPayment.paidAt,
        casterPayoutStatus: orderPayment.casterPayout?.status || null,
      };
    }),

  /**
   * 納品を行う（Casterが納品完了を報告）
   */
  markAsDelivered: publicProcedure
    .input(
      z.object({
        contractProposalId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { contractProposalId, userId } = input;

      try {
        // OrderPaymentを取得
        const orderPayment = await ctx.prisma.orderPayment.findFirst({
          where: { contractProposalId },
          include: {
            thread: true,
          },
          orderBy: { createdAt: "desc" },
        });

        if (!orderPayment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "決済情報が見つかりません",
          });
        }

        // ユーザーがCasterであることを確認
        if (orderPayment.casterId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "この操作は受注者のみが実行できます",
          });
        }

        // 決済が完了していることを確認
        if (orderPayment.status !== "paid") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "決済が完了していません",
          });
        }

        // CasterPayoutを取得
        const casterPayout = await ctx.prisma.casterPayout.findUnique({
          where: { orderPaymentId: orderPayment.id },
        });

        if (!casterPayout) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "送金情報が見つかりません",
          });
        }

        // 既に納品済みの場合はエラー
        if (casterPayout.status === "delivered" || casterPayout.status === "transferred") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "既に納品済みです",
          });
        }

        // 納品済みに更新
        await ctx.prisma.casterPayout.update({
          where: { id: casterPayout.id },
          data: {
            status: "delivered",
            deliveredAt: new Date(),
          },
        });

        // MessageThreadのステータスをDeliveredAndReviewingに更新
        await ctx.prisma.messageThread.update({
          where: { id: orderPayment.threadId },
          data: {
            status: "DeliveredAndReviewing",
          },
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error("Mark as delivered error:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "納品処理に失敗しました",
        });
      }
    }),

  /**
   * 検収完了（Orderが検収完了を報告）
   */
  completeReview: publicProcedure
    .input(
      z.object({
        contractProposalId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { contractProposalId, userId } = input;

      try {
        // OrderPaymentを取得
        const orderPayment = await ctx.prisma.orderPayment.findFirst({
          where: { contractProposalId },
          include: {
            thread: true,
          },
          orderBy: { createdAt: "desc" },
        });

        if (!orderPayment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "決済情報が見つかりません",
          });
        }

        // ユーザーがOrdererであることを確認
        if (orderPayment.ordererId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "この操作は発注者のみが実行できます",
          });
        }

        // ステータスがDeliveredAndReviewingであることを確認
        if (orderPayment.thread.status !== "DeliveredAndReviewing") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "検収可能な状態ではありません",
          });
        }

        // MessageThreadのステータスをcompletedに更新
        await ctx.prisma.messageThread.update({
          where: { id: orderPayment.threadId },
          data: {
            status: "completed",
          },
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error("Complete review error:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "検収処理に失敗しました",
        });
      }
    }),
});
