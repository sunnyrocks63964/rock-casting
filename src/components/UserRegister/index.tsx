"use client";

import React, { useState, useEffect } from "react";
import DesktopUserRegister from "./DesktopUserRegister";
import MobileUserRegister from "./MobileUserRegister";

const UserRegister = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileUserRegister /> : <DesktopUserRegister />;
};

export default UserRegister;

