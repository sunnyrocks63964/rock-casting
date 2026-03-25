"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useUser } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";

const Message = dynamic(() => import("@/components/Message"), {
    ssr: false,
    loading: () => (
        <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
        </main>
    ),
});

function OrderMessageContent() {
    const router = useRouter();
    const params = useParams();
    const messageId = params.message_id as string;
    const { userId, isLoading, hasOrdererProfile } = useUser();
    const [otherUserName, setOtherUserName] = useState<string>("");

    const { data: thread, isLoading: isLoadingThread } = trpc.message.getThread.useQuery(
        { threadId: messageId, userId: userId! },
        { enabled: !!userId && !!messageId && !isLoading, retry: false }
    );

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    useEffect(() => {
        if (!thread || !userId) return;
        const isOrderer = thread.ordererId === userId;
        const name = isOrderer
            ? thread.caster.casterProfile?.fullName || thread.caster.email || "ユーザー"
            : thread.orderer.ordererProfile?.fullName || thread.orderer.email || "ユーザー";
        setOtherUserName(name);
    }, [thread, userId]);

    if (isLoading || !userId || !hasOrdererProfile || isLoadingThread || !thread) {
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
            <Message threadId={messageId} userId={userId} otherUserName={otherUserName} />
            <Footer />
        </main>
    );
}

export default function OrderMessagePage() {
    return (
        <Suspense
            fallback={
                <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "16px", color: "white" }}>読み込み中...</div>
                </main>
            }
        >
            <OrderMessageContent />
        </Suspense>
    );
}
