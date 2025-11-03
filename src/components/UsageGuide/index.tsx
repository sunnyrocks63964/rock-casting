"use client";

import React, { useState, useEffect } from "react";
import DesktopUsageGuide from "./DesktopUsageGuide";
import MobileUsageGuide from "./MobileUsageGuide";

const UsageGuide = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileUsageGuide /> : <DesktopUsageGuide />;
};

export default UsageGuide;
