"use client";

import React from "react";
import Header from "../../components/Header";
import ExternalTransmission from "../../components/ExternalTransmission";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function ExternalTransmissionPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ExternalTransmission />
      <CTA />
      <Footer />
    </main>
  );
}
