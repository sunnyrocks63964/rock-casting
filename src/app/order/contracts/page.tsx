"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import ContractList from "@/components/ContractList";

function OrderContractListContent() {
    const router = useRouter();
    const { userId, isLoading, hasOrdererProfile } = useUser();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/top/caster"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    if (isLoading || !userId || !hasOrdererProfile) {
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
                <ContractList userId={userId} userType="order" />
            </div>
            <Footer />
        </div>
    );
}

export default function OrderContractListPage() {
    return (
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>読み込み中...</div>}>
            <OrderContractListContent />
        </Suspense>
    );
}
