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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PlatformSection />
        <ProcessSection />
        <ScoresSection />
        <StandardSection />
        <ComparisonSection />
        <ReviewersSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
