"use client";

import React, { useState, useEffect } from "react";
import DesktopMessageList from "./DesktopMessageList";
import MobileMessageList from "./MobileMessageList";

type MessageListProps = {
    userId: string;
    userType: "order" | "caster";
};

export default function MessageList({ userId, userType }: MessageListProps) {
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
        <MobileMessageList userId={userId} userType={userType} />
    ) : (
        <DesktopMessageList userId={userId} userType={userType} />
    );
}
