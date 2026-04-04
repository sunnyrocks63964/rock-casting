"use client";

import React from "react";
import Hero from "../Hero";
import Service from "../Service";
import About from "../About";
import Cast from "../Cast";
import Function from "../Function";
import CTA from "../CTA";
import Voice from "../Voice";
import Flow from "../Flow";
import Faq from "../Faq";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <Service />
      <About />
      <Cast />
      <Function />
      <CTA />
      <Voice />
      <Flow />
      <Faq />
      <CTA />
    </main>
  );
}
