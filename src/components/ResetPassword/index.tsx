"use client";

import { useState, useEffect } from "react";
import DesktopResetPassword from "./DesktopResetPassword";
import MobileResetPassword from "./MobileResetPassword";

export default function ResetPassword() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? <MobileResetPassword /> : <DesktopResetPassword />;
}
