"use client";

import React from "react";
import Header from "../../components/Header";
import ReceiveWork from "../../components/ReceiveWork/index";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export default function ReceiveWorkPage() {
  return (
    <main
      style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}
    >
      <Header />
      <ReceiveWork />
      <CTA />
      <Footer />
    </main>
  );
}
