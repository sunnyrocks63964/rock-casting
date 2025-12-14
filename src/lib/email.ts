/**
 * メール送信ユーティリティ
 * Resendを使用してメールを送信
 */

import { Resend } from "resend";
import { getPasswordResetEmailTemplate } from "@/lib/email/templates/passwordReset";

// Resendクライアントの初期化
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error("RESEND_API_KEY が設定されていません");
  }
  
  return new Resend(apiKey);
};

/**
 * パスワードリセットメールを送信
 */
export const sendPasswordResetEmail = async ({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}) => {
  const resend = getResendClient();
    
  // テンプレートからHTMLを取得
  const htmlContent = getPasswordResetEmailTemplate(resetLink);

  const { data, error } = await resend.emails.send({
    from: `株式会社SUNNY ROCKS <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "パスワード再設定のご案内",
    html: htmlContent,
  });

  if (error) {
    console.error("メール送信エラー:", error);
    throw new Error(`メール送信に失敗しました: ${error.message}`);
  }

  return data;
};

