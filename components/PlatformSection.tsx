"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   Visuals — pure typography & geometry,
   no card containers, no "screenshot" feel
───────────────────────────────────────── */

/** Visual 1 — 24 circles, 1 is real */
function SignalGrid() {
  const total  = 24;
  const signal = 13; // which one glows

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10 py-16 px-8">
      {/* Grid of candidates */}
      <motion.div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width:      i === signal ? 12 : 8,
              height:     i === signal ? 12 : 8,
              background: i === signal ? "#eb4511" : "rgba(235,225,205,0.09)",
              boxShadow:  i === signal ? "0 0 14px 5px rgba(235,69,17,0.38)" : "none",
              alignSelf:  "center",
              justifySelf: "center",
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.025,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </motion.div>

      {/* Statement */}
      <div className="text-center">
        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 46px)",
            lineHeight: 1.1,
            color: "rgba(235,225,205,0.72)",
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease }}
        >
          1 signal in 24.
        </motion.p>
        <motion.p
          className="font-label-sm uppercase tracking-[0.42em] text-[9px] mt-3"
          style={{ color: "rgba(235,225,205,0.42)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.85 }}
        >
          That&apos;s the problem.
        </motion.p>
      </div>
    </div>
  );
}

/** Visual 2 — SVG clock arc + centered time */
function SessionVisual() {
  const r   = 88;
  const circ = 2 * Math.PI * r; // ≈ 552.9
  const fill = circ * 0.38;     // 38% of session elapsed

  // Tick positions at 0, 15, 30, 45 min (top, right, bottom, left)
  const ticks = [0, 90, 180, 270].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x1: 100 + (r - 10) * Math.cos(rad),
      y1: 100 + (r - 10) * Math.sin(rad),
      x2: 100 + (r + 2)  * Math.cos(rad),
      y2: 100 + (r + 2)  * Math.sin(rad),
    };
  });

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 py-14 px-8">
      {/* Clock arc */}
      <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: "visible" }}>
          {/* Outer faint orbit */}
          <circle cx="100" cy="100" r="96"
            fill="none" stroke="rgba(235,225,205,0.04)" strokeWidth="1" />

          {/* Track ring */}
          <circle cx="100" cy="100" r={r}
            fill="none" stroke="rgba(235,225,205,0.06)" strokeWidth="1" />

          {/* Animated progress arc */}
          <motion.circle
            cx="100" cy="100" r={r}
            fill="none"
            stroke="rgba(235,69,17,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            transform="rotate(-90 100 100)"
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - fill }}
            viewport={{ once: true }}
            transition={{ duration: 2.6, delay: 0.4, ease: "easeOut" }}
          />

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(235,225,205,0.38)" strokeWidth="1"
            />
          ))}

          {/* Minute labels */}
          {["0", "15", "30", "45"].map((label, i) => {
            const deg = i * 90 - 90;
            const rad = (deg * Math.PI) / 180;
            const lx  = 100 + (r + 14) * Math.cos(rad);
            const ly  = 100 + (r + 14) * Math.sin(rad);
            return (
              <text key={i} x={lx} y={ly}
                textAnchor="middle" dominantBaseline="central"
                style={{
                  fill: "rgba(235,225,205,0.38)",
                  fontSize: "8px",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Center — time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(38px, 6vw, 54px)",
              lineHeight: 1,
              color: "rgba(235,225,205,0.9)",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            45<span style={{ color: "#eb4511", opacity: 0.75 }}>:</span>00
          </motion.span>
          <span
            className="font-label-sm uppercase tracking-[0.35em] text-[7px] mt-1.5"
            style={{ color: "rgba(235,225,205,0.40)" }}
          >
            minutes
          </span>
        </div>
      </div>

      {/* Label below arc */}
      <motion.p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(17px, 2.2vw, 24px)",
          color: "rgba(235,225,205,0.62)",
          textAlign: "center",
        }}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.55, ease }}
      >
        One session · One verdict
      </motion.p>
    </div>
  );
}

