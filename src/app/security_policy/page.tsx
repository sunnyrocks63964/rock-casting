"use client";

import React from "react";
import Header from "../../components/Header";
import SecurityPolicy from "../../components/SecurityPolicy";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function SecurityPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <SecurityPolicy />
      <CTA />
      <Footer />
    </main>
  );
}
