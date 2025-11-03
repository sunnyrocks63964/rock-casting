"use client";

import React, { useState, useEffect } from "react";
import DesktopReceiveWorkHero from "./DesktopReceiveWorkHero";
import MobileReceiveWorkHero from "./MobileReceiveWorkHero";

const ReceiveWorkHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileReceiveWorkHero /> : <DesktopReceiveWorkHero />;
};

export default ReceiveWorkHero;
