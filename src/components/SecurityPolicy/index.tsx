"use client";

import React, { useState, useEffect } from "react";
import DesktopSecurityPolicy from "./DesktopSecurityPolicy";
import MobileSecurityPolicy from "./MobileSecurityPolicy";

const SecurityPolicy = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileSecurityPolicy /> : <DesktopSecurityPolicy />;
};

export default SecurityPolicy;
