"use client";

import React, { useState, useEffect } from "react";
import DesktopCommercialLaw from "./DesktopCommercialLaw";
import MobileCommercialLaw from "./MobileCommercialLaw";

const CommercialLaw = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileCommercialLaw /> : <DesktopCommercialLaw />;
};

export default CommercialLaw;
