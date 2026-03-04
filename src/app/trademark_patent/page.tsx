"use client";

import React from "react";
import Header from "../../components/Header";
import TrademarkPatent from "../../components/TrademarkPatent";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function TrademarkPatentPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <TrademarkPatent />
      <CTA />
      <Footer />
    </main>
  );
}
