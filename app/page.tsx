"use client";

import { useState } from "react";

import { AboutZetGroep } from "@/components/AboutZetGroep";
import { Calculator } from "@/components/Calculator";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { UrgencyBar } from "@/components/UrgencyBar";
import { WhatWeDo } from "@/components/WhatWeDo";

export default function HomePage() {
  const [prefilledPrice, setPrefilledPrice] = useState(38500);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Hero />
        <UrgencyBar />
        <WhatWeDo />
        <Calculator onPriceChange={setPrefilledPrice} />
        <HowItWorks />
        <Pricing />
        <AboutZetGroep />
        <Faq />
        <Contact prefilledPrice={prefilledPrice} />
      </main>
      <Footer />
    </div>
  );
}
