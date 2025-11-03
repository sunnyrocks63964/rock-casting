"use client";

import React, { useState, useEffect } from "react";
import DesktopService from "./DesktopService";
import MobileService from "./MobileService";

const Service = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileService /> : <DesktopService />;
};

export default Service;
