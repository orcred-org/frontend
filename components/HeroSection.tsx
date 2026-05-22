"use client";

import { useEffect } from "react";
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

export default function HeroSection({ onApply }: HeroProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* Load Cormorant Garamond — used by CFA, law firms, exam bodies */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap";
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  // ── Palette switches on theme ──
  const c = isDark ? {
    bg:          "#06090e",
    radial:      "rgba(235,69,17,0.05)",
    sealOuter:   "rgba(235,69,17,0.4)",
    sealInner:   "rgba(235,69,17,0.18)",
    bottomRule:  "rgba(235,225,205,0.07)",
    label:       "rgba(235,225,205,0.32)",
    h1:          "rgba(235,225,205,0.95)",
    h1italic:    "rgba(235,225,205,0.48)",
    ruleLine:    "rgba(235,225,205,0.1)",
    body:        "rgba(235,225,205,0.4)",
    bodySpan:    "rgba(235,225,205,0.68)",
    linkText:    "rgba(235,225,205,0.28)",
    linkBorder:  "rgba(235,225,205,0.15)",
    linkHover:   "rgba(235,225,205,0.55)",
    statBorder:  "rgba(235,225,205,0.08)",
    statDivider: "rgba(235,225,205,0.07)",
    statNum:     "rgba(235,225,205,0.82)",
    statLabel:   "rgba(235,225,205,0.22)",
  } : {
    bg:          "#faf7f2",
    radial:      "rgba(235,69,17,0.06)",
    sealOuter:   "rgba(235,69,17,0.38)",
    sealInner:   "rgba(235,69,17,0.16)",
    bottomRule:  "rgba(26,22,20,0.07)",
    label:       "rgba(26,22,20,0.32)",
    h1:          "rgba(26,22,20,0.92)",
    h1italic:    "rgba(26,22,20,0.42)",
    ruleLine:    "rgba(26,22,20,0.1)",
    body:        "rgba(26,22,20,0.42)",
    bodySpan:    "rgba(26,22,20,0.72)",
    linkText:    "rgba(26,22,20,0.32)",
    linkBorder:  "rgba(26,22,20,0.15)",
    linkHover:   "rgba(26,22,20,0.62)",
    statBorder:  "rgba(26,22,20,0.08)",
    statDivider: "rgba(26,22,20,0.07)",
    statNum:     "rgba(26,22,20,0.82)",
    statLabel:   "rgba(26,22,20,0.28)",
  };

  return (
    <section
      id="hero-section"
      className="min-h-[100vh] mt-[-72px] relative flex flex-col items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: c.bg, transition: "background-color 0.45s ease" }}
    >

      {/* Subtle radial warmth */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 38%, ${c.radial} 0%, transparent 70%)`,
          transition: "background 0.45s ease",
        }}
      />

      {/* Paper grain */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.028,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: c.bottomRule, transition: "background 0.45s ease" }} />

      {/* ══ CONTENT ══ */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl mx-auto py-[96px]">

        {/* Formal concentric seal */}
        <motion.div
          className="mb-10 sm:mb-12"
          variants={fadeIn(0.1)}
          initial="hidden"
          animate="show"
        >
          <div className="relative w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] mx-auto">
            <div className="absolute inset-0 rounded-full border"
              style={{ borderColor: c.sealOuter, transition: "border-color 0.45s ease" }} />
            <div className="absolute inset-[7px] rounded-full border"
              style={{ borderColor: c.sealInner, transition: "border-color 0.45s ease" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[14px] h-[14px] rounded-full"
                style={{
                  background: "#eb4511",
                  boxShadow: isDark
                    ? "0 0 18px 4px rgba(235,69,17,0.45)"
                    : "0 0 14px 3px rgba(235,69,17,0.3)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Category label */}
        <motion.p
          className="font-label-sm uppercase tracking-[0.38em] text-[9px] sm:text-[10px] mb-8 sm:mb-10"
          style={{ color: c.label, transition: "color 0.45s ease" }}
          variants={fadeIn(0.2)}
          initial="hidden"
          animate="show"
        >
          Professional Credentialing · AI / ML Engineering
        </motion.p>

        {/* Primary headline — Cormorant Garamond */}
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

        {/* Italic sub-headline */}
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

        {/* Ornamental rule */}
        <motion.div
          className="flex items-center gap-4 mb-9 sm:mb-11 w-full max-w-[260px]"
          variants={fadeIn(0.5)}
          initial="hidden"
          animate="show"
        >
          <div className="flex-1 h-px" style={{ background: c.ruleLine, transition: "background 0.45s ease" }} />
          <div className="w-[5px] h-[5px] rotate-45 border"
            style={{ borderColor: "rgba(235,69,17,0.55)" }} />
          <div className="flex-1 h-px" style={{ background: c.ruleLine, transition: "background 0.45s ease" }} />
        </motion.div>

        {/* Body copy */}
        <motion.p
          className="leading-[1.9] text-[13px] sm:text-[15px] font-[300] max-w-[480px] mb-11 sm:mb-14"
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

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto"
          variants={fadeUp(0.65)}
          initial="hidden"
          animate="show"
        >
          <motion.button
            onClick={onApply}
            className="w-full sm:w-auto px-10 sm:px-12 py-[14px] sm:py-[15px] font-label-sm uppercase tracking-[0.22em] text-[10px] transition-all duration-400"
            style={{ background: "#eb4511", color: "#fff" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Apply as a Founding Reviewer
          </motion.button>

          <motion.a
            href="#process"
            className="font-label-sm uppercase tracking-[0.22em] text-[10px] border-b pb-px transition-colors duration-300"
            style={{ color: c.linkText, borderColor: c.linkBorder, transition: "color 0.45s ease, border-color 0.45s ease" }}
            whileHover={{ x: 3 }}
            onHoverStart={e => { (e.target as HTMLElement).style.color = c.linkHover; }}
            onHoverEnd={e   => { (e.target as HTMLElement).style.color = c.linkText; }}
          >
            See how it works
          </motion.a>
        </motion.div>

        {/* Credibility bar */}
        <motion.div
          className="grid grid-cols-3 w-full max-w-xl mt-16 sm:mt-20 border-t"
          style={{ borderColor: c.statBorder, transition: "border-color 0.45s ease" }}
          variants={fadeIn(0.8)}
          initial="hidden"
          animate="show"
        >
          {[
            { num: "45",  unit: "min",   label: "Average review session"    },
            { num: "100", unit: "%",     label: "Senior engineer reviewed"  },
            { num: "05",  unit: "spots", label: "Founding cohort remaining" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 pt-8 border-r last:border-r-0"
              style={{ borderColor: c.statDivider, transition: "border-color 0.45s ease" }}
            >
              <div className="flex items-baseline gap-1">
                <span
                  className="font-[700] text-xl sm:text-2xl tracking-tight"
                  style={{ color: c.statNum, transition: "color 0.45s ease" }}
                >
                  {s.num}
                </span>
                <span
                  className="font-label-sm uppercase tracking-[0.12em] text-[8px] sm:text-[9px]"
                  style={{ color: "#eb4511" }}
                >
                  {s.unit}
                </span>
              </div>
              <span
                className="font-label-sm uppercase tracking-[0.16em] text-[8px] text-center leading-relaxed px-3"
                style={{ color: c.statLabel, transition: "color 0.45s ease" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
