"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function MobileLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isHoveringButton, setIsHoveringButton] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // tRPC mutation
    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: async (data) => {
            // セッションをクライアント側のSupabaseクライアントに設定
            if (data.session) {
                try {
                    const { supabase } = await import("@/lib/supabase");
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token: data.session.access_token,
                        refresh_token: data.session.refresh_token,
                    });

                    if (sessionError) {
                        console.error("セッション設定エラー:", sessionError);
                        setErrorMessage("セッションの設定に失敗しました");
                        return;
                    }

                    // セッションが確実に設定されていることを確認
                    let retryCount = 0;
                    const maxRetries = 10;
                    const retryDelay = 100;

                    while (retryCount < maxRetries) {
                        const { data: { session: currentSession } } = await supabase.auth.getSession();
                        if (currentSession?.user) {
                            // セッションが設定されたことを確認
                            break;
                        }
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                    }

                    if (retryCount >= maxRetries) {
                        console.error("セッション設定の確認に失敗しました");
                        setErrorMessage("セッションの設定に失敗しました");
                        return;
                    }
                } catch (error) {
                    console.error("セッション設定エラー:", error);
                    setErrorMessage("セッションの設定に失敗しました");
                    return;
                }
            }

            // ログイン成功時にプロフィールに応じて遷移
            if (data.user.hasCasterProfile) {
                router.push("/top/caster");
            } else if (data.user.hasOrdererProfile) {
                router.push("/top/order");
            } else {
                router.push("/");
            }
        },
        onError: (error) => {
            // エラーメッセージを設定
            setErrorMessage(error.message || "ログインに失敗しました");
        },
    });

    // フォームのバリデーション
    useEffect(() => {
        const isValid = email.trim() !== "" && password.trim() !== "";
        setIsFormValid(isValid);
    }, [email, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // バリデーション
        if (!isFormValid || loginMutation.isPending) {
            return;
        }

        // エラーメッセージをクリア
        setErrorMessage(null);

        // ログインAPIを呼び出し
        try {
            await loginMutation.mutateAsync({
                email: email.trim(),
                password: password,
            });
        } catch (error) {
            // エラーはonErrorで処理されるため、ここでは何もしない
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#060606",
                minHeight: "100vh",
                position: "relative",
                paddingTop: "60px",
                paddingBottom: "60px",
            }}
        >
            {/* メインコンテンツ（ハンバーガーはページ共通の Header コンポーネントを使用） */}
            <div style={{ padding: "0 16px" }}>
                {/* タイトル */}
                <h1
                    style={{
                        fontFamily: "'RocknRoll One', sans-serif",
                        fontSize: "28px",
                        fontWeight: "400",
                        lineHeight: "normal",
                        color: "white",
                        textAlign: "center",
                        margin: "0 0 16px 0",
                    }}
                >
                    Login
                </h1>

                <p
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "normal",
                        color: "white",
                        textAlign: "center",
                        margin: "0 0 28px 0",
                    }}
                >
                    ログイン
                </p>

                {/* ログインフォーム */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "30px",
                        padding: "35px 24px 36px",
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* メールアドレス */}
                        <div style={{ marginBottom: "32px" }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "black",
                                    marginBottom: "8px",
                                    lineHeight: "30px",
                                }}
                            >
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="メールアドレスを入力してください"
                                style={{
                                    width: "100%",
                                    height: "46px",
                                    padding: "0 16px",
                                    borderRadius: "30px",
                                    border: "1px solid black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "black",
                                    outline: "none",
                                    backgroundColor: "white",
                                }}
                                required
                            />
                        </div>

                        {/* パスワード */}
                        <div style={{ marginBottom: "8px" }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "black",
                                    marginBottom: "8px",
                                    lineHeight: "30px",
                                }}
                            >
                                パスワード
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワードを入力してください"
                                style={{
                                    width: "100%",
                                    height: "46px",
                                    padding: "0 16px",
                                    borderRadius: "30px",
                                    border: "1px solid black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "black",
                                    outline: "none",
                                    backgroundColor: "white",
                                }}
                                required
                            />
                        </div>

                        {/* パスワード忘れリンク */}
                        <div
                            style={{
                                textAlign: "right",
                                marginBottom: errorMessage ? "16px" : "47px",
                            }}
                        >
                            <a
                                href="/reset-password"
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "#0800f9",
                                    textDecoration: "none",
                                    display: "inline-block",
                                }}
                            >
                                パスワードを忘れた方はこちら
                            </a>
                        </div>

                        {/* エラーメッセージ */}
                        {errorMessage && (
                            <div
                                style={{
                                    marginBottom: "24px",
                                    padding: "12px 16px",
                                    backgroundColor: "#fee2e2",
                                    border: "1px solid #ef4444",
                                    borderRadius: "8px",
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        fontSize: "12px",
                                        fontWeight: "400",
                                        color: "#dc2626",
                                        margin: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    {errorMessage}
                                </p>
                            </div>
                        )}

                        {/* ログインボタン */}
                        <button
                            type="submit"
                            disabled={!isFormValid || loginMutation.isPending}
                            onMouseEnter={() => setIsHoveringButton(true)}
                            onMouseLeave={() => setIsHoveringButton(false)}
                            style={{
                                width: "100%",
                                height: "38px",
                                borderRadius: "90px",
                                backgroundColor: !isFormValid || loginMutation.isPending
                                    ? "#e99797"
                                    : isHoveringButton
                                    ? "#b00101"
                                    : "#d70202",
                                color: "white",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "14px",
                                fontWeight: "700",
                                border: "none",
                                cursor: isFormValid && !loginMutation.isPending ? "pointer" : "not-allowed",
                                marginBottom: "18px",
                                transition: "background-color 0.3s ease",
                                opacity: isFormValid && !loginMutation.isPending ? 1 : 0.6,
                            }}
                        >
                            {loginMutation.isPending ? "ログイン中..." : "ログイン"}
                        </button>

                        {/* 新規登録リンク */}
                        <div style={{ textAlign: "center" }}>
                            <a
                                href="/interview_schedule"
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "#0800f9",
                                    textDecoration: "none",
                                }}
                            >
                                新規登録はこちら
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

