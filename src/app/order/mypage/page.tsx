"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import OrdererMyPage from "@/components/OrdererMyPage";

function MyPageContent() {
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
        // userIdが設定されるまで待機
        if (!userId) {
            return;
        }

        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザーデータ取得エラー:", userError);
            // エラーの種類によって処理を分ける
            if (userError.data?.code === "UNAUTHORIZED" || userError.data?.code === "NOT_FOUND") {
                router.push("/login");
            } else {
                // その他のエラーは再試行を許可
                console.error("ユーザーデータ取得エラー（再試行可能）:", userError);
            }
            return;
        }

        if (!userData) {
            // userIdが設定されているのにuserDataが取得できない場合は、まだ読み込み中とみなす
            return;
        }

        // 発注者プロフィールが存在するかチェック
        if (!userData.hasOrdererProfile) {
            // 発注者プロフィールが存在しない場合は作成画面へ
            router.push("/profile/create?role=orderer");
            return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
    }, [userData, isLoadingUser, userError, userId, router]);

    if (isLoading || !isAuthorized || !userId) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                読み込み中...
            </div>
        );
    }

    return (
        <>
            <LoginedHeader />
            <LoginedNavBar />
            <OrdererMyPage userId={userId} />
            <Footer />
        </>
    );
}

export default function MyPage() {
    return (
        <Suspense
            fallback={
                <div style={{ padding: "40px", textAlign: "center" }}>
                    読み込み中...
                </div>
            }
        >
            <MyPageContent />
        </Suspense>
    );
}
