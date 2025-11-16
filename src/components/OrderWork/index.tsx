"use client";

import React, { useState, useEffect } from "react";
import DesktopOrderWork from "./DesktopOrderWork";
import MobileOrderWork from "./MobileOrderWork";

const OrderWork = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileOrderWork /> : <DesktopOrderWork />;
};

export default OrderWork;
