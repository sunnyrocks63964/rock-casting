import React from "react";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import CTA from "@/components/CTA";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <PrivacyPolicy />
      <CTA />
    </main>
  );
}
