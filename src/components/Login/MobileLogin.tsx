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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                router.push("/top");
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

