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

  // ── Palette — all use CSS variables now ──
  const c = {
    bg:         "var(--bg-page)",
    radial:     isDark ? "var(--orange-tint)" : "var(--orange-tint)",
    bottomRule: "var(--border)",
    label:      "var(--fg-faint)",
    h1:         "var(--fg)",
    h1italic:   "var(--fg-muted)",
    ruleLine:   "var(--border-strong)",
    body:       "var(--fg-muted)",
    bodySpan:   "var(--fg)",
  };

  return (
    <section
      id="hero-section"
      className="mt-[-72px] relative flex flex-col items-center overflow-hidden px-6 sm:px-10 lg:px-16"
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
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl mx-auto pt-[120px] pb-[80px]">

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
            style={{ borderColor: "var(--orange-faint)" }} />
          <div className="flex-1 h-px" style={{ background: c.ruleLine, transition: "background 0.45s ease" }} />
        </motion.div>

        {/* Body copy */}
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
