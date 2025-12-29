"use client";

import { useState, useEffect } from "react";
import DesktopPasswordResetConfirm from "./DesktopPasswordResetConfirm";
import MobilePasswordResetConfirm from "./MobilePasswordResetConfirm";

export default function PasswordResetConfirm() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobilePasswordResetConfirm /> : <DesktopPasswordResetConfirm />;
}

