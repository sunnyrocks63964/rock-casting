"use client";

import React, { useState, useEffect } from "react";
import DesktopOrdererFavoriteCaster from "./DesktopOrdererFavoriteCaster";
import MobileOrdererFavoriteCaster from "./MobileOrdererFavoriteCaster";

interface OrdererFavoriteCasterProps {
    ordererId: string;
}

const OrdererFavoriteCaster = ({ ordererId }: OrdererFavoriteCasterProps) => {
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
        <MobileOrdererFavoriteCaster ordererId={ordererId} />
    ) : (
        <DesktopOrdererFavoriteCaster ordererId={ordererId} />
    );
};

export default OrdererFavoriteCaster;
