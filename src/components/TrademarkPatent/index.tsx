"use client";

import React, { useState, useEffect } from "react";
import DesktopTrademarkPatent from "./DesktopTrademarkPatent";
import MobileTrademarkPatent from "./MobileTrademarkPatent";

const TrademarkPatent = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileTrademarkPatent /> : <DesktopTrademarkPatent />;
};

export default TrademarkPatent;
