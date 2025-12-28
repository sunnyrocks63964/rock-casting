"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DesktopPasswordResetConfirm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // フォームの状態
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // URLフラグメントからトークンを取得してセッションを確立
  useEffect(() => {
    const handleRecoveryToken = async () => {
      try {
        // URLフラグメントからトークンを取得
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (type === "recovery" && accessToken) {
          // リカバリートークンからセッションを確立
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get("refresh_token") || "",
          });

          if (error) {
            console.error("セッション確立エラー:", error);
            setIsTokenValid(false);
            setErrorMessage("パスワードリセットトークンが無効または期限切れです");
            return;
          }

          if (data.session) {
            setIsTokenValid(true);
            // フラグメントをクリア
            window.history.replaceState(null, "", window.location.pathname);
          }
        } else {
          // 既にセッションがあるか確認
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsTokenValid(true);
          } else {
            setIsTokenValid(false);
            setErrorMessage("パスワードリセットリンクが無効です");
          }
        }
      } catch (error) {
        console.error("トークン処理エラー:", error);
        setIsTokenValid(false);
        setErrorMessage("パスワードリセットリンクの処理に失敗しました");
      }
    };

    handleRecoveryToken();
  }, []);

  // フォームのバリデーション
  useEffect(() => {
    const isValid =
      password.trim() !== "" &&
      passwordConfirm.trim() !== "" &&
      password === passwordConfirm &&
      password.length >= 8 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
    
    setIsFormValid(isValid);
  }, [password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || isLoading || !isTokenValid) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // パスワードを更新
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("パスワード更新エラー:", updateError);
        setErrorMessage("パスワードの更新に失敗しました");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("パスワードを正常に更新しました");
      
      // 3秒後にログインページにリダイレクト
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("パスワード更新エラー:", error);
      setErrorMessage("パスワードの更新に失敗しました");
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <main
        style={{
          paddingTop: "120px",
          paddingBottom: "80px",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "120px 20px 80px",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <p style={{ fontFamily: "Noto Sans JP", fontSize: "16px" }}>
            トークンを確認中...
          </p>
        </div>
      </main>
    );
  }

  if (isTokenValid === false) {
    return (
      <main
        style={{
          paddingTop: "120px",
          paddingBottom: "80px",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "120px 20px 80px",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <p style={{ fontFamily: "Noto Sans JP", fontSize: "16px", color: "#dc2626" }}>
            {errorMessage || "パスワードリセットリンクが無効です"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "120px 20px 80px",
      }}
    >
      {/* ページタイトル */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "48px",
            fontWeight: "normal",
            color: "white",
            marginBottom: "10px",
          }}
        >
          Reset password
        </h1>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "20px",
            color: "white",
          }}
        >
          パスワード再設定
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* パスワード設定セクション */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            padding: "60px",
            marginBottom: "40px",
          }}
        >
          {/* パスワード */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
              }}
            >
              パスワード <span style={{ color: "#dc2626" }}>（必須）</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力してください"
              style={{
                width: "100%",
                padding: "15px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "30px",
                fontSize: "16px",
                fontFamily: "Noto Sans JP",
                outline: "none",
              }}
            />
            <p
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                color: "#666666",
                marginTop: "5px",
                marginBottom: "0",
              }}
            >
              8文字以上、大文字・小文字・数字を含む必要があります
            </p>
          </div>

          {/* パスワード（確認用） */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
              }}
            >
              パスワード（確認用） <span style={{ color: "#dc2626" }}>（必須）</span>
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="もう一度パスワードを入力してください"
              style={{
                width: "100%",
                padding: "15px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "30px",
                fontSize: "16px",
                fontFamily: "Noto Sans JP",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px 20px",
              backgroundColor: "#fee2e2",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                color: "#dc2626",
                margin: "0",
              }}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {/* 成功メッセージ */}
        {successMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px 20px",
              backgroundColor: "#dcfce7",
              border: "1px solid #22c55e",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                color: "#16a34a",
                margin: "0",
              }}
            >
              {successMessage}
            </p>
          </div>
        )}

        {/* 送信ボタン */}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            style={{
              backgroundColor: isFormValid && !isLoading ? "#dc2626" : "#fca5a5",
              color: "white",
              padding: "20px 60px",
              borderRadius: "90px",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Noto Sans JP",
              border: "none",
              cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              opacity: isFormValid && !isLoading ? 1 : 0.6,
            }}
          >
            {isLoading ? "更新中..." : "パスワードを更新"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default DesktopPasswordResetConfirm;

