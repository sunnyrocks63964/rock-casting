"use client";

import React, { useState, useEffect } from "react";
import DesktopCastCountSection from "./DesktopCastCountSection";
import MobileCastCountSection from "./MobileCastCountSection";

const CastCountSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileCastCountSection /> : <DesktopCastCountSection />;
};

export default CastCountSection;
