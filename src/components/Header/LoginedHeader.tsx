"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
    const pathname = usePathname();
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

    // 現在のユーザー情報を取得
    const { data: userData } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // キャストプロフィールを取得
    const { data: casterProfileData } = trpc.profile.getCasterProfile.useQuery(
        { userId: userId! },
        {
            enabled: !!userId && (userData?.hasCasterProfile ?? false),
            retry: false,
        }
    );

    // 発注者プロフィールを取得
    const { data: ordererProfileData } = trpc.profile.getOrdererProfile.useQuery(
        { userId: userId! },
        {
            enabled: !!userId && (userData?.hasOrdererProfile ?? false),
            retry: false,
        }
    );

    // マイページへの遷移先を決定
    const getMyPagePath = (): string => {
        // パスベースの判定（優先度：高）
        if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
            return "/caster/mypage";
        }
        if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
            return "/order/mypage";
        }

        // ユーザーデータベースの判定（フォールバック）
        if (userData) {
            if (userData.hasCasterProfile && !userData.hasOrdererProfile) {
                return "/caster/mypage";
            }
            if (userData.hasOrdererProfile && !userData.hasCasterProfile) {
                return "/order/mypage";
            }
            if (userData.hasCasterProfile && userData.hasOrdererProfile) {
                // 両方持っている場合は、パスに基づいて判定（デフォルトはorder）
                return "/order/mypage";
            }
        }

        // デフォルト
        return "/order/mypage";
    };

    // トップページへの遷移先を決定（パスベースの判定）
    const getTopPath = (): string => {
        if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
            return "/top/caster";
        }
        if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
            return "/top/order";
        }
        // デフォルト
        return "/top/order";
    };

    // 表示する画像を決定（メイン画像があればそれを使用、なければデフォルト画像）
    const casterMainProfileImage = casterProfileData && "mainProfileImage" in casterProfileData 
        ? (casterProfileData.mainProfileImage as string | null | undefined)
        : null;
    const ordererMainProfileImage = ordererProfileData && "mainProfileImage" in ordererProfileData
        ? (ordererProfileData.mainProfileImage as string | null | undefined)
        : null;
    
    // 現在のパスに応じて適切なプロフィール画像を選択
    const mainProfileImage = (pathname.startsWith("/caster") || pathname.startsWith("/top/caster"))
        ? casterMainProfileImage
        : ordererMainProfileImage || casterMainProfileImage;
    
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
                href={getTopPath()}
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
                    href="/usage_guide"
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
                    onClick={() => router.push(getMyPagePath())}
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

