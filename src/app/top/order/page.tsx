"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import TopOrder from "@/components/TopOrder";
import Footer from "@/components/Footer";

export default function OrderTopPage() {
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
        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 200;

        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("セッション取得エラー:", error);
                    if (isMounted) {
                        router.push("/login");
                    }
                    return;
                }

                if (!session?.user) {
                    if (retryCount < maxRetries && isMounted) {
                        retryCount++;
                        setTimeout(() => {
                            if (isMounted) {
                                checkAuth();
                            }
                        }, retryDelay);
                    } else if (isMounted) {
                        router.push("/login");
                    }
                    return;
                }

                if (isMounted) {
                    setUserId(session.user.id);
                }
            } catch (error) {
                console.error("認証チェックエラー:", error);
                if (isMounted) {
                    router.push("/login");
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;

            if (event === 'SIGNED_IN' && session?.user) {
                setUserId(session.user.id);
            } else if (event === 'SIGNED_OUT' || (!session && event === 'TOKEN_REFRESHED')) {
                router.push("/login");
            }
        });

        checkAuth();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザー情報取得エラー:", userError);
            router.push("/login");
            return;
        }

        if (!userData) {
            if (userId) {
                console.error("ユーザー情報が取得できませんでした");
                router.push("/login");
            }
            return;
        }

        if (!userData.hasOrdererProfile) {
            router.push("/top");
            return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
    }, [userData, isLoadingUser, userError, userId, router]);


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
            <LoginedHeader />
            <LoginedNavBar />
            <TopOrder />
            <Footer />
        </main>
    );
}
