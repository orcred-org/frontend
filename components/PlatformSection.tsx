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
            <motion.div
              className="w-full max-w-sm sm:max-w-md lg:max-w-xl aspect-[4/5] glass-panel relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-300 opacity-50" />
              <img
                alt="Abstract 3D Shape"
                className="w-full h-full object-cover mix-blend-overlay grayscale hover:scale-110 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSpDVR2ZcM25uB6_CyQJmdRf_tRC9MnpUBLThbRzLJYoiOslYg5wechppKsnhvLeOseAYKKNGTzMW8HHOHDlNWiqduKPpFC-ShBVlF223ShRUkfsr_dtX0YKDQ62fFxekW2sJuipbMK7a7AkhuGaZ5OSTZstGvi4uNUMleGy6FhQ4lpcbEobsSKkiWt_wyn-57XQd2RWbuhtdpnNQn2kmcNh0U6-7MvsQAsw6LkKFdmtosYfDVjvcFMgANx1F0uS6K-3TRD8MKLN8"
              />
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                <div className="w-10 sm:w-12 h-0.5 bg-accent-orange mb-3 sm:mb-4" />
                <span className="font-label-sm text-black text-[10px] sm:text-[11px]">SIGNAL_LOST.OBJ</span>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>

      {/* Panel 2 */}
      <div className="flex items-center px-6 sm:px-10 lg:px-margin-edge mb-20 sm:mb-28 lg:mb-32">
        <div className="max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <FadeIn className="md:col-span-6 order-2 md:order-1 flex justify-center md:justify-start">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl aspect-square glass-panel relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange/5 to-transparent" />
              <motion.div
                className="w-40 sm:w-52 lg:w-64 h-40 sm:h-52 lg:h-64 border border-black/5 rounded-full flex items-center justify-center p-6 sm:p-8"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-full border border-black/10 rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-black/5 rounded-full backdrop-blur-3xl" />
                </div>
              </motion.div>
              <div className="absolute top-8 right-8 sm:top-12 sm:right-12 font-display-xl text-7xl sm:text-9xl text-black/5">
                02
              </div>
            </div>
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
            <div className="w-full bg-black aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>
              <div className="text-white font-bold text-2xl sm:text-4xl lg:text-6xl tracking-widest mix-blend-difference text-center px-4">
                VERIFIED.
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}