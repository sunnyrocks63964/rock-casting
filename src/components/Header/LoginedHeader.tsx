"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RocknRoll_One } from "next/font/google";
import { trpc } from "@/lib/trpc/client";

const rocknrollOne = RocknRoll_One({
    weight: "400",
    subsets: ["latin"],
});

// Figmaから取得した画像URL
const img229589552 = "https://www.figma.com/api/mcp/asset/c08fde1f-9ab8-4621-8f71-0c28de47766d";

const LoginedHeader = () => {
    const router = useRouter();

    const logoutMutation = trpc.auth.logout.useMutation({
        onSuccess: () => {
            router.push("/login");
        },
        onError: (error) => {
            console.error("ログアウトエラー:", error);
        },
    });

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
    };

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                backgroundColor: "#060606",
                padding: "20px clamp(20px, 4vw, 60px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* ロゴ */}
            <Link
                href="/top"
                className={rocknrollOne.className}
                style={{
                    fontSize: "24px",
                    color: "white",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    lineHeight: "normal",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "white";
                }}
            >
                ROCK CASTING
            </Link>

            {/* ナビゲーション */}
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(20px, 3vw, 40px)",
                }}
            >
                <Link
                    href="#pricing"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        fontWeight: "700",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        lineHeight: "normal",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "white";
                    }}
                >
                    料金
                </Link>
                <Link
                    href="#casts"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        fontWeight: "700",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        lineHeight: "normal",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "white";
                    }}
                >
                    キャスト一覧
                </Link>
                <Link
                    href="/receive-work"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        fontWeight: "500",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        lineHeight: "normal",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "white";
                    }}
                >
                    仕事を受ける
                </Link>
                <Link
                    href="/order-work"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        fontWeight: "500",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        lineHeight: "normal",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.color = "white";
                    }}
                >
                    仕事を発注する
                </Link>
            </nav>

            {/* ユーザーアイコンとログアウト */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <img
                    src={img229589552}
                    alt="ユーザーアイコン"
                    style={{
                        width: "47px",
                        height: "47px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        objectFit: "cover",
                    }}
                />
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid black",
                        borderRadius: "90px",
                        padding: "12px 30px",
                        fontSize: "20px",
                        fontWeight: "700",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        cursor: "pointer",
                        lineHeight: "normal",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = "white";
                    }}
                >
                    ログアウト
                </button>
            </div>
        </header>
    );
};

export default LoginedHeader;

