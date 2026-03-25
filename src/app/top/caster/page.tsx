"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import TopCaster from "@/components/TopCaster";
import Footer from "@/components/Footer";

export default function CasterTopPage() {
    const router = useRouter();
    const { userId, isLoading, hasCasterProfile } = useUser();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasCasterProfile) { router.push("/"); return; }
    }, [isLoading, userId, hasCasterProfile, router]);

    if (isLoading || !userId || !hasCasterProfile) {
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
            <TopCaster />
            <Footer />
        </main>
    );
}
