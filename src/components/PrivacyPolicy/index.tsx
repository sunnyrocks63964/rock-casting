"use client";

import React, { useState, useEffect } from "react";
import DesktopPrivacyPolicy from "./DesktopPrivacyPolicy";
import MobilePrivacyPolicy from "./MobilePrivacyPolicy";

const PrivacyPolicy = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobilePrivacyPolicy /> : <DesktopPrivacyPolicy />;
};

export default PrivacyPolicy;
