"use client";

import React from "react";
import Header from "../../components/Header";
import ServiceEnvironment from "../../components/ServiceEnvironment";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function ServiceEnvironmentPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ServiceEnvironment />
      <CTA />
      <Footer />
    </main>
  );
}
