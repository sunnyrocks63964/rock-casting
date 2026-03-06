"use client";

import React, { useState, useEffect } from "react";
import DesktopContractList from "./DesktopContractList";
import MobileContractList from "./MobileContractList";

type ContractListProps = {
    userId: string;
    userType: "order" | "caster";
};

export default function ContractList({ userId, userType }: ContractListProps) {
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
        <MobileContractList userId={userId} userType={userType} />
    ) : (
        <DesktopContractList userId={userId} userType={userType} />
    );
}
