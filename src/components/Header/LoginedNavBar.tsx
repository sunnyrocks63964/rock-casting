"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import notificationBell from "./images/notification_bell.png";

const LoginedNavBar = () => {
    const pathname = usePathname();
    const [messageListPath, setMessageListPath] = useState("/order/message_list");
    const [contractListPath, setContractListPath] = useState("/order/contracts");
    const [userId, setUserId] = useState<string | null>(null);

    // 現在のユーザー情報を取得
    const { data: userData } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // ユーザーIDを取得
    useEffect(() => {
        const getUserId = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
            }
        };
        getUserId();
    }, []);

    // メッセージ一覧のパスを決定
    useEffect(() => {
        // パスベースの判定（優先度：高）
        if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
            setMessageListPath("/caster/message_list");
            setContractListPath("/caster/contracts");
            return;
        }
        if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
            setMessageListPath("/order/message_list");
            setContractListPath("/order/contracts");
            return;
        }

        // ユーザーデータベースの判定（フォールバック）
        if (userData) {
            if (userData.hasCasterProfile && !userData.hasOrdererProfile) {
                setMessageListPath("/caster/message_list");
                setContractListPath("/caster/contracts");
            } else if (userData.hasOrdererProfile && !userData.hasCasterProfile) {
                setMessageListPath("/order/message_list");
                setContractListPath("/order/contracts");
            } else if (userData.hasCasterProfile && userData.hasOrdererProfile) {
                // 両方持っている場合は、パスに基づいて判定（デフォルトはorder）
                setMessageListPath("/order/message_list");
                setContractListPath("/order/contracts");
            }
        }
    }, [pathname, userData]);

    // orderとしてログインしているかどうかを判定
    const isOrderer = userData?.hasOrdererProfile ?? false;
    // casterとしてログインしているかどうかを判定
    const isCaster = userData?.hasCasterProfile ?? false;

    // お気に入りページのパスを決定
    const favoritePath = isCaster ? "/caster/favorite" : "/order/favorite";

    return (
        <div
            style={{
                height: "40px",
                backgroundColor: "#ff6d00",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "clamp(20px, 4vw, 60px)",
                gap: "clamp(20px, 3vw, 40px)",
            }}
        >
            {isOrderer && (
                <Link
                    href="/order/add_project"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "700",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        lineHeight: "normal",
                        textAlign: "center",
                        whiteSpace: "pre-wrap",
                        transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.opacity = "1";
                    }}
                >
                    新しい仕事を依頼
                </Link>
            )}
            <Link
                href="#"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                キャスト検索
            </Link>
            <Link
                href={messageListPath}
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                メッセージ
            </Link>
            <Link
                href={contractListPath}
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                契約一覧
            </Link>
            <Link
                href="/order/package_reservate"
                style={{
                    color: pathname === "/order/package_reservate" ? "#fff" : "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                パッケージ予約
            </Link>
            <Link
                href={favoritePath}
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                お気に入り
            </Link>
            <img
                src={notificationBell.src}
                alt="通知"
                style={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            />
        </div>
    );
};

export default LoginedNavBar;

