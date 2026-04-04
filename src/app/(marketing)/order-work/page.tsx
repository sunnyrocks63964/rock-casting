import React from "react";
import OrderWork from "@/components/OrderWork";
import Voice from "@/components/Voice";
import Cast from "@/components/Cast";
import CTA from "@/components/CTA";

export default function OrderWorkPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#060606", color: "white" }}>
      <OrderWork />
      <Voice />
      <Cast />
      <CTA />
    </main>
  );
}
