"use client";

import React from "react";
import Header from "../../components/Header";
import ReceiveWorkHero from "../../components/ReceiveWork/HeroSection";
import CastCountSection from "../../components/ReceiveWork/CastCountSection";
import ReasonSection from "../../components/ReceiveWork/ReasonSection";
import JobExamplesSection from "../../components/JobExamplesSection";
import CTA from "../../components/CTA";
import Cast from "../../components/Cast";
import Footer from "../../components/Footer";

export default function ReceiveWorkPage() {
  return (
    <main
      style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}
    >
      <Header />
      <ReceiveWorkHero />
      <CastCountSection />
      <ReasonSection />
      <JobExamplesSection />
      <Cast />
      <CTA />
      <Footer />
    </main>
  );
}
