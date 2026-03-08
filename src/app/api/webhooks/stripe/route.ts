/**
 * Stripe Webhookエンドポイント
 * 決済完了時にStripeから通知を受け取り、OrderPaymentのステータスを更新する
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

// 環境変数の検証
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !webhookSecret) {
  throw new Error("Stripe環境変数が設定されていません");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-01-28.clover",
});

/**
 * StripeのIPアドレス範囲（本番環境での追加セキュリティチェック用）
 * 参考: https://stripe.com/docs/ips
 */
const STRIPE_IP_RANGES = [
  "54.187.174.169",
  "54.187.205.235",
  "54.187.216.72",
  "54.241.31.99",
  "54.241.31.102",
  "54.241.34.107",
];

/**
 * IPアドレスがStripeのものかチェック（本番環境のみ）
 * 注意: Vercelなどのプロキシ経由の場合、このチェックは正確でない可能性があります
 */
function isStripeIp(ip: string | null): boolean {
  if (!ip || process.env.NODE_ENV !== "production") {
    return true; // 開発環境ではスキップ
  }

  return STRIPE_IP_RANGES.some((range) => ip.startsWith(range));
}

export async function POST(req: NextRequest) {
  try {
    // 環境変数の再確認
    if (!webhookSecret) {
      console.error("Stripe Webhook Secretが設定されていません");
      return NextResponse.json(
        { error: "Configuration error" },
        { status: 500 }
      );
    }

    // IPアドレスのチェック（本番環境のみ）
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwarded?.split(",")[0]?.trim() || realIp || null;

    if (!isStripeIp(clientIp)) {
      console.warn(`⚠️  Suspicious webhook request from IP: ${clientIp}`);
      // 本番環境ではIPチェックに失敗した場合も署名検証で弾かれるため、警告のみ
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Stripe署名がありません");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Webhookイベントを検証
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Stripe署名検証エラー:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // イベントタイプのログ（本番環境では簡潔に）
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      console.log(`Webhook: ${event.type} (${event.id})`);
    } else {
      console.log("Webhook event received:", event.type, event.id);
    }

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
    const isProduction = process.env.NODE_ENV === "production";
    
    // エラーログ（本番環境では詳細を制限）
    if (isProduction) {
      console.error("Webhook error:", error instanceof Error ? error.message : "Unknown error");
    } else {
      console.error("Webhook error:", error);
    }
    
    // クライアントには詳細なエラー情報を返さない（セキュリティ）
    if (error instanceof Error && error.message.includes("signature")) {
      return NextResponse.json(
        { error: "Invalid signature" },
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
