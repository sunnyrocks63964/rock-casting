"use client";

import React from "react";
import HeroSection from "./HeroSection";
import CastCountSection from "./CastCountSection";
import ReasonSection from "./ReasonSection";
import JobCategoriesSection from "./JobCategoriesSection";
import JobExamplesSection from "./JobExamplesSection";
import CastGallerySection from "./CastGallerySection";

const ReceiveWork = () => {
  return (
    <div style={{ backgroundColor: "#060606", position: "relative", width: "100%" }}>
      <HeroSection />
      <CastCountSection />
      <ReasonSection />
      <JobCategoriesSection />
      <JobExamplesSection />
      <CastGallerySection />
    </div>
  );
};

export default ReceiveWork;


