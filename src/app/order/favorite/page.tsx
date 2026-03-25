"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import OrdererFavoriteCaster from "@/components/OrdererFavoriteCaster";

function FavoriteContent() {
    const router = useRouter();
    const { userId, isLoading, hasOrdererProfile } = useUser();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/top/caster"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    if (isLoading || !userId || !hasOrdererProfile) {
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
                <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>
                    読み込み中...
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}>
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
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
                <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
                </main>
            }
        >
            <FavoriteContent />
        </Suspense>
    );
}
