"use client";

import React, { useState, useEffect } from "react";
import MobileCasterFavoriteOrderProject from "./MobileCasterFavoriteOrderProject";
import DesktopCasterFavoriteOrderProject from "./DesktopCasterFavoriteOrderProject";

interface CasterFavoriteOrderProjectProps {
    casterId: string;
}

const CasterFavoriteOrderProject = ({ casterId }: CasterFavoriteOrderProjectProps) => {
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
        <MobileCasterFavoriteOrderProject casterId={casterId} />
    ) : (
        <DesktopCasterFavoriteOrderProject casterId={casterId} />
    );
};

export default CasterFavoriteOrderProject;
