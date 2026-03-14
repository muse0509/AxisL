"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyAxis from "@/components/WhyAxis";
import HowItWorks from "@/components/HowItWorks";
import Mechanism from "@/components/Mechanism";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function AxisLandingPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#e5e5e5] font-sans w-full min-h-screen relative">
      <Navbar />
      <div className="relative z-10 flex flex-col">
        <Hero />
        <WhyAxis />
        <HowItWorks />
        <Mechanism />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}
