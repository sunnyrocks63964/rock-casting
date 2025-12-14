/**
 * パスワードリセットメールのテンプレート
 */

export const getPasswordResetEmailTemplate = (resetLink: string): string => {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>パスワード再設定のご案内</title>
</head>
<body style="font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- ヘッダー -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #d70202;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #d70202;">
                パスワード再設定のご案内
              </h1>
            </td>
          </tr>
          
          <!-- 本文 -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                いつも株式会社SUNNY ROCKSをご利用いただき、誠にありがとうございます。
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                パスワード再設定のリクエストを受け付けました。<br>
                以下のボタンをクリックして、新しいパスワードを設定してください。
              </p>
              
              <!-- ボタン -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 15px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background-color: #d70202; color: #ffffff; text-decoration: none; border-radius: 90px; font-size: 18px; font-weight: 700; text-align: center;">
                      パスワードを再設定する
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px; font-size: 14px; color: #666666;">
                ボタンがクリックできない場合は、以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてください。
              </p>
              
              <p style="margin: 0 0 30px; padding: 15px; background-color: #f5f5f5; border-radius: 4px; word-break: break-all; font-size: 14px; color: #333333;">
                ${resetLink}
              </p>
              
              <p style="margin: 0 0 20px; font-size: 14px; color: #666666;">
                ※このリンクは24時間有効です。<br>
                ※このメールに心当たりがない場合は、お手数ですがメールを削除してください。
              </p>
              
              <p style="margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666666;">
                ご不明な点がございましたら、以下のリンクからお問い合わせください。<br>
                <a href="https://sunnyrocks32169.com/contact/" style="color: #0800f9; text-decoration: underline;">https://sunnyrocks32169.com/contact/</a>
              </p>
            </td>
          </tr>
          
          <!-- フッター -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999999;">
                株式会社SUNNY ROCKS<br>
                © SUNNY ROCKS Inc. All Rights Reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

