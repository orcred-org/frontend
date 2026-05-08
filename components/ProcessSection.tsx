"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "They Submit",
    desc: "A real project. A written explanation of every decision they made. No templates. No guided prompts.",
    highlight: false,
  },
  {
    num: "02",
    title: "You Talk",
    desc: "45 minutes. No script. Just you and the student and the work they say they built. Your judgment. Your call.",
    highlight: true,
  },
  {
    num: "03",
    title: "The Score Stands",
    desc: "Pass or fail. A Pruv Score they carry forever — or a signal to go deeper before they're ready.",
    highlight: false,
  },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="process" className="py-24 sm:py-32 lg:py-section-gap px-6 sm:px-10 lg:px-margin-edge max-w-container-max mx-auto">
      <motion.div
        className="mb-16 sm:mb-24 lg:mb-32 max-w-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="font-label-sm text-accent-orange tracking-[0.3em] uppercase text-[10px] sm:text-[11px]">
          How It Works
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold mt-4 sm:mt-6 leading-none italic tracking-tight">
          One session. <br />
          One score. <br />
          One credential that holds.
        </h2>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-24 relative">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="relative"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
          >
            <span className="font-display-xl text-7xl sm:text-8xl lg:text-9xl text-black/[0.03] absolute -top-10 sm:-top-14 lg:-top-16 -left-4 pointer-events-none">
              {step.num}
            </span>
            <div className={`pt-10 sm:pt-12 ${step.highlight ? "border-t-[1.5px] border-accent-orange" : "border-t-[0.5px] border-black/20"}`}>
              <h3 className={`font-headline-md mb-4 sm:mb-6 uppercase text-lg sm:text-xl tracking-tighter ${step.highlight ? "text-accent-orange" : ""}`}>
                {step.title}
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}