"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import PackageReservate from "@/components/PackageReservate";

function PackageReservateContent() {
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
        if (!userId) {
            return;
        }

        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザーデータ取得エラー:", userError);
            if (userError.data?.code === "UNAUTHORIZED" || userError.data?.code === "NOT_FOUND") {
                router.push("/login");
            } else {
                console.error("ユーザーデータ取得エラー（再試行可能）:", userError);
            }
            return;
        }

        if (!userData) {
            return;
        }

        if (!userData.hasOrdererProfile) {
            router.push("/");
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
            <PackageReservate />
            <Footer />
        </main>
    );
}

export default function PackageReservatePage() {
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
            <PackageReservateContent />
        </Suspense>
    );
}
