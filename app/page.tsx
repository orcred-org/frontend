"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StandardSection from "@/components/StandardSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import PlatformSection from "@/components/PlatformSection";
import ProcessSection from "@/components/ProcessSection";
import ScoresSection from "@/components/ScoresSection";
import ComparisonSection from "@/components/ComparisonSection";
import ReviewersSection from "@/components/ReviewersSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const Cursor     = dynamic(() => import("@/components/Cursor"),     { ssr: false });
const PageLoader = dynamic(() => import("@/components/PageLoader"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const handleApply = () => router.push("/apply");

  return (
    <>
      {/* Entrance loader — elegant Orcred seal, 2s */}
      <PageLoader />

      {/* Thin orange scroll progress bar at top */}
      <ScrollProgress />

      {/* Custom orange dot cursor */}
      <Cursor />

      <Navbar />

      <main>
        {/* 1 · Brand statement — the hero */}
        <HeroSection onApply={handleApply} />

        {/* Thin editorial ticker — after hero, before story */}
        <MarqueeTicker />

        {/* 2 · The problem / the cost / the fix — sticky scroll story */}
        <StandardSection />

        {/* 3 · Platform — what Orcred is (3 editorial scroll panels) */}
        <PlatformSection />

        {/* Thin editorial ticker — between platform and process */}
        <MarqueeTicker />

        {/* 4 · Process — how the review works (dramatic full-height steps) */}
        <ProcessSection />

        {/* 5 · The Score — formal assessment framework */}
        <ScoresSection />

        {/* 6 · Why Orcred — comparison vs alternatives */}
        <ComparisonSection />

        {/* 7 · For Reviewers — apply to join the founding cohort */}
        <ReviewersSection onApply={handleApply} />

        {/* 8 · Final CTA */}
        <CtaSection onApply={handleApply} />
      </main>

      <Footer />
    </>
  );
}
