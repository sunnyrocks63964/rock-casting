"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import OrdererFavoriteCaster from "@/components/OrdererFavoriteCaster";

function FavoriteContent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser, error: userError } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 認証チェック
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                router.push("/login");
                return;
            }

            setUserId(session.user.id);
        };

        checkAuth();
    }, [router]);

    // ユーザーデータ取得後の権限チェック
    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザー情報取得エラー:", userError);
            router.push("/login");
            return;
        }

        if (userData) {
            if (!userData.hasOrdererProfile) {
                router.push("/top/caster");
                return;
            }
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [userData, isLoadingUser, userError, router]);

    if (isLoading || !isAuthorized || !userId) {
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
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}
            >
                <LoginedHeader />
                <LoginedNavBar />
            </div>
            <OrdererFavoriteCaster ordererId={userId} />
            <Footer />
        </main>
    );
}

export default function FavoritePage() {
    return (
        <Suspense
            fallback={
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
            }
        >
            <FavoriteContent />
        </Suspense>
    );
}