/** Visual 3 — score + dimension bars, no card container */
function ScoreVisual() {
  const bars = [
    { label: "Technical Depth",  pct: "91%", w: "91%" },
    { label: "Communication",    pct: "84%", w: "84%" },
    { label: "Reproducibility",  pct: "88%", w: "88%" },
    { label: "Originality",      pct: "79%", w: "79%" },
  ];

  return (
    <div className="w-full flex flex-col py-12 px-6 sm:px-10 gap-7">

      {/* Header row — score + label */}
      <div className="flex items-end justify-between">
        <motion.div
          className="flex items-start gap-1.5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(64px, 11vw, 110px)",
              lineHeight: 0.88,
              color: "rgba(235,225,205,0.9)",
              letterSpacing: "-0.02em",
            }}
          >
            87
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(18px, 3vw, 26px)",
              color: "#eb4511",
              marginTop: "8px",
            }}
          >
            /100
          </span>
        </motion.div>

        <motion.div
          className="text-right pb-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p
            className="font-label-sm uppercase tracking-[0.3em] text-[8px]"
            style={{ color: "rgba(235,225,205,0.42)" }}
          >
            Orcred Score
          </p>
          <p
            className="font-label-sm uppercase tracking-[0.3em] text-[8px] mt-0.5"
            style={{ color: "rgba(235,225,205,0.35)" }}
          >
            Founding Cohort · 2026
          </p>
        </motion.div>
      </div>

      {/* Thin divider */}
      <motion.div
        className="w-full h-px"
        style={{ background: "rgba(235,225,205,0.07)" }}
        initial={{ scaleX: 0, originX: "left" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.25, ease }}
      />

      {/* Dimension bars */}
      <div className="space-y-4">
        {bars.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease }}
          >
            <div className="flex justify-between mb-1.5">
              <span
                className="font-label-sm uppercase tracking-widest text-[8px]"
                style={{ color: "rgba(235,225,205,0.66)" }}
              >
                {b.label}
              </span>
              <span
                className="font-label-sm text-[9px]"
                style={{ color: "rgba(235,225,205,0.75)" }}
              >
                {b.pct}
              </span>
            </div>
            <div
              className="w-full h-[1.5px] overflow-hidden"
              style={{ background: "rgba(235,225,205,0.06)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: "rgba(235,69,17,0.5)" }}
                initial={{ width: 0 }}
                whileInView={{ width: b.w }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.35 + i * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Thin divider */}
      <div className="w-full h-px" style={{ background: "rgba(235,225,205,0.07)" }} />

      {/* Footer */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <p
          className="font-label-sm uppercase tracking-[0.3em] text-[8px]"
          style={{ color: "rgba(235,225,205,0.40)" }}
        >
          Senior ML Engineer · Verified
        </p>
        <div
          className="border px-3 py-1"
          style={{ borderColor: "rgba(235,69,17,0.35)" }}
        >
          <span
            className="font-label-sm uppercase tracking-[0.35em] text-[8px]"
            style={{ color: "#eb4511" }}
          >
            Passed
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Editorial panel — full-height scroll reveal
───────────────────────────────────────── */

interface PanelProps {
  index: number;
  chapter: string;
  headline: string;
  italic: string;
  body: string;
  visual: React.ReactNode;
  flip?: boolean;
}

function EditorialPanel({
  index,
  chapter,
  headline,
  italic,
  body,
  visual,
  flip,
}: PanelProps) {
  const ref   = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const num   = String(index).padStart(2, "0");

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center border-b py-16 px-6 sm:px-10 lg:px-16"
      style={{ borderColor: "rgba(235,225,205,0.04)" }}
    >
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

        {/* ── Text block ── */}
        <div
          className={`lg:col-span-4 flex flex-col gap-7
            ${flip ? "lg:col-start-9 lg:order-2" : "lg:col-start-1 lg:order-1"}`}
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
              {num}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(235,225,205,0.07)" }}
            />
            <span
              className="font-label-sm uppercase tracking-[0.38em] text-[9px]"
              style={{ color: "rgba(235,69,17,0.65)" }}
            >
              {chapter}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.05, delay: 0.15, ease }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 3.8vw, 52px)",
                lineHeight: 1.0,
                color: "rgba(235,225,205,0.92)",
              }}
            >
              {headline}
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(22px, 2.8vw, 38px)",
                lineHeight: 1.1,
                color: "rgba(235,225,205,0.70)",
                marginTop: "4px",
              }}
            >
              {italic}
            </p>
          </motion.div>

          {/* Thin orange rule */}
          <motion.div
            className="h-px bg-accent-orange w-8 opacity-70"
            initial={{ scaleX: 0, originX: "left" }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          />

          {/* Body */}
          <motion.p
            className="text-[14px] sm:text-[15px] leading-[1.9] font-light"
            style={{ color: "rgba(235,225,205,0.62)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.42, ease: "easeOut" }}
          >
            {body}
          </motion.p>
        </div>

        {/* ── Visual — curtain reveal, no frame ── */}
        <motion.div
          className={`lg:col-span-7 overflow-hidden
            ${flip ? "lg:col-start-1 lg:order-1" : "lg:col-start-6 lg:order-2"}`}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 1.35, delay: 0.08, ease }}
        >
          {visual}
        </motion.div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Export
───────────────────────────────────────── */

export default function PlatformSection() {
  return (
    <section id="platform" className="relative" style={{ backgroundColor: "#010204" }}>

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
          style={{ color: "rgba(235,225,205,0.45)" }}
        >
          The Story
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
      </motion.div>

      {/* Panel 1 — The problem */}
      <EditorialPanel
        index={1}
        chapter="The Problem"
        headline="Everyone has a project."
        italic="Yours is different."
        body="Right now no one can tell the difference between someone who spent months building something real and someone who spent a weekend prompting ChatGPT. That gap is costing real builders their careers."
        visual={<SignalGrid />}
      />

      {/* Panel 2 — The session */}
      <EditorialPanel
        index={2}
        chapter="The Session"
        headline="45 minutes."
        italic="One engineer. Your work."
        body="Not a quiz. Not a take-home test. A real conversation — about the project you built, every decision you made, every tradeoff you chose. The ones who built it for real talk about it differently."
        visual={<SessionVisual />}
        flip
      />

      {/* Panel 3 — The proof */}
      <EditorialPanel
        index={3}
        chapter="The Proof"
        headline="Now there's"
        italic="proof."
        body="An Orcred Score. A verified credential backed by a senior engineer's sign-off. Something you carry into any room and say — a real engineer reviewed this work. It passed."
        visual={<ScoreVisual />}
      />

    </section>
  );
}
