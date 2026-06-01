"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroProps { onApply: () => void; }

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 1.2, delay, ease } },
});
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 1.4, delay, ease } },
});

const stats = [
  { value: "40–60%", label: "Pass rate, by design"            },
  { value: "45 min", label: "One live review session"          },
  { value: "24 hrs", label: "Score and credential delivered"   },
];

export default function HeroSection({ onApply: _ }: HeroProps) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&display=swap";
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  return (
    <section
      id="hero-section"
      className="relative flex flex-col"
      style={{ backgroundColor: "var(--bg-page)", minHeight: "100svh" }}
    >
      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[960px] mx-auto px-6 sm:px-10 lg:px-16 text-center"
        style={{ paddingTop: "clamp(80px, 12vh, 140px)", paddingBottom: "clamp(40px, 6vh, 80px)" }}>

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-2.5 mb-10"
          variants={fadeIn(0.1)} initial="hidden" animate="show"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#eb4511" }} />
          <span className="font-label-sm uppercase tracking-[0.35em] text-[10px]" style={{ color: "#eb4511" }}>
            AI Verification Standard
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mb-7"
          style={{
            fontSize:      "clamp(44px, 7vw, 84px)",
            fontWeight:    700,
            letterSpacing: "-0.03em",
            lineHeight:    1.05,
            color:         "#0f0d0c",
            maxWidth:      "820px",
          }}
          variants={fadeUp(0.18)} initial="hidden" animate="show"
        >
          The verification standard<br />
          <span style={{ color: "#eb4511" }}>for AI engineers.</span>
        </motion.h1>

        {/* Italic serif tagline */}
        <motion.p
          className="mb-12"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle:  "italic",
            fontWeight: 300,
            fontSize:   "clamp(18px, 2.2vw, 26px)",
            lineHeight: 1.5,
            color:      "rgba(15,13,12,0.55)",
            maxWidth:   "560px",
          }}
          variants={fadeIn(0.38)} initial="hidden" animate="show"
        >
          One conversation. One score.<br />One credential that holds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          variants={fadeIn(0.52)} initial="hidden" animate="show"
        >
          <Link
            href="/get-verified"
            className="inline-flex items-center px-8 py-3.5 font-label-sm uppercase tracking-[0.18em] text-[11px]"
            style={{ backgroundColor: "#eb4511", color: "#ffffff", borderRadius: "100px", transition: "opacity 0.15s ease" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Apply for Verification
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center px-8 py-3.5 font-label-sm uppercase tracking-[0.18em] text-[11px]"
            style={{ backgroundColor: "transparent", border: "1px solid rgba(15,13,12,0.22)", color: "#0f0d0c", borderRadius: "100px", transition: "opacity 0.15s ease" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            How it works
          </Link>
        </motion.div>
      </div>

      {/* ── Stats row — anchored to bottom of fold ── */}
      <motion.div
        className="w-full max-w-[960px] mx-auto px-6 sm:px-10 lg:px-16"
        style={{ paddingBottom: "clamp(36px, 5vh, 64px)" }}
        variants={fadeIn(0.7)} initial="hidden" animate="show"
      >
        <div
          className="grid grid-cols-3"
          style={{ borderTop: "1px solid rgba(15,13,12,0.1)" }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="pt-6 text-center"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid rgba(15,13,12,0.1)" : "none",
                padding:     "24px 16px 0",
              }}
            >
              <div style={{
                fontSize:      "clamp(26px, 3.2vw, 42px)",
                fontWeight:    700,
                color:         "#0f0d0c",
                letterSpacing: "-0.03em",
                lineHeight:    1,
                marginBottom:  "8px",
              }}>
                {s.value}
              </div>
              <div
                className="font-label-sm uppercase tracking-[0.2em] text-[9px]"
                style={{ color: "rgba(15,13,12,0.42)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
