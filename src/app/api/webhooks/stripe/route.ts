/**
 * Stripe Webhookエンドポイント
 * 決済完了時にStripeから通知を受け取り、OrderPaymentのステータスを更新する
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Stripe署名がありません");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Webhookイベントを検証
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log("Webhook event received:", event.type);

    // イベントタイプに応じて処理
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Checkout Sessionが完了したときの処理
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout session completed:", session.id);

  const metadata = session.metadata;
  if (!metadata?.orderPaymentId) {
    console.error("OrderPaymentId not found in metadata");
    return;
  }

  const orderPaymentId = metadata.orderPaymentId;

  // OrderPaymentを更新
  const orderPayment = await prisma.orderPayment.findUnique({
    where: { id: orderPaymentId },
  });

  if (!orderPayment) {
    console.error("OrderPayment not found:", orderPaymentId);
    return;
  }

  // PaymentIntentIDを保存
  await prisma.orderPayment.update({
    where: { id: orderPaymentId },
    data: {
      stripePaymentIntentId: session.payment_intent as string,
      status: "paid",
      paidAt: new Date(),
    },
  });

  // MessageThreadのステータスを「contract」に更新
  await prisma.messageThread.update({
    where: { id: orderPayment.threadId },
    data: {
      status: "contract",
    },
  });

  // CasterPayoutレコードを作成（納品待ち状態）
  await prisma.casterPayout.create({
    data: {
      orderPaymentId: orderPayment.id,
      casterId: orderPayment.casterId,
      amount: orderPayment.casterAmount,
      status: "pending",
    },
  });

  console.log("Payment completed successfully:", orderPaymentId);
}

/**
 * PaymentIntentが成功したときの処理
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("PaymentIntent succeeded:", paymentIntent.id);

  // PaymentIntentIDでOrderPaymentを検索
  const orderPayment = await prisma.orderPayment.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!orderPayment) {
    console.log("OrderPayment not found for PaymentIntent:", paymentIntent.id);
    return;
  }

  // 既にpaid状態であればスキップ
  if (orderPayment.status === "paid") {
    console.log("OrderPayment already paid:", orderPayment.id);
    return;
  }

  // ステータスを更新
  await prisma.orderPayment.update({
    where: { id: orderPayment.id },
    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  console.log("OrderPayment updated to paid:", orderPayment.id);
}

/**
 * PaymentIntentが失敗したときの処理
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("PaymentIntent failed:", paymentIntent.id);

  // PaymentIntentIDでOrderPaymentを検索
  const orderPayment = await prisma.orderPayment.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!orderPayment) {
    console.log("OrderPayment not found for PaymentIntent:", paymentIntent.id);
    return;
  }

  // ステータスをcancelledに更新
  await prisma.orderPayment.update({
    where: { id: orderPayment.id },
    data: {
      status: "cancelled",
    },
  });

  console.log("OrderPayment cancelled:", orderPayment.id);
}
