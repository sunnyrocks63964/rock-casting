"use client";

import React from "react";
import Header from "../../components/Header";
import TermsOfService from "../../components/TermsOfService";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <TermsOfService />
      <CTA />
      <Footer />
    </main>
  );
}
