"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const story = [
  {
    eyebrow: "The Problem",
    headline: "No one can tell\nthe difference.",
    body: "Someone spent six months building something real. Someone else spent a weekend prompting ChatGPT. Right now, their portfolios look identical.",
  },
  {
    eyebrow: "The Cost",
    headline: "Real builders\nare losing.",
    body: "Hiring managers can't see what's under the surface. GitHub shows commits. Certificates show course completions. Neither shows understanding.",
  },
  {
    eyebrow: "The Fix",
    headline: "45 minutes\nchanges that.",
    body: "One conversation with a senior engineer who has seen the difference a thousand times. One score. One credential that holds.",
  },
];

export default function StandardSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ── Each statement occupies ~1/3 of the scroll range with overlap ── */
  const op1  = useTransform(scrollYProgress, [0,    0.08,  0.29,  0.38], [0, 1, 1, 0]);
  const y1   = useTransform(scrollYProgress, [0,    0.08,  0.29,  0.38], [50, 0, 0, -50]);

  const op2  = useTransform(scrollYProgress, [0.35, 0.43,  0.60,  0.68], [0, 1, 1, 0]);
  const y2   = useTransform(scrollYProgress, [0.35, 0.43,  0.60,  0.68], [50, 0, 0, -50]);

  const op3  = useTransform(scrollYProgress, [0.65, 0.73,  0.92,  1   ], [0, 1, 1, 1]);
  const y3   = useTransform(scrollYProgress, [0.65, 0.73,  0.92,  1   ], [50, 0, 0,  0]);

  /* ── Bottom progress line ── */
  const lineW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const cards = [
    { op: op1, y: y1 },
    { op: op2, y: y2 },
    { op: op3, y: y3 },
  ];

  return (
    <div
      ref={containerRef}
      style={{ height: "270vh", backgroundColor: "#06090e", position: "relative" }}
    >
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Ambient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(235,69,17,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Section marker — top */}
        <div className="absolute top-10 left-0 right-0 flex items-center justify-center gap-4 px-6">
          <div className="w-10 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.45em] text-[9px]"
            style={{ color: "rgba(235,225,205,0.2)" }}
          >
            The Standard
          </span>
          <div className="w-10 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
        </div>

        {/* Story cards — stacked, driven by scroll */}
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-28"
            style={{ opacity: card.op, y: card.y }}
          >
            <div className="max-w-3xl mx-auto w-full">
              {/* Eyebrow */}
              <p
                className="font-label-sm uppercase tracking-[0.48em] text-[9px] mb-7"
                style={{ color: "rgba(235,69,17,0.65)" }}
              >
                {story[i].eyebrow}
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 7.5vw, 102px)",
                  lineHeight: 1.06,
                  color: "rgba(235,225,205,0.92)",
                  whiteSpace: "pre-line",
                  letterSpacing: "-0.01em",
                }}
              >
                {story[i].headline}
              </h2>

              {/* Rule */}
              <div className="flex justify-center my-8">
                <div className="w-8 h-px opacity-60" style={{ background: "#eb4511" }} />
              </div>

              {/* Body */}
              <p
                className="text-[14px] sm:text-[15px] font-light leading-[1.9] max-w-md mx-auto"
                style={{ color: "rgba(235,225,205,0.38)" }}
              >
                {story[i].body}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Scroll nudge */}
        <div
          className="absolute bottom-9 left-1/2 -translate-x-1/2"
        >
          <span
            className="font-label-sm uppercase tracking-[0.45em] text-[8px]"
            style={{ color: "rgba(235,225,205,0.12)" }}
          >
            scroll
          </span>
        </div>

        {/* Progress line — bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px]"
          style={{ width: lineW, background: "rgba(235,69,17,0.38)" }}
        />
      </div>
    </div>
  );
}
