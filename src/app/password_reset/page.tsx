"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordResetConfirm from "@/components/PasswordResetConfirm";

export default function PasswordResetPage() {
  return (
    <main
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
      }}
    >
      <Header />
      <PasswordResetConfirm />
      <Footer />
    </main>
  );
}

