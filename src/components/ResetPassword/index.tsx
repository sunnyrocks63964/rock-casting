"use client";

import React, { useState, useEffect } from "react";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [isHoveringButton, setIsHoveringButton] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // フォームのバリデーション
    useEffect(() => {
        const isValid = email.trim() !== "";
        setIsFormValid(isValid);
    }, [email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: パスワードリセットメール送信処理を実装
        console.log("Password reset request for:", email);
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
                Reset password
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
                パスワードを再設定
            </p>

            {/* パスワードリセットフォーム */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    padding: "clamp(40px, 5vw, 70px) clamp(80px, 10vw, 100px)",
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                {/* 説明テキスト */}
                <p
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "black",
                        textAlign: "center",
                        marginBottom: "32px",
                        lineHeight: "1.6",
                    }}
                >
                    ご登録メールアドレス宛てに、
                    <br />
                    新規パスワードを発行するためのリンクをメールでお送りします。
                </p>

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
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "black",
                                outline: "none",
                            }}
                            required
                        />
                    </div>

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        onMouseEnter={() => setIsHoveringButton(true)}
                        onMouseLeave={() => setIsHoveringButton(false)}
                        style={{
                            width: "100%",
                            maxWidth: "402px",
                            height: "74px",
                            borderRadius: "90px",
                            backgroundColor: !isFormValid
                                ? "#fca5a5"
                                : isHoveringButton
                                ? "#b00101"
                                : "#d70202",
                            color: "white",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "24px",
                            fontWeight: "700",
                            border: "none",
                            cursor: isFormValid ? "pointer" : "not-allowed",
                            marginBottom: "24px",
                            transition: "background-color 0.3s ease",
                            opacity: isFormValid ? 1 : 0.6,
                        }}
                    >
                        再設定メールを送信
                    </button>

                    {/* 新規登録リンク */}
                    <a
                        href="/user_register"
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "16px",
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

