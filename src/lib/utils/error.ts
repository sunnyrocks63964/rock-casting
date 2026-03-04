/**
 * エラーメッセージ抽出ユーティリティ
 * tRPCやAPI呼び出しで発生するエラーから、ユーザーに表示するメッセージを抽出
 */

/**
 * エラーメッセージを抽出する関数
 * tRPCのエラーやZodバリデーションエラーから、適切なメッセージを取得
 * 
 * @param error - エラーオブジェクト（unknown型）
 * @returns ユーザーに表示するエラーメッセージ文字列
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    const message = String(error.message);
    
    // JSON配列形式のエラーメッセージをパース（フォールバック）
    try {
      const parsed = JSON.parse(message);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstError = parsed[0];
        if (firstError && typeof firstError === "object" && "message" in firstError) {
          return String(firstError.message);
        }
      }
    } catch {
      // JSONパースに失敗した場合はそのまま使用
    }
    
    return message;
  }
  
  return "エラーが発生しました";
};
