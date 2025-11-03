"use client";

import React, { useState, useEffect } from "react";
import kvSlide01 from "./images/kv_slide_01.png";
import kvSlide02 from "./images/kv_slide_02.png";
import kvSlide03 from "./images/kv_slide_03.png";
import kvSlide08 from "./images/kv_slide_08.png";
import DesktopHero from "./DesktopHero";
import MobileHero from "./MobileHero";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slides = [
    {
      src: kvSlide01.src,
      alt: "KV Slide 1",
    },
    {
      src: kvSlide02.src,
      alt: "KV Slide 2",
    },
    {
      src: kvSlide03.src,
      alt: "KV Slide 3",
    },
    {
      src: kvSlide08.src,
      alt: "KV Slide 4",
    },
  ];

  return isMobile ? (
    <MobileHero slides={slides} />
  ) : (
    <DesktopHero slides={slides} />
  );
};

export default Hero;
