"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

interface HeroProps {
  onApply: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 1.3, delay, ease } },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 1.5, delay, ease } },
});

const stats = [
  { value: "40–60%", label: "Pass rate, by design" },
  { value: "45 min", label: "One live review session" },
  { value: "24 hrs", label: "Score and credential delivered" },
];

export default function HeroSection({ onApply }: HeroProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap";
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  /* ── Light mode: editorial split hero ── */
  if (!isDark) {
    return (
      <section
        id="hero-section"
        className="mt-[-80px] relative"
        style={{ backgroundColor: "var(--bg-page)", minHeight: "100svh" }}
      >
        {/*
          Dark right-half background — absolutely positioned so it bleeds
          all the way to the right viewport edge regardless of max-width.
          Width formula:
            • below 1400 px: 41.666vw  = 5/12 of viewport (matches the grid column)
            • above 1400 px: calc(50vw - 116.67px)  = right-margin + col-width
              (1400px × 5/12 = 583.33px;  margin = (vw-1400)/2;
               total = vw/2 - 700 + 583.33 = 50vw - 116.67px)
        */}
        <div
          className="absolute inset-y-0 right-0 hidden lg:block"
          style={{ width: "max(41.666vw, calc(50vw - 116.67px))", backgroundColor: "#0f0d0c" }}
        />

        {/* Centered content grid — sits above the absolute bg */}
        <div
          className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12"
          style={{ minHeight: "100svh" }}
        >

          {/* ── Left: text ── */}
          <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-10 lg:px-16 pt-36 pb-12 lg:pt-0 lg:pb-0">

            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-2.5 mb-8"
              variants={fadeIn(0.1)}
              initial="hidden"
              animate="show"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#eb4511" }} />
              <span
                className="font-label-sm uppercase tracking-[0.3em] text-[10px]"
                style={{ color: "#eb4511" }}
              >
                AI Verification Standard
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="mb-6"
              style={{
                fontSize: "clamp(36px, 4.5vw, 62px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "#0f0d0c",
              }}
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="show"
            >
              The verification standard<br />
              <span style={{ color: "#eb4511" }}>for AI engineers.</span>
            </motion.h1>

            {/* Body */}
            <motion.p
              className="mb-10"
              style={{
                fontSize: "clamp(15px, 1.3vw, 17px)",
                lineHeight: 1.8,
                color: "#2c2926",
                maxWidth: "520px",
              }}
              variants={fadeUp(0.32)}
              initial="hidden"
              animate="show"
            >
              A live technical review with a senior engineer who has read your code,
              watched your walkthrough, and knows exactly what to ask.
              One conversation. One score. One credential that holds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              variants={fadeIn(0.45)}
              initial="hidden"
              animate="show"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-label-sm uppercase tracking-[0.18em] text-[11px] transition-all duration-200"
                style={{ backgroundColor: "#eb4511", color: "#ffffff", border: "1px solid #eb4511" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "transparent";
                  el.style.setProperty("color", "#eb4511", "important");
                  el.style.borderColor = "#eb4511";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "#eb4511";
                  el.style.setProperty("color", "#ffffff", "important");
                  el.style.borderColor = "#eb4511";
                }}
              >
                Apply for Verification
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-label-sm uppercase tracking-[0.18em] text-[11px] transition-all duration-200"
                style={{ backgroundColor: "transparent", border: "1px solid #0f0d0c" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "#0f0d0c";
                  el.style.setProperty("color", "#ffffff", "important");
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "transparent";
                  el.style.setProperty("color", "#0f0d0c", "important");
                }}
              >
                How it works
              </Link>
            </motion.div>

            {/* ── Mobile / tablet stats strip (hidden on lg+) ── */}
            <motion.div
              className="flex lg:hidden gap-0 mt-10 border-t"
              style={{ borderColor: "rgba(15,13,12,0.14)" }}
              variants={fadeIn(0.55)}
              initial="hidden"
              animate="show"
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex-1 pt-6 pr-4"
                  style={{ borderRight: i < stats.length - 1 ? "1px solid rgba(15,13,12,0.14)" : "none", paddingRight: i < stats.length - 1 ? "16px" : 0, marginRight: i < stats.length - 1 ? "16px" : 0 }}
                >
                  <div
                    style={{
                      fontSize: "clamp(20px, 4.5vw, 28px)",
                      fontWeight: 700,
                      color: "#0f0d0c",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="font-label-sm uppercase tracking-[0.22em] text-[8px]"
                    style={{ color: "rgba(15,13,12,0.45)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── Right: dark stats panel (desktop only — bg from absolute div above) ── */}
          <motion.div
            className="hidden lg:flex lg:col-span-5 flex-col justify-center px-12 xl:px-16 gap-0"
            variants={fadeIn(0.3)}
            initial="hidden"
            animate="show"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="py-10 xl:py-12"
                style={{ borderBottom: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
              >
                <div
                  style={{
                    fontSize: "clamp(44px, 4.5vw, 64px)",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: "10px",
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="font-label-sm uppercase tracking-[0.25em] text-[10px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    );
  }

  /* ── Dark mode: original, completely unchanged ── */
  const c = {
    bg:         "var(--bg-page)",
    radial:     "var(--orange-tint)",
    bottomRule: "var(--border)",
    h1:         "var(--fg)",
    h1italic:   "var(--fg-muted)",
    ruleLine:   "var(--border-strong)",
    body:       "var(--fg-muted)",
    bodySpan:   "var(--fg)",
  };

  return (
    <section
      id="hero-section"
      className="mt-[-72px] relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: c.bg, transition: "background-color 0.45s ease" }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 38%, ${c.radial} 0%, transparent 70%)`,
          transition: "background 0.45s ease",
        }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.028,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: c.bottomRule }} />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl mx-auto pt-[120px] pb-[80px]">
        <motion.h1
          className="mb-4 sm:mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "clamp(34px, 5.8vw, 76px)",
            lineHeight: 1.1,
            letterSpacing: "0.01em",
            color: c.h1,
            transition: "color 0.45s ease",
          }}
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="show"
        >
          The Verification Standard
        </motion.h1>
        <motion.p
          className="mb-9 sm:mb-11"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(22px, 3.8vw, 50px)",
            lineHeight: 1.15,
            color: c.h1italic,
            transition: "color 0.45s ease",
          }}
          variants={fadeUp(0.42)}
          initial="hidden"
          animate="show"
        >
          for AI/ML Intelligence.
        </motion.p>
        <motion.div
          className="flex items-center gap-4 mb-9 sm:mb-11 w-full max-w-[260px]"
          variants={fadeIn(0.5)}
          initial="hidden"
          animate="show"
        >
          <div className="flex-1 h-px" style={{ background: c.ruleLine, transition: "background 0.45s ease" }} />
          <div className="w-[5px] h-[5px] rotate-45 border" style={{ borderColor: "var(--orange-faint)" }} />
          <div className="flex-1 h-px" style={{ background: c.ruleLine, transition: "background 0.45s ease" }} />
        </motion.div>
        <motion.p
          className="leading-[1.9] text-[13px] sm:text-[15px] font-[300] max-w-[480px] mb-0"
          style={{ color: c.body, transition: "color 0.45s ease" }}
          variants={fadeUp(0.55)}
          initial="hidden"
          animate="show"
        >
          You spent months building something real.
          Someone else spent a weekend prompting ChatGPT.
          Right now, no one can tell the difference.{" "}
          <span style={{ color: c.bodySpan, fontWeight: 400, transition: "color 0.45s ease" }}>
            Orcred can.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
