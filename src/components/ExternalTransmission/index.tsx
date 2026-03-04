"use client";

import React, { useState, useEffect } from "react";
import DesktopExternalTransmission from "./DesktopExternalTransmission";
import MobileExternalTransmission from "./MobileExternalTransmission";

const ExternalTransmission = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileExternalTransmission /> : <DesktopExternalTransmission />;
};

export default ExternalTransmission;
