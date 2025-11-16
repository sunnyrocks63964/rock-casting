"use client";

import React, { useState, useEffect } from "react";

export default function MobileResetPassword() {
    const [email, setEmail] = useState("");
    const [isHoveringButton, setIsHoveringButton] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                backgroundColor: "#060606",
                minHeight: "100vh",
                position: "relative",
                paddingBottom: "60px",
            }}
        >
            {/* ヘッダー */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px 16px",
                }}
            >
                <p
                    style={{
                        fontFamily: "'RocknRoll One', sans-serif",
                        fontSize: "12px",
                        color: "white",
                        margin: 0,
                    }}
                >
                    ROCK CASTING
                </p>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "6px",
                        padding: 0,
                    }}
                >
                    <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
                    <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
                    <div style={{ width: "24px", height: "2px", backgroundColor: "black" }} />
                </button>
            </div>

            {/* メインコンテンツ */}
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
                    Reset password
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
                    パスワードを再設定
                </p>

                {/* リセットフォーム */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "30px",
                        padding: "31px 24px 36px",
                    }}
                >
                    {/* 説明テキスト */}
                    <p
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "12px",
                            fontWeight: "400",
                            color: "black",
                            textAlign: "center",
                            margin: "0 0 38px 0",
                            lineHeight: "normal",
                        }}
                    >
                        ご登録メールアドレス宛てに、新規パスワードを発行するためのリンクをメールでお送りします。
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* メールアドレス */}
                        <div style={{ marginBottom: "33px" }}>
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

                        {/* 送信ボタン */}
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            onMouseEnter={() => setIsHoveringButton(true)}
                            onMouseLeave={() => setIsHoveringButton(false)}
                            style={{
                                width: "100%",
                                height: "38px",
                                borderRadius: "90px",
                                backgroundColor: !isFormValid
                                    ? "#e99797"
                                    : isHoveringButton
                                    ? "#b00101"
                                    : "#d70202",
                                color: "white",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "14px",
                                fontWeight: "700",
                                border: "none",
                                cursor: isFormValid ? "pointer" : "not-allowed",
                                marginBottom: "18px",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            再設定メールを送信
                        </button>

                        {/* 新規登録リンク */}
                        <div style={{ textAlign: "center" }}>
                            <a
                                href="/user_register"
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

            {/* フッター */}
            <footer
                style={{
                    backgroundColor: "#3f3f3f",
                    padding: "80px 40px 28px",
                    marginTop: "30px",
                }}
            >
                <p
                    style={{
                        fontFamily: "'RocknRoll One', sans-serif",
                        fontSize: "18px",
                        color: "white",
                        textAlign: "center",
                        margin: "0 0 50px 0",
                    }}
                >
                    ROCK CASTING
                </p>

                {/* サービスメニュー */}
                <div style={{ marginBottom: "36px" }}>
                    <p
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "white",
                            margin: "0 0 12px 0",
                        }}
                    >
                        サービス
                    </p>
                    <div
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "11px",
                            fontWeight: "400",
                            color: "white",
                            lineHeight: "1.8",
                        }}
                    >
                        <p style={{ margin: 0 }}>トップページ</p>
                        <p style={{ margin: 0 }}>料金</p>
                        <p style={{ margin: 0 }}>キャスト一覧</p>
                        <p style={{ margin: 0 }}>仕事を受ける</p>
                        <p style={{ margin: 0 }}>仕事を依頼する</p>
                        <p style={{ margin: 0 }}>会員登録</p>
                        <p style={{ margin: 0 }}>ログイン</p>
                        <p style={{ margin: 0 }}>パスワード再設定</p>
                    </div>
                </div>

                {/* 規約メニュー */}
                <div style={{ marginBottom: "44px" }}>
                    <p
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "white",
                            margin: "0 0 12px 0",
                        }}
                    >
                        規約・運営・その他
                    </p>
                    <div
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "11px",
                            fontWeight: "400",
                            color: "white",
                            lineHeight: "1.8",
                        }}
                    >
                        <p style={{ margin: 0 }}>利用規約</p>
                        <p style={{ margin: 0 }}>商標・特許</p>
                        <p style={{ margin: 0 }}>プライバシーポリシー</p>
                        <p style={{ margin: 0 }}>情報セキュリティーポリシー</p>
                        <p style={{ margin: 0 }}>外部送信規律に関する公表事項</p>
                        <p style={{ margin: 0 }}>特定商取引法に基づく表示</p>
                        <p style={{ margin: 0 }}>企業情報</p>
                        <p style={{ margin: 0 }}>サービス利用環境</p>
                    </div>
                </div>

                {/* ボタン */}
                <div style={{ marginBottom: "12px" }}>
                    <button
                        style={{
                            width: "100%",
                            height: "38px",
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "90px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "black",
                            cursor: "pointer",
                        }}
                    >
                        お問い合わせはこちら
                    </button>
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <button
                        style={{
                            width: "100%",
                            height: "38px",
                            backgroundColor: "#ff6d00",
                            border: "none",
                            borderRadius: "90px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        ヘルプ・ご利用ガイド
                    </button>
                </div>

                {/* コピーライト */}
                <p
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "10px",
                        color: "white",
                        textAlign: "center",
                        margin: 0,
                    }}
                >
                    <span style={{ fontWeight: "700" }}>© 2025 </span>
                    <span style={{ fontWeight: "400" }}>ROCK CASTING</span>
                </p>
            </footer>
        </div>
    );
}

