"use client";

import React, { useState, useEffect } from "react";
import DesktopOrdererMyPage from "./DesktopOrdererMyPage";
import MobileOrdererMyPage from "./MobileOrdererMyPage";

interface OrdererMyPageProps {
    userId: string;
}

const OrdererMyPage: React.FC<OrdererMyPageProps> = ({ userId }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? <MobileOrdererMyPage userId={userId} /> : <DesktopOrdererMyPage userId={userId} />;
};

export default OrdererMyPage;
