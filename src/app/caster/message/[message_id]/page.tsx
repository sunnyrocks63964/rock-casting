"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import Message from "@/components/Message";

function CasterMessageContent() {
    const router = useRouter();
    const params = useParams();
    const messageId = params.message_id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [otherUserName, setOtherUserName] = useState<string>("");

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser, error: userError } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // スレッド情報を取得
    const { data: thread, isLoading: isLoadingThread } = trpc.message.getThread.useQuery(
        {
            threadId: messageId,
            userId: userId!,
        },
        {
            enabled: !!userId && !!messageId,
            retry: false,
        }
    );

    // 認証チェック
    useEffect(() => {
        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 200;

        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("セッション取得エラー:", error);
                    if (isMounted) {
                        router.push("/login");
                    }
                    return;
                }

                if (!session?.user) {
                    if (retryCount < maxRetries && isMounted) {
                        retryCount++;
                        setTimeout(() => {
                            if (isMounted) {
                                checkAuth();
                            }
                        }, retryDelay);
                    } else if (isMounted) {
                        router.push("/login");
                    }
                    return;
                }

                if (isMounted) {
                    setUserId(session.user.id);
                }
            } catch (error) {
                console.error("認証チェックエラー:", error);
                if (isMounted) {
                    router.push("/login");
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;

            if (event === 'SIGNED_IN' && session?.user) {
                setUserId(session.user.id);
            } else if (event === 'SIGNED_OUT' || (!session && event === 'TOKEN_REFRESHED')) {
                router.push("/login");
            }
        });

        checkAuth();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザー情報取得エラー:", userError);
            router.push("/login");
            return;
        }

        if (!userData) {
            if (userId) {
                console.error("ユーザー情報が取得できませんでした");
                router.push("/login");
            }
            return;
        }

        if (!userData.hasCasterProfile) {
            router.push("/top");
            return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
    }, [userData, isLoadingUser, userError, userId, router]);

    // 相手の名前を設定
    useEffect(() => {
        if (thread && userId) {
            const isOrderer = thread.ordererId === userId;
            let name = "ユーザー";
            
            if (isOrderer) {
                // 発注者の場合、相手はキャスト
                name = thread.caster.casterProfile?.fullName || thread.caster.email || "ユーザー";
            } else {
                // キャストの場合、相手は発注者
                name = thread.orderer.ordererProfile?.fullName || thread.orderer.email || "ユーザー";
            }
            
            setOtherUserName(name);
        }
    }, [thread, userId]);

    if (isLoading || !isAuthorized || isLoadingThread || !thread || !userId) {
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
                <div
                    style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "16px",
                        color: "white",
                    }}
                >
                    読み込み中...
                </div>
            </main>
        );
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#060606",
                color: "white",
            }}
        >
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}
            >
                <LoginedHeader />
                <LoginedNavBar />
            </div>
            <Message threadId={messageId} userId={userId} otherUserName={otherUserName} />
            <Footer />
        </main>
    );
}

export default function CasterMessagePage() {
    return (
        <Suspense
            fallback={
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
                    <div
                        style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: "16px",
                            color: "white",
                        }}
                    >
                        読み込み中...
                    </div>
                </main>
            }
        >
            <CasterMessageContent />
        </Suspense>
    );
}


