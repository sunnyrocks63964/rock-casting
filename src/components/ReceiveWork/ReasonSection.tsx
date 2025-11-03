"use client";

import React, { useState, useEffect } from "react";
import DesktopReasonSection from "./DesktopReasonSection";
import MobileReasonSection from "./MobileReasonSection";

const ReasonSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileReasonSection /> : <DesktopReasonSection />;
};

export default ReasonSection;
