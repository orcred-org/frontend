"use client";

import { motion } from "framer-motion";

interface CtaProps {
  onApply: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function CtaSection({ onApply }: CtaProps) {
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 text-center relative overflow-hidden"
      style={{ backgroundColor: "#06090e" }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(235,69,17,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Section label */}
        <motion.div
          className="flex items-center justify-center gap-5 mb-14 sm:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div
            className="w-12 h-px"
            style={{ background: "rgba(235,225,205,0.08)" }}
          />
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px] sm:text-[10px]"
            style={{ color: "rgba(235,69,17,0.7)" }}
          >
            Founding Cohort
          </span>
          <div
            className="w-12 h-px"
            style={{ background: "rgba(235,225,205,0.08)" }}
          />
        </motion.div>

        {/* Main headline — Cormorant Garamond */}
        <motion.h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(52px, 9vw, 120px)",
            lineHeight: 1.0,
            letterSpacing: "-0.01em",
            color: "rgba(235,225,205,0.92)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease }}
        >
          The standard
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(235,225,205,0.55)" }}>
            starts with
          </span>
          <br />
          you.
        </motion.h2>

        {/* Ornamental divider ── ◆ ── */}
        <motion.div
          className="flex items-center justify-center gap-4 my-10 sm:my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          <div
            className="w-16 h-px"
            style={{ background: "rgba(235,225,205,0.08)" }}
          />
          <div
            className="w-[6px] h-[6px] rotate-45 border"
            style={{ borderColor: "rgba(235,69,17,0.5)" }}
          />
          <div
            className="w-16 h-px"
            style={{ background: "rgba(235,225,205,0.08)" }}
          />
        </motion.div>

        {/* Body */}
        <motion.p
          className="text-[14px] sm:text-[16px] font-light leading-[1.9] max-w-sm mx-auto mb-12 sm:mb-14"
          style={{ color: "rgba(235,225,205,0.62)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          5 founding reviewers. 2 founders.
          <br />
          Built entirely from scratch.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        >
          <motion.button
            onClick={onApply}
            className="relative px-12 sm:px-16 py-4 sm:py-5 font-label-sm uppercase tracking-[0.3em] text-[10px] sm:text-[11px] text-white"
            style={{ background: "#eb4511" }}
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Apply for a Founding Spot
          </motion.button>
        </motion.div>

        {/* Fine print */}
        <motion.p
          className="mt-8 font-label-sm uppercase tracking-[0.35em] text-[9px]"
          style={{ color: "rgba(235,225,205,0.18)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.55, ease: "easeOut" }}
        >
          5 spots remaining · Equity included
        </motion.p>

      </div>
    </section>
  );
}
