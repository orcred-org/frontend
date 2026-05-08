"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlatformSection from "@/components/PlatformSection";
import ProcessSection from "@/components/ProcessSection";
import ScoresSection from "@/components/ScoresSection";
import StandardSection from "@/components/StandardSection";
import ComparisonSection from "@/components/ComparisonSection";
import ReviewersSection from "@/components/ReviewersSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import Cursor from "@/components/Cursor";

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <Cursor />
      <Navbar onApply={() => setFormOpen(true)} />
      <main>
        <HeroSection onApply={() => setFormOpen(true)} />
        <PlatformSection />
        <ProcessSection />
        <ScoresSection />
        <StandardSection />
        <ComparisonSection />
        <ReviewersSection onApply={() => setFormOpen(true)} />
        <CtaSection onApply={() => setFormOpen(true)} />
      </main>
      <Footer />
      <ApplicationForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}