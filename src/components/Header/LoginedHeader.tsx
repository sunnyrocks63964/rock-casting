"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RocknRoll_One } from "next/font/google";
import { trpc } from "@/lib/trpc/client";
import { supabase } from "@/lib/supabase";
import userPicture from "./images/user_picture.png";

const rocknrollOne = RocknRoll_One({
    weight: "400",
    subsets: ["latin"],
});


const LoginedHeader = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

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

    // キャストプロフィールを取得
    const { data: profileData } = trpc.profile.getCasterProfile.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 表示する画像を決定（メイン画像があればそれを使用、なければデフォルト画像）
    const mainProfileImage = profileData && "mainProfileImage" in profileData 
        ? (profileData.mainProfileImage as string | null | undefined)
        : null;
    const displayImage: string = (mainProfileImage && typeof mainProfileImage === "string")
        ? mainProfileImage
        : userPicture.src;

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
                backgroundColor: "#060606",
                padding: "clamp(12px, 1.2vw, 20px) clamp(20px, 4vw, 60px)",
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
                    gap: "0",
                    marginLeft: "clamp(20px, 2vw, 40px)",
                }}
            >
                <Link
                    href="#pricing"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "clamp(12px, 1.05vw, 20px)",
                        fontWeight: "700",
                        transition: "color 0.3s ease",
                        padding: "0 clamp(25px, 3.8vw, 70px) 0 0",
                        whiteSpace: "nowrap",
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
                        fontSize: "clamp(12px, 1.05vw, 20px)",
                        fontWeight: "700",
                        transition: "color 0.3s ease",
                        padding: "0 clamp(30px, 4.5vw, 85px) 0 0",
                        whiteSpace: "nowrap",
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
                        fontSize: "clamp(12px, 1.05vw, 20px)",
                        fontWeight: "500",
                        transition: "color 0.3s ease",
                        padding: "0 clamp(30px, 4.5vw, 85px) 0 0",
                        whiteSpace: "nowrap",
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
                        fontSize: "clamp(12px, 1.05vw, 20px)",
                        fontWeight: "500",
                        transition: "color 0.3s ease",
                        padding: "0 clamp(30px, 4.5vw, 85px) 0 0",
                        whiteSpace: "nowrap",
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
                    gap: "0",
                }}
            >
                <img
                    src={displayImage}
                    alt="ユーザーアイコン"
                    onClick={() => router.push("/caster/mypage")}
                    style={{
                        width: "47px",
                        height: "47px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        objectFit: "cover",
                        marginRight: "clamp(15px, 1.6vw, 30px)",
                        transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.opacity = "0.7";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.opacity = "1";
                    }}
                />
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid white",
                        borderRadius: "90px",
                        padding: "clamp(8px, 0.6vw, 12px) clamp(15px, 1.6vw, 30px)",
                        fontSize: "clamp(12px, 1.05vw, 20px)",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "inline-block",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = "black";
                        target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = "white";
                        target.style.color = "black";
                    }}
                >
                    ログアウト
                </button>
            </div>
        </header>
    );
};

export default LoginedHeader;

