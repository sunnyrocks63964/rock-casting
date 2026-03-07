"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import DesktopPackageReservateSearched from "./DesktopPackageReservateSearched";
import MobilePackageReservateSearched from "./MobilePackageReservateSearched";

type ProfessionType =
    | "photographer"
    | "model"
    | "stylist"
    | "hair_makeup"
    | "video_creator"
    | "web_designer";

interface ProfessionCount {
    profession: ProfessionType;
    count: number;
}

const PackageReservateSearched = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [ordererId, setOrdererId] = useState<string | null>(null);
    const [professionCounts, setProfessionCounts] = useState<ProfessionCount[]>([]);

    // モバイル判定
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // URLパラメータから職種と人数を取得
    useEffect(() => {
        const professionsParam = searchParams.get("professions");
        if (professionsParam) {
            const counts: ProfessionCount[] = [];
            const params = searchParams.getAll("professions");
            params.forEach((param) => {
                const [profession, countStr] = param.split(":");
                const count = parseInt(countStr, 10);
                if (profession && !isNaN(count) && count > 0) {
                    counts.push({
                        profession: profession as ProfessionType,
                        count,
                    });
                }
            });
            setProfessionCounts(counts);
        }
    }, [searchParams]);

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser, error: userError } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 認証チェック
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                router.push("/login");
                return;
            }

            setUserId(session.user.id);
            setOrdererId(session.user.id);
        };

        checkAuth();
    }, [router]);

    // ユーザーデータ取得後の権限チェック
    useEffect(() => {
        if (!userId) {
            return;
        }

        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザーデータ取得エラー:", userError);
            if (userError.data?.code === "UNAUTHORIZED" || userError.data?.code === "NOT_FOUND") {
                router.push("/login");
            } else {
                console.error("ユーザーデータ取得エラー（再試行可能）:", userError);
            }
            return;
        }

        if (!userData) {
            return;
        }

        if (!userData.hasOrdererProfile) {
            router.push("/top");
            return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
    }, [userData, isLoadingUser, userError, userId, router]);


    if (isLoading || !isAuthorized || !userId || !ordererId) {
        return (
            <div
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
            </div>
        );
    }

    return isMobile ? (
        <MobilePackageReservateSearched
            userId={userId}
            ordererId={ordererId}
            professionCounts={professionCounts}
            isAuthorized={isAuthorized}
        />
    ) : (
        <DesktopPackageReservateSearched
            userId={userId}
            ordererId={ordererId}
            professionCounts={professionCounts}
            isAuthorized={isAuthorized}
        />
    );
};

export default PackageReservateSearched;
