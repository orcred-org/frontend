"use client";

import HeroSection from "@/components/HeroSection";
import StandardSection from "@/components/StandardSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import PlatformSection from "@/components/PlatformSection";
import ProcessSection from "@/components/ProcessSection";
import ScoresSection from "@/components/ScoresSection";
import ComparisonSection from "@/components/ComparisonSection";
import CtaSection from "@/components/CtaSection";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />

      <main>
        {/* 1 · Brand statement — the hero */}
        <HeroSection onApply={() => {}} />

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

        {/* 7 · Final CTA */}
        <CtaSection />
      </main>
    </>
  );
}
