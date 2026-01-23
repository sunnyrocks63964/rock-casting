"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import MessageList from "@/components/MessageList";

function CasterMessageListContent() {
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
            if (!userData.hasCasterProfile) {
                router.push("/top/order");
                return;
            }
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [userData, isLoadingUser, userError, router]);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                読み込み中...
            </div>
        );
    }

    if (!isAuthorized || !userId) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <LoginedHeader />
            <LoginedNavBar />
            <div style={{ flex: 1 }}>
                <MessageList userId={userId} userType="caster" />
            </div>
            <Footer />
        </div>
    );
}

export default function CasterMessageListPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                    }}
                >
                    読み込み中...
                </div>
            }
        >
            <CasterMessageListContent />
        </Suspense>
    );
}
