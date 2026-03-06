"use client";

import React, { useState, useEffect, Suspense } from "react";
import MobileAddProjectContent from "./MobileAddProjectContent";
import DesktopAddProjectContent from "./DesktopAddProjectContent";

export default function AddProjectPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                    }}
                >
                    読み込み中...
                </div>
            }
        >
            {isMobile ? <MobileAddProjectContent /> : <DesktopAddProjectContent />}
        </Suspense>
    );
}
