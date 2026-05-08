"use client";

import { motion } from "framer-motion";

interface ReviewersProps {
  onApply: () => void;
}

export default function ReviewersSection({ onApply }: ReviewersProps) {
  return (
    <section id="reviewers" className="bg-zinc-50 border-y border-black/5 py-24 sm:py-32 lg:py-section-gap px-6 sm:px-10 lg:px-margin-edge overflow-hidden">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-20">
        <motion.div
          className="lg:col-span-7 space-y-6 sm:space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-label-sm text-accent-orange uppercase tracking-widest block text-[10px] sm:text-[11px]">
            FOR SENIOR ML/AI ENGINEERS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold leading-none tracking-tight">
            You know within <br /> 60 seconds.
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant font-light leading-relaxed max-w-xl">
            You&apos;ve been in enough interviews to know.
            The student who built something real —
            they talk about it differently.
            They remember the decisions. The tradeoffs. The failures.
          </p>
          <p className="text-base sm:text-lg text-on-surface-variant font-light leading-relaxed max-w-xl">
            That instinct is exactly what Pruv is built on.
            We&apos;re two founders building this from scratch —
            and we need 5 engineers to make it real.
          </p>
          <div className="pt-4 space-y-3">
            {[
              "Equity in Pruv",
              "Your name on the platform from day one",
              "A founding badge that never goes away",
              "Direct say in what the standard looks like",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-accent-orange flex-shrink-0" />
                <span className="text-sm sm:text-base text-on-surface-variant font-light">{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-5 flex flex-col items-center justify-center p-8 sm:p-12 glass-panel border-accent-orange/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-accent-orange text-3xl sm:text-4xl">
                shield_person
              </span>
            </div>
            <div>
              <p className="font-label-sm text-accent-orange uppercase tracking-widest text-[10px] sm:text-[11px] mb-2">
                5 spots. That&apos;s it.
              </p>
              <h3 className="font-headline-md text-xl sm:text-2xl">
                Apply for a <br /> Founding Spot
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant font-light">
              This is not a gig. <br /> It&apos;s a stake in something built from scratch.
            </p>
            <motion.button
              onClick={onApply}
              className="w-full bg-black/90 text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full font-label-sm uppercase tracking-widest font-bold text-[11px] sm:text-[12px] hover:bg-accent-orange transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}