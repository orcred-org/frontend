"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import HeroSection from "@/components/HeroSection";
import PlatformSection from "@/components/PlatformSection";
import ProcessSection from "@/components/ProcessSection";
import ScoresSection from "@/components/ScoresSection";
import ComparisonSection from "@/components/ComparisonSection";
import CtaSection from "@/components/CtaSection";
import ScrollProgress from "@/components/ScrollProgress";

const DASHBOARD_MAP: Record<string, string> = {
  student: '/dashboard/student',
  reviewer: '/dashboard/reviewer',
  admin: '/dashboard/admin',
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: profile } = await supabase
        .from('users')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      const dest = DASHBOARD_MAP[profile?.account_type ?? ''];
      if (dest) router.replace(dest);
    });
  }, [router]);

  return (
    <>
      <ScrollProgress />

      <main>
        {/* 1 · Brand statement — the hero */}
        <HeroSection onApply={() => {}} />

        {/* 2 · The problem / the cost / the fix */}
        <PlatformSection />

        {/* 3 · The Score — formal assessment framework */}
        <ScoresSection />

        {/* 4 · Process — how the review works */}
        <ProcessSection />

        {/* 5 · Why Orcred — comparison vs alternatives */}
        <ComparisonSection />

        {/* 6 · Final CTA */}
        <CtaSection />
      </main>
    </>
  );
}
