"use client";

import React from "react";
import HeroSection from "./HeroSection";
import CastCountSection from "./CastCountSection";
import ReasonSection from "./ReasonSection";
import JobExamplesSection from "../JobExamplesSection";
import Cast from "../Cast";

const ReceiveWork = () => {
  return (
    <div
      style={{
        backgroundColor: "#060606",
        position: "relative",
        width: "100%",
      }}
    >
      <HeroSection />
      <CastCountSection />
      <ReasonSection />
      <JobExamplesSection />
      <Cast />
    </div>
  );
};

export default ReceiveWork;
