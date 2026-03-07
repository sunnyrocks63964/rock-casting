"use client";

import React, { useState, useEffect } from "react";
import DesktopMessage from "./DesktopMessage";
import MobileMessage from "./MobileMessage";

interface MessageProps {
    threadId: string;
    userId: string;
    otherUserName: string;
}

const Message = ({ threadId, userId, otherUserName }: MessageProps) => {
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
        <MobileMessage threadId={threadId} userId={userId} otherUserName={otherUserName} />
    ) : (
        <DesktopMessage threadId={threadId} userId={userId} otherUserName={otherUserName} />
    );
};

export default Message;
