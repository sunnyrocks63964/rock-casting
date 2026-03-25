"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import CastDetail from "@/components/CastDetail";

function CastDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { userId, isLoading, hasOrdererProfile } = useUser();
    const castUserId = searchParams.get("userId");

    const { data: castProfile, isLoading: isLoadingCastProfile } = trpc.profile.getCasterProfile.useQuery(
        { userId: castUserId! },
        { enabled: !!castUserId, retry: false }
    );

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    if (isLoading || !userId || !hasOrdererProfile || isLoadingCastProfile || !castProfile) {
        return (
            <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}>
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
                <LoginedHeader />
                <LoginedNavBar />
            </div>
            <CastDetail castProfile={castProfile} ordererUserId={userId} />
            <Footer />
        </main>
    );
}

export default function CastDetailPage() {
    return (
        <Suspense
            fallback={
                <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
                </main>
            }
        >
            <CastDetailContent />
        </Suspense>
    );
}
