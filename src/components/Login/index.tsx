"use client";

import React, { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isHoveringButton, setIsHoveringButton] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: ログイン処理を実装
        console.log("Login attempt with:", { email, password });
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
                            marginBottom: "64px",
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

                    {/* ログインボタン */}
                    <button
                        type="submit"
                        onMouseEnter={() => setIsHoveringButton(true)}
                        onMouseLeave={() => setIsHoveringButton(false)}
                        style={{
                            width: "100%",
                            maxWidth: "402px",
                            height: "74px",
                            borderRadius: "90px",
                            backgroundColor: isHoveringButton ? "#b00101" : "#d70202",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "24px",
                            fontWeight: "700",
                            border: "none",
                            cursor: "pointer",
                            marginBottom: "24px",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        ログイン
                    </button>

                    {/* 新規登録リンク */}
                    <a
                        href="/register"
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

