"use client";

import React, { useState, useEffect } from "react";
import MobileTopCaster from "./MobileTopCaster";
import DesktopTopCaster from "./DesktopTopCaster";

const TopCaster = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? <MobileTopCaster /> : <DesktopTopCaster />;
};

export default TopCaster;

