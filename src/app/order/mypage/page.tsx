"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import OrdererMyPage from "@/components/OrdererMyPage";

function MyPageContent() {
    const router = useRouter();
    const { userId, isLoading, hasOrdererProfile } = useUser();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/profile/create?role=orderer"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    if (isLoading || !userId || !hasOrdererProfile) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>
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
        <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>読み込み中...</div>}>
            <MyPageContent />
        </Suspense>
    );
}
