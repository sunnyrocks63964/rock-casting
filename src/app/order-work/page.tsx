"use client";

import React from "react";
import Header from "../../components/Header";
import OrderWork from "../../components/OrderWork/index";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";
import Voice from "../../components/Voice";
import Cast from "../../components/Cast";

export default function OrderWorkPage() {
  return (
    <main
      style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}
    >
      <Header />
      <OrderWork />
      <Voice />
      <Cast />
      <CTA />
      <Footer />
    </main>
  );
}
