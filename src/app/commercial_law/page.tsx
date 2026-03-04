"use client";

import React from "react";
import Header from "../../components/Header";
import CommercialLaw from "../../components/CommercialLaw";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function CommercialLawPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CommercialLaw />
      <CTA />
      <Footer />
    </main>
  );
}
