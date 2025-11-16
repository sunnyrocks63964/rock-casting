"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserRegister from "@/components/UserRegister";

export default function UserRegisterPage() {
  return (
    <div
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
      }}
    >
      <Header />
      <UserRegister />
      <Footer />
    </div>
  );
}
