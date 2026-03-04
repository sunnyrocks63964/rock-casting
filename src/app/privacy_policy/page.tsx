"use client";

import React from "react";
import Header from "../../components/Header";
import PrivacyPolicy from "../../components/PrivacyPolicy";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PrivacyPolicy />
      <CTA />
      <Footer />
    </main>
  );
}
