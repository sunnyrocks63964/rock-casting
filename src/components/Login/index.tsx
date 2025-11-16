"use client";

import { useState, useEffect } from "react";
import DesktopLogin from "./DesktopLogin";
import MobileLogin from "./MobileLogin";

export default function Login() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? <MobileLogin /> : <DesktopLogin />;
}
