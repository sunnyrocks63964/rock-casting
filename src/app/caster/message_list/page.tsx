"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import MessageList from "@/components/MessageList";

function CasterMessageListContent() {
    const router = useRouter();
    const { userId, isLoading, hasCasterProfile } = useUser();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasCasterProfile) { router.push("/top/order"); return; }
    }, [isLoading, userId, hasCasterProfile, router]);

    if (isLoading || !userId || !hasCasterProfile) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                読み込み中...
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>読み込み中...</div>}>
            <CasterMessageListContent />
        </Suspense>
    );
}
