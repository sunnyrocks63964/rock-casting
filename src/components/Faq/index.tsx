"use client";

import React, { useState, useEffect } from "react";
import DesktopFaq from "./DesktopFaq";
import MobileFaq from "./MobileFaq";

const Faq = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const faqs = [
    {
      question: "どんな人が登録されているの？",
      answer:
        "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
    },
    {
      question: "どんな人が登録されているの？",
      answer:
        "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
    },
    {
      question: "どんな人が登録されているの？",
      answer:
        "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
    },
    {
      question: "どんな人が登録されているの？",
      answer:
        "モデル、タレント、インフルエンサー、俳優、ナレーター、芸能家など、幅広いジャンルの方々が登録されています。また、地域や年齢、得意分野に応じた多様な方が在籍しているので、ご希望に合ったキャストを見つけることができます。",
    },
  ];

  return isMobile ? <MobileFaq faqs={faqs} /> : <DesktopFaq faqs={faqs} />;
};

export default Faq;
