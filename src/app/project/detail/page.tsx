"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import ProjectDetail from "@/components/ProjectDetail";

function ProjectDetailContent() {
    const router = useRouter();
    const { userId, isLoading, hasCasterProfile, hasOrdererProfile } = useUser();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasCasterProfile && !hasOrdererProfile) { router.push("/"); return; }
    }, [isLoading, userId, hasCasterProfile, hasOrdererProfile, router]);

    if (isLoading || !userId || (!hasCasterProfile && !hasOrdererProfile)) {
        return (
            <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}>
            <LoginedHeader />
            <LoginedNavBar />
            <ProjectDetail />
            <Footer />
        </main>
    );
}

export default function ProjectDetailPage() {
    return (
        <Suspense
            fallback={
                <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
                </main>
            }
        >
            <ProjectDetailContent />
        </Suspense>
    );
}
