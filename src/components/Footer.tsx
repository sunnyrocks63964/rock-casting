"use client";

import React, { useState, useEffect } from "react";
import DesktopFooter from "./Footer/DesktopFooter";
import MobileFooter from "./Footer/MobileFooter";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileFooter /> : <DesktopFooter />;
};

export default Footer;
