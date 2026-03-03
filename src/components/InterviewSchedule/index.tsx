"use client";

import React, { useState, useEffect } from "react";
import DesktopInterviewSchedule from "./DesktopInterviewSchedule";
import MobileInterviewSchedule from "./MobileInterviewSchedule";

const InterviewSchedule = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 770);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? <MobileInterviewSchedule /> : <DesktopInterviewSchedule />;
};

export default InterviewSchedule;
