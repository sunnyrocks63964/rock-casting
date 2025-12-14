"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderTopPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 認証チェック
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Supabaseセッションを確認
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session?.user) {
                    // セッションがない場合はログインページにリダイレクト
                    router.push("/login");
                    return;
                }

                setUserId(session.user.id);
            } catch (error) {
                console.error("認証チェックエラー:", error);
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);

    // ユーザー情報が取得できたら、orderer_profileを持っているかチェック
    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        if (!userData) {
            // ユーザー情報が取得できない場合はログインページにリダイレクト
            router.push("/login");
            return;
        }

        if (!userData.hasOrdererProfile) {
            // orderer_profileを持っていない場合はトップページにリダイレクト
            router.push("/top");
            return;
        }

        // 認証成功
        setIsAuthorized(true);
        setIsLoading(false);
    }, [userData, isLoadingUser, router]);

    // ローディング中または認証チェック中
    if (isLoading || !isAuthorized) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#060606",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "16px",
                        color: "white",
                    }}
                >
                    読み込み中...
                </div>
            </main>
        );
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#060606",
                color: "white",
            }}
        >
            <Header />
            <div
                style={{
                    paddingTop: "80px",
                    paddingBottom: "60px",
                    paddingLeft: "clamp(16px, 4vw, 60px)",
                    paddingRight: "clamp(16px, 4vw, 60px)",
                }}
            >
                {/* ページタイトル */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "clamp(40px, 6vw, 80px)",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "'RocknRoll One', sans-serif",
                            fontSize: "clamp(32px, 4vw, 48px)",
                            fontWeight: "400",
                            lineHeight: "normal",
                            color: "white",
                            marginBottom: "16px",
                        }}
                    >
                        新規登録後トップページ
                    </h1>
                    <p
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "clamp(16px, 2vw, 20px)",
                            fontWeight: "400",
                            lineHeight: "normal",
                            color: "white",
                        }}
                    >
                        発注者専用ページ
                    </p>
                </div>

                {/* メインコンテンツ */}
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    {/* ウェルカムメッセージ */}
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "30px",
                            padding: "clamp(40px, 5vw, 60px)",
                            marginBottom: "clamp(40px, 5vw, 60px)",
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(20px, 2.5vw, 28px)",
                                fontWeight: "700",
                                color: "black",
                                marginBottom: "16px",
                            }}
                        >
                            ようこそ、ROCK CASTINGへ
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "clamp(14px, 1.5vw, 16px)",
                                fontWeight: "400",
                                color: "black",
                                lineHeight: "1.8",
                            }}
                        >
                            発注者として登録いただき、ありがとうございます。
                            このページから、キャストへの仕事依頼や管理を行うことができます。
                        </p>
                    </div>

                    {/* アクションボタン */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "clamp(20px, 3vw, 40px)",
                            marginBottom: "clamp(40px, 5vw, 60px)",
                        }}
                    >
                        {/* 仕事を依頼する */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "30px",
                                padding: "clamp(30px, 4vw, 40px)",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget;
                                target.style.transform = "translateY(-4px)";
                                target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget;
                                target.style.transform = "translateY(0)";
                                target.style.boxShadow = "none";
                            }}
                            onClick={() => router.push("/order-work")}
                        >
                            <h3
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "clamp(18px, 2vw, 24px)",
                                    fontWeight: "700",
                                    color: "black",
                                    marginBottom: "12px",
                                }}
                            >
                                仕事を依頼する
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "clamp(12px, 1.2vw, 14px)",
                                    fontWeight: "400",
                                    color: "#666",
                                    lineHeight: "1.6",
                                }}
                            >
                                キャストに仕事を依頼する
                            </p>
                        </div>

                        {/* プロフィール編集 */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "30px",
                                padding: "clamp(30px, 4vw, 40px)",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget;
                                target.style.transform = "translateY(-4px)";
                                target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget;
                                target.style.transform = "translateY(0)";
                                target.style.boxShadow = "none";
                            }}
                            onClick={() => {
                                // TODO: プロフィール編集ページへの遷移を実装
                                alert("プロフィール編集機能は準備中です");
                            }}
                        >
                            <h3
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "clamp(18px, 2vw, 24px)",
                                    fontWeight: "700",
                                    color: "black",
                                    marginBottom: "12px",
                                }}
                            >
                                プロフィール編集
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "clamp(12px, 1.2vw, 14px)",
                                    fontWeight: "400",
                                    color: "#666",
                                    lineHeight: "1.6",
                                }}
                            >
                                発注者プロフィールを編集する
                            </p>
                        </div>

                        {/* 依頼履歴 */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "30px",
                                padding: "clamp(30px, 4vw, 40px)",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget;
                                target.style.transform = "translateY(-4px)";
                                target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget;
                                target.style.transform = "translateY(0)";
                                target.style.boxShadow = "none";
                            }}
                            onClick={() => {
                                // TODO: 依頼履歴ページへの遷移を実装
                                alert("依頼履歴機能は準備中です");
                            }}
                        >
                            <h3
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "clamp(18px, 2vw, 24px)",
                                    fontWeight: "700",
                                    color: "black",
                                    marginBottom: "12px",
                                }}
                            >
                                依頼履歴
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    fontSize: "clamp(12px, 1.2vw, 14px)",
                                    fontWeight: "400",
                                    color: "#666",
                                    lineHeight: "1.6",
                                }}
                            >
                                過去の依頼履歴を確認する
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

