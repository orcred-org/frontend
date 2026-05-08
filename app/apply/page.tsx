"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ApplyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 sm:px-10 lg:px-16 h-[72px] border-b border-black/5 flex-shrink-0 bg-white">
        <div className="font-bold text-2xl sm:text-3xl tracking-tighter text-black flex items-center gap-1.5">
          Pruv<span className="asymmetric-dot mb-3" />
        </div>
        <div className="flex items-center gap-6 sm:gap-10">
          <span className="hidden sm:block font-label-sm text-black/30 uppercase tracking-widest text-[10px]">
            Founding Reviewer Application
          </span>
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-label-sm text-black/50 hover:text-black transition-colors uppercase tracking-widest text-[11px]"
            whileHover={{ x: -2 }}
          >
            ← Back
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 lg:grid lg:grid-cols-[42%_58%]">

        {/* Left — sticky */}
        <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between px-8 sm:px-12 lg:px-16 py-10 lg:py-16 border-b lg:border-b-0 lg:border-r border-black/5 bg-white">
          <div>
            <div className="inline-block border border-accent-orange/30 text-accent-orange px-4 py-1 rounded-full font-label-sm tracking-[0.2em] uppercase text-[10px] mb-8">
              5 Founding Spots
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Be the<br />
              <span className="text-accent-orange">standard.</span>
            </h1>

            <p className="text-sm sm:text-base text-black/50 font-light leading-relaxed mb-3 max-w-sm">
              Two founders, one idea, and five seats at the table.
            </p>

            <p className="text-sm sm:text-base text-black/40 font-light leading-relaxed mb-10 max-w-sm">
              Pruv is building the verification standard for AI/ML engineers.
              We are looking for 5 senior engineers who know the difference between
              someone who built something and someone who ran something —
              and want to do something about it.
            </p>

            <div className="w-8 h-[1px] bg-accent-orange/40 mb-10" />

            <p className="font-label-sm text-black/30 uppercase tracking-widest text-[10px] mb-5">
              What you get
            </p>

            <div className="space-y-4">
              {[
                "Equity in Pruv",
                "Your name on the platform from day one",
                "A founding badge that never goes away",
                "Direct say in what the standard looks like",
              ].map((perk) => (
                <div key={perk} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-accent-orange mt-2 flex-shrink-0" />
                  <span className="text-sm text-black/50 font-light leading-relaxed">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-0 pt-8 border-t border-black/5">
            
          </div>
        </div>

        {/* Right — form */}
        <div className="px-8 sm:px-12 lg:px-16 py-10 lg:py-16">
          <p className="font-label-sm text-black/30 uppercase tracking-widest text-[10px] mb-8">
            Your Application
          </p>
          <iframe
            src="https://tally.so/embed/1ADkrO?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="1400"
            frameBorder="0"
            title="Founding Reviewer Application"
            className="w-full"
          />
        </div>
      </div>

      

    </div>
  );
}