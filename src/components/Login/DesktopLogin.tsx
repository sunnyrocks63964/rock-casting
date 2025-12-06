"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function DesktopLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isHoveringButton, setIsHoveringButton] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // tRPC mutation
    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: () => {
            // ログイン成功時に/topページに遷移
            router.push("/top");
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(64px, 8vw, 128px) 16px",
            }}
        >
            {/* タイトル */}
            <h1
                style={{
                    fontFamily: "'RocknRoll One', sans-serif",
                    fontSize: "clamp(40px, 4vw, 55px)",
                    fontWeight: "400",
                    lineHeight: "normal",
                    color: "white",
                    textAlign: "center",
                    marginBottom: "16px",
                }}
            >
                Login
            </h1>

            <p
                style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "20px",
                    fontWeight: "400",
                    lineHeight: "normal",
                    color: "white",
                    textAlign: "center",
                    marginBottom: "48px",
                }}
            >
                ログイン
            </p>

            {/* ログインフォーム */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    padding: "clamp(40px, 5vw, 70px) clamp(80px, 10vw, 100px)",
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {/* メールアドレス */}
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            marginBottom: "48px",
                        }}
                    >
                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "black",
                                textAlign: "left",
                                marginBottom: "8px",
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
                                height: "36px",
                                padding: "0 16px",
                                borderRadius: "30px",
                                border: "1px solid black",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "black",
                                outline: "none",
                            }}
                            required
                        />
                    </div>

                    {/* パスワード */}
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            marginBottom: "8px",
                        }}
                    >
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "black",
                                textAlign: "left",
                                marginBottom: "8px",
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
                                height: "36px",
                                padding: "0 16px",
                                borderRadius: "30px",
                                border: "1px solid black",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "black",
                                outline: "none",
                            }}
                            required
                        />
                    </div>

                    {/* パスワード忘れリンク */}
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            textAlign: "right",
                            marginBottom: errorMessage ? "16px" : "64px",
                        }}
                    >
                        <a
                            href="/reset-password"
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "14px",
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
                                width: "100%",
                                maxWidth: "600px",
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
                                    fontSize: "14px",
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
                            maxWidth: "402px",
                            height: "74px",
                            borderRadius: "90px",
                            backgroundColor: !isFormValid || loginMutation.isPending
                                ? "#fca5a5"
                                : isHoveringButton
                                ? "#b00101"
                                : "#d70202",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "24px",
                            fontWeight: "700",
                            border: "none",
                            cursor: isFormValid && !loginMutation.isPending ? "pointer" : "not-allowed",
                            marginBottom: "24px",
                            transition: "background-color 0.3s ease",
                            opacity: isFormValid && !loginMutation.isPending ? 1 : 0.6,
                        }}
                    >
                        {loginMutation.isPending ? "ログイン中..." : "ログイン"}
                    </button>

                    {/* 新規登録リンク */}
                    <a
                        href="/user_register"
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#0800f9",
                            textDecoration: "none",
                            textAlign: "center",
                        }}
                    >
                        新規登録はこちら
                    </a>
                </form>
            </div>
        </div>
    );
}

