"use client";

import React, { useState, useEffect } from "react";
import MobileCasterMyPage from "./MobileCasterMyPage";
import DesktopCasterMyPage from "./DesktopCasterMyPage";

interface CasterMyPageProps {
    userId: string;
}

const CasterMyPage: React.FC<CasterMyPageProps> = ({ userId }) => {
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
        <MobileCasterMyPage userId={userId} />
    ) : (
        <DesktopCasterMyPage userId={userId} />
    );
};

export default CasterMyPage;
