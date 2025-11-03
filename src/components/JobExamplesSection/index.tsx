"use client";

import React, { useState, useEffect } from "react";
import DesktopJobExamplesSection from "./DesktopJobExamplesSection";
import MobileJobExamplesSection from "./MobileJobExamplesSection";

const JobExamplesSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileJobExamplesSection /> : <DesktopJobExamplesSection />;
};

export default JobExamplesSection;
