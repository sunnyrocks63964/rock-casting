'use client'

import React from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Service from '@/components/Service'
import About from '@/components/About'
import Cast from '@/components/Cast'
import Function from '@/components/Function'
import Voice from '@/components/Voice'
import Flow from '@/components/Flow'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <Service />
      <About />
      <Cast />
      <Function />
      <CTA />
      <Voice />
      <Flow />
      <Footer />
    </main>
  )
}
