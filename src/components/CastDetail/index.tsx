"use client";

import React, { useState, useEffect } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/routers/_app";
import DesktopCastDetail from "./DesktopCastDetail";
import MobileCastDetail from "./MobileCastDetail";

// tRPC の型推論を使用して型を取得
type RouterOutputs = inferRouterOutputs<AppRouter>;
type CasterProfileOutput = RouterOutputs["profile"]["getCasterProfile"];

interface CastDetailProps {
    castProfile: CasterProfileOutput;
    ordererUserId: string;
}

const CastDetail = ({ castProfile, ordererUserId }: CastDetailProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? (
        <MobileCastDetail castProfile={castProfile} ordererUserId={ordererUserId} />
    ) : (
        <DesktopCastDetail castProfile={castProfile} ordererUserId={ordererUserId} />
    );
};

export default CastDetail;
