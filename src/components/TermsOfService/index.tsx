"use client";

import React, { useState, useEffect } from "react";
import DesktopTermsOfService from "./DesktopTermsOfService";
import MobileTermsOfService from "./MobileTermsOfService";

const TermsOfService = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileTermsOfService /> : <DesktopTermsOfService />;
};

export default TermsOfService;
