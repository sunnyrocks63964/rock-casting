import React from "react";
import ReceiveWorkHero from "@/components/ReceiveWork/HeroSection";
import CastCountSection from "@/components/ReceiveWork/CastCountSection";
import ReasonSection from "@/components/ReceiveWork/ReasonSection";
import JobExamplesSection from "@/components/JobExamplesSection";
import Cast from "@/components/Cast";
import CTA from "@/components/CTA";

export default function ReceiveWorkPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}>
      <ReceiveWorkHero />
      <CastCountSection />
      <ReasonSection />
      <JobExamplesSection />
      <Cast />
      <CTA />
    </main>
  );
}
