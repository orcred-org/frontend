"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

const story = [
  {
    numeral: "I",
    eyebrow: "The Problem",
    headline: "No one can tell\nthe difference.",
    body: "Someone spent six months building something real. Someone else spent a weekend prompting ChatGPT. Right now, their portfolios look identical.",
  },
  {
    numeral: "II",
    eyebrow: "The Cost",
    headline: "Real builders\nare losing.",
    body: "Hiring managers can't see what's under the surface. GitHub shows commits. Certificates show course completions. Neither shows understanding.",
  },
  {
    numeral: "III",
    eyebrow: "The Fix",
    headline: "45 minutes\nchanges that.",
    body: "One conversation with a senior engineer who has seen the difference a thousand times. One score. One credential that holds.",
  },
];

/* ─── Light mode: three-column editorial grid ─── */
function EditorialGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="story"
      ref={ref}
      style={{ backgroundColor: "var(--bg-page)" }}
      className="px-6 sm:px-10 lg:px-16 py-24 sm:py-32"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section label */}
        <motion.div
          className="flex items-center gap-5 mb-20"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.45em] text-[9px]"
            style={{ color: "var(--fg-faint)" }}
          >
            The Case
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {story.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-6 px-8 py-2"
              style={{
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Roman numeral */}
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(48px, 5vw, 72px)",
                  lineHeight: 1,
                  color: "var(--border-strong)",
                }}
              >
                {item.numeral}
              </span>

              {/* Eyebrow */}
              <p
                className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
                style={{ color: "var(--orange)" }}
              >
                {item.eyebrow}
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(28px, 3vw, 42px)",
                  lineHeight: 1.1,
                  color: "var(--fg)",
                  whiteSpace: "pre-line",
                }}
              >
                {item.headline}
              </h2>

              {/* Rule */}
              <div className="w-8 h-px" style={{ background: "#eb4511", opacity: 0.7 }} />

              {/* Body */}
              <p
                className="text-[14px] font-light leading-[1.85]"
                style={{ color: "var(--fg-muted)" }}
              >
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── Dark mode: original sticky scroll animation ─── */
function StickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const op1 = useTransform(scrollYProgress, [0,    0.08,  0.29,  0.38], [0, 1, 1, 0]);
  const y1  = useTransform(scrollYProgress, [0,    0.08,  0.29,  0.38], [50, 0, 0, -50]);
  const op2 = useTransform(scrollYProgress, [0.35, 0.43,  0.60,  0.68], [0, 1, 1, 0]);
  const y2  = useTransform(scrollYProgress, [0.35, 0.43,  0.60,  0.68], [50, 0, 0, -50]);
  const op3 = useTransform(scrollYProgress, [0.65, 0.73,  0.92,  1   ], [0, 1, 1, 1]);
  const y3  = useTransform(scrollYProgress, [0.65, 0.73,  0.92,  1   ], [50, 0, 0,  0]);

  const cards = [
    { op: op1, y: y1 },
    { op: op2, y: y2 },
    { op: op3, y: y3 },
  ];

  return (
    <div
      id="story"
      ref={containerRef}
      style={{ height: "270vh", backgroundColor: "var(--bg-page)", position: "relative" }}
    >
      <div
        className="sticky top-[68px]"
        style={{ height: "calc(100vh - 68px)", overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 55% 50% at 50% 50%, var(--orange-tint) 0%, transparent 70%)",
          }}
        />

        <div className="absolute top-10 left-0 right-0 flex items-center justify-center gap-4 px-6">
          <div className="w-10 h-px" style={{ background: "var(--border)" }} />
          <span className="font-label-sm uppercase tracking-[0.45em] text-[9px]" style={{ color: "var(--fg-faint)" }}>
            The Standard
          </span>
          <div className="w-10 h-px" style={{ background: "var(--border)" }} />
        </div>

        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-28"
            style={{ opacity: card.op, y: card.y }}
          >
            <div className="max-w-3xl mx-auto w-full">
              <p className="font-label-sm uppercase tracking-[0.48em] text-[9px] mb-7" style={{ color: "var(--orange-faint)" }}>
                {story[i].eyebrow}
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 7.5vw, 102px)",
                  lineHeight: 1.06,
                  color: "var(--fg)",
                  whiteSpace: "pre-line",
                  letterSpacing: "-0.01em",
                }}
              >
                {story[i].headline}
              </h2>
              <div className="flex justify-center my-8">
                <div className="w-8 h-px opacity-60" style={{ background: "#eb4511" }} />
              </div>
              <p className="text-[14px] sm:text-[15px] font-light leading-[1.9] max-w-md mx-auto" style={{ color: "var(--fg-muted)" }}>
                {story[i].body}
              </p>
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2">
          <span className="font-label-sm uppercase tracking-[0.45em] text-[8px]" style={{ color: "var(--border-strong)" }}>
            scroll
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Export: dark mode only — light mode handled by PlatformSection ─── */
export default function StandardSection() {
  const { theme } = useTheme();
  if (theme === "light") return null;
  return <StickyScroll />;
}
