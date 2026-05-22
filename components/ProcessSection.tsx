"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    index: "01",
    numeral: "I",
    label: "Step",
    title: "They Submit",
    headline: "The project\nand the person.",
    desc: "A real project. A written explanation of every decision — why they chose this architecture, what they tried that failed, what they'd do differently. No templates. No guided prompts.",
    detail: "Engineers who built something real write differently. Specific. Confident. Uncertain in the right places. The submission is already a signal.",
    accent: "The work\nspeaks first.",
    flip: false,
  },
  {
    index: "02",
    numeral: "II",
    label: "Core",
    title: "You Talk",
    headline: "45 minutes.\nYour judgment.",
    desc: "No script. Just you and the candidate and the work they say they built. You go wherever your instincts take you — the decision that seems too confident, the tradeoff they glossed over.",
    detail: "That instinct you've trusted in every technical interview — the one that fires within 60 seconds — now it has a formal home.",
    accent: "60\nseconds.",
    flip: true,
  },
  {
    index: "03",
    numeral: "III",
    label: "Final",
    title: "The Score Stands",
    headline: "Pass or fail.\nForever.",
    desc: "An Orcred Score they carry into every room. Backed by your sign-off. Something they can show any hiring manager and say: a real engineer reviewed this work and it passed.",
    detail: "Not everyone passes. That's what makes it mean something.",
    accent: "PASSED\nor FAILED.",
    flip: false,
  },
];

export default function ProcessSection() {
  return (
    <section id="process" style={{ backgroundColor: "#06090e" }}>

      {/* Section title rule */}
      <motion.div
        className="px-6 sm:px-10 lg:px-16 pt-24 pb-0 max-w-[1400px] mx-auto flex items-center gap-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
        <span
          className="font-label-sm uppercase tracking-[0.45em] text-[9px]"
          style={{ color: "rgba(235,225,205,0.25)" }}
        >
          Examination Procedure
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
      </motion.div>

      {/* Steps */}
      {steps.map((step, i) => (
        <ProcessStep key={step.numeral} step={step} i={i} />
      ))}

    </section>
  );
}

function ProcessStep({
  step,
  i,
}: {
  step: (typeof steps)[0];
  i: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      className="min-h-[88vh] flex items-center border-b px-6 sm:px-10 lg:px-16 py-20 relative overflow-hidden"
      style={{
        borderColor: "rgba(235,225,205,0.05)",
        backgroundColor: "#06090e",
      }}
    >
      {/* Giant watermark numeral */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(200px, 32vw, 440px)",
          lineHeight: 0.85,
          color: i === 1
            ? "rgba(235,69,17,0.05)"
            : "rgba(235,225,205,0.03)",
          right:  step.flip ? "auto" : "-1%",
          left:   step.flip ? "-1%" : "auto",
          bottom: "-6%",
          userSelect: "none",
        }}
        initial={{ opacity: 0, x: step.flip ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        {step.numeral}
      </motion.div>

      {/* Content grid */}
      <div className="w-full max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

        {/* Text block */}
        <div
          className={`lg:col-span-5 flex flex-col gap-7
            ${step.flip ? "lg:col-start-8 lg:order-2" : "lg:col-start-1 lg:order-1"}`}
        >
          {/* Chapter marker */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "13px",
                letterSpacing: "0.1em",
                color: "rgba(235,69,17,0.65)",
              }}
            >
              {step.index}
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
            <span
              className="font-label-sm uppercase tracking-[0.38em] text-[9px]"
              style={{ color: "rgba(235,69,17,0.65)" }}
            >
              {step.label}
            </span>
          </motion.div>

          {/* Sub-label */}
          <motion.p
            className="font-label-sm uppercase tracking-[0.28em] text-[10px]"
            style={{ color: "rgba(235,225,205,0.55)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.08 }}
          >
            {step.title}
          </motion.p>

          {/* Headline */}
          <motion.h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(34px, 4vw, 58px)",
              lineHeight: 1.05,
              color: "rgba(235,225,205,0.92)",
              whiteSpace: "pre-line",
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.05, delay: 0.14, ease }}
          >
            {step.headline}
          </motion.h2>

          {/* Orange rule */}
          <motion.div
            className="h-px bg-accent-orange w-8 opacity-70"
            initial={{ scaleX: 0, originX: "left" }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.28, ease }}
          />

          {/* Main description */}
          <motion.p
            className="text-[14px] sm:text-[15px] leading-[1.9] font-light"
            style={{ color: "rgba(235,225,205,0.70)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
          >
            {step.desc}
          </motion.p>

          {/* Detail — left-bordered quote */}
          <motion.p
            className="text-[13px] leading-[1.85] font-light pl-4"
            style={{
              color: "rgba(235,225,205,0.46)",
              borderLeft: "1px solid rgba(235,69,17,0.25)",
            }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.46, ease: "easeOut" }}
          >
            {step.detail}
          </motion.p>
        </div>

        {/* Typographic accent — right side (left when flipped) */}
        <motion.div
          className={`hidden lg:flex lg:col-span-5 items-center
            ${step.flip
              ? "lg:col-start-1 lg:order-1 justify-start"
              : "lg:col-start-7 lg:order-2 justify-end"}`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.18, ease: "easeOut" }}
        >
          <div className={step.flip ? "text-left" : "text-right"}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(36px, 5.5vw, 72px)",
                lineHeight: 1.1,
                color: i === 1
                  ? "rgba(235,69,17,0.38)"
                  : "rgba(235,225,205,0.18)",
                whiteSpace: "pre-line",
                userSelect: "none",
              }}
            >
              {step.accent}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
