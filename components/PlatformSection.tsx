"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function GitHubGrid() {
  const weeks = 26;
  const days = 7;

  const getColor = (i: number, j: number) => {
    const seed = (i * 3 + j * 7 + i * j * 2) % 20;
    if (seed === 7) return "#eb4511";
    if (seed === 14) return "#eb4511";
    if (seed < 4) return "#1a1a1a";
    if (seed < 10) return "#222";
    if (seed < 16) return "#2a2a2a";
    return "#1e1e1e";
  };

  return (
    <div className="w-full bg-[#0d0d0d] aspect-video relative flex flex-col justify-center items-center p-8 sm:p-12 overflow-hidden">
      <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
        <span className="font-label-sm text-white/20 text-[9px] uppercase tracking-widest">Contribution Activity</span>
        <span className="font-label-sm text-white/20 text-[9px] uppercase tracking-widest">26 weeks</span>
      </div>

      <div className="flex gap-[3px]">
        {Array.from({ length: weeks }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {Array.from({ length: days }).map((_, j) => (
              <motion.div
                key={j}
                className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-[2px]"
                style={{ backgroundColor: getColor(i, j) }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: (i * days + j) * 0.002 }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-8 right-8">
        <div className="w-full h-[0.5px] bg-white/5 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-accent-orange opacity-60" />
            <span className="font-label-sm text-white/25 text-[9px]">Real signal is rare.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-[2px] bg-[#2a2a2a]" />
            <span className="font-label-sm text-white/15 text-[9px]">noise</span>
            <div className="w-2 h-2 rounded-[2px] bg-accent-orange/60 ml-2" />
            <span className="font-label-sm text-white/15 text-[9px]">signal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewTimer() {
  return (
    <div className="w-full bg-[#0d0d0d] aspect-video relative flex flex-col justify-center items-center overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(235,69,17,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top label */}
      <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
        <span className="font-label-sm text-white/20 text-[9px] uppercase tracking-widest">
          Live Review Session
        </span>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent-orange"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-label-sm text-accent-orange/60 text-[9px] uppercase tracking-widest">
            In Progress
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="font-bold tracking-tighter text-white"
          style={{ fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 1 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          45<span className="text-accent-orange/80">:</span>00
        </motion.div>
        <motion.div
          className="font-label-sm text-white/20 text-[9px] uppercase tracking-[0.4em]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          Minutes · One Engineer · Your Work
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-16 left-8 right-8">
        <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-orange/40 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "35%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        </div>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-6 left-8 right-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-orange opacity-50" />
          <span className="font-label-sm text-white/25 text-[9px] uppercase tracking-widest">
            60 seconds is all it takes to separate builders from browsers.
          </span>
        </div>
      </div>
    </div>
  );
}

function Certificate() {
  return (
    <div className="w-full bg-[#0d0d0d] aspect-video flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(235,69,17,0.05) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative w-[72%] max-w-[400px] border border-white/5 bg-[#111] p-6 sm:p-8"
        whileInView={{ opacity: [0.4, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-between items-start mb-5 sm:mb-6">
          <div>
            <div className="font-bold text-white text-base sm:text-lg tracking-tighter flex items-center gap-1">
              Pruv
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-orange mb-1" />
            </div>
            <div className="font-label-sm text-white/20 text-[9px] uppercase tracking-widest mt-0.5">
              Verification Certificate
            </div>
          </div>
          <div className="text-right">
            <div className="font-label-sm text-white/20 text-[9px] uppercase tracking-widest">Score</div>
            <div className="text-accent-orange font-bold text-2xl sm:text-3xl tracking-tighter">87</div>
          </div>
        </div>

        <div className="w-full h-[0.5px] bg-white/5 mb-4 sm:mb-5" />

        <div className="space-y-3 sm:space-y-3.5 mb-4 sm:mb-5">
          {[
            { label: "Technical Depth", score: 91, width: "91%" },
            { label: "Communication", score: 84, width: "84%" },
            { label: "Reproducibility", score: 88, width: "88%" },
            { label: "Originality", score: 79, width: "79%" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-white/30 text-[9px] uppercase tracking-widest">
                  {item.label}
                </span>
                <span className="font-label-sm text-white/40 text-[9px]">{item.score}</span>
              </div>
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-orange/60 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: item.width }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-[0.5px] bg-white/5 mb-3 sm:mb-4" />

        <div className="flex justify-between items-center">
          <div>
            <div className="font-label-sm text-white/15 text-[8px] uppercase tracking-widest">
              Reviewed by
            </div>
            <div className="font-label-sm text-white/30 text-[9px] mt-0.5">
              Senior ML Engineer · Verified
            </div>
          </div>
          <div className="border border-accent-orange/30 px-2 py-1">
            <span className="font-label-sm text-accent-orange text-[8px] uppercase tracking-widest">
              Passed
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PlatformSection() {
  return (
    <section id="platform" className="relative py-24 sm:py-32 lg:py-section-gap overflow-hidden">

      {/* Panel 1 */}
      <div className="flex items-center px-6 sm:px-10 lg:px-margin-edge mb-20 sm:mb-28 lg:mb-32">
        <div className="max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <FadeIn className="md:col-span-6 space-y-6 lg:space-y-10">
            <span className="font-label-sm text-accent-orange tracking-widest text-[10px] sm:text-[11px]">
              01 / THE REALITY
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold leading-none tracking-tight">
              More students are <br /> building than ever.
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-md font-light leading-relaxed">
              That&apos;s genuinely exciting. But when everyone has an AI project
              on their resume, the ones who really built something
              get lost in the crowd.
            </p>
          </FadeIn>
          <FadeIn delay={0.15} className="md:col-span-6 flex justify-center md:justify-end">
            <GitHubGrid />
          </FadeIn>
        </div>
      </div>

      {/* Panel 2 */}
      <div className="flex items-center px-6 sm:px-10 lg:px-margin-edge mb-20 sm:mb-28 lg:mb-32">
        <div className="max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <FadeIn className="md:col-span-6 order-2 md:order-1 flex justify-center md:justify-start">
            <ReviewTimer />
          </FadeIn>
          <FadeIn delay={0.15} className="md:col-span-5 md:col-start-8 order-1 md:order-2 space-y-6 lg:space-y-10">
            <span className="font-label-sm text-accent-orange tracking-widest text-[10px] sm:text-[11px]">
              02 / THE GAP
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold leading-none tracking-tight">
              A conversation <br /> reveals everything.
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant font-light leading-relaxed">
              Ask a student why they chose that architecture.
              Why that loss function. Why that tradeoff.
              The ones who built it for real —
              you&apos;ll know in 60 seconds.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Panel 3 */}
      <div className="flex items-center px-6 sm:px-10 lg:px-margin-edge">
        <div className="max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <FadeIn className="md:col-span-5 space-y-6 lg:space-y-10">
            <span className="font-label-sm text-accent-orange tracking-widest text-[10px] sm:text-[11px]">
              03 / THE CREDENTIAL
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold leading-none tracking-tight">
              Now there&apos;s <br /> proof.
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant font-light leading-relaxed">
              Pruv turns that conversation into a score.
              A verified badge backed by a senior engineer&apos;s sign-off.
              Something a student can carry into any room and say —
              a real engineer reviewed this. It passed.
            </p>
          </FadeIn>
          <FadeIn delay={0.15} className="md:col-span-7 flex justify-end">
            <Certificate />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}