"use client";

import React from "react";
import Header from "../../components/Header";
import UsageGuide from "../../components/UsageGuide";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function UsageGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <UsageGuide />
      <CTA />
      <Footer />
    </main>
  );
}
