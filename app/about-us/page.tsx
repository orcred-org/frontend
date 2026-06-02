"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

const paragraphs = [
  "Between us we've seen both sides of this — what it looks like when real builders get filtered out before anyone reads a line of their code, and what it looks like inside engineering teams when the wrong person gets hired because they interviewed well.",
  "We kept arriving at the same conclusion. The way AI/ML engineers are evaluated in India is broken in a way that consistently hurts the people who deserved to get through the most.",
  "We started Orcred in 2026. We're still early. No big team, no fancy backing. Just two people who couldn't stop thinking about this problem long enough to decide that waiting for someone else to fix it wasn't an option anymore.",
  "So we built it ourselves.",
  "That's us.",
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)",
        }}
      />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <main className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="w-8 h-px" style={{ background: "var(--border)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
            style={{ color: "var(--orange-faint)" }}
          >
            Company
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            color: "var(--fg)",
            marginBottom: "8px",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          About Us
        </motion.h1>

        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "var(--fg-faint)",
            marginBottom: "48px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Two founders. One problem we couldn't walk away from.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-full h-px mb-12"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
        />

        {/* Body */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-[14px] sm:text-[15px] font-light leading-[1.9]"
              style={{ color: "var(--fg-muted)" }}
            >
              {para}
            </p>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
