"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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

const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const handleApply = () => router.push("/apply");

  return (
    <>
      <Cursor />
      <Navbar onApply={handleApply} />
      <main>
        <HeroSection onApply={handleApply} />
        <PlatformSection />
        <ProcessSection />
        <ScoresSection />
        <StandardSection />
        <ComparisonSection />
        <ReviewersSection onApply={handleApply} />
        <CtaSection onApply={handleApply} />
      </main>
      <Footer />
    </>
  );
}