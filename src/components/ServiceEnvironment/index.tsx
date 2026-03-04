"use client";

import React, { useState, useEffect } from "react";
import DesktopServiceEnvironment from "./DesktopServiceEnvironment";
import MobileServiceEnvironment from "./MobileServiceEnvironment";

const ServiceEnvironment = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileServiceEnvironment /> : <DesktopServiceEnvironment />;
};

export default ServiceEnvironment;
