"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   Step visuals — native to site design language
───────────────────────────────────────── */

/** Visual 1 — animated submission form */
function SubmissionVisual({ inView }: { inView: boolean }) {
  const fields = [
    { label: "Project",      value: "RAG Pipeline · LangChain + Pinecone" },
    { label: "Architecture", value: "Custom retrieval + cross-encoder reranking" },
    { label: "Key decision", value: "Late chunking over fixed-size splitting" },
    { label: "What failed",  value: "Naive top-k at 400-token fixed chunks" },
    { label: "Tradeoffs",    value: "120ms latency accepted for accuracy gain" },
  ];

  return (
    <div className="w-full flex flex-col py-10 px-2 gap-0">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-7"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span
          className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
          style={{ color: "var(--orange-faint)" }}
        >
          Project Submission
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <div
          className="w-[6px] h-[6px] rounded-full"
          style={{ background: "#eb4511", boxShadow: "0 0 6px 2px var(--orange-dim)" }}
        />
      </motion.div>

      {/* Fields */}
      {fields.map((field, i) => (
        <div key={field.label} className="py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-baseline gap-5">
            {/* Label */}
            <span
              className="font-label-sm uppercase tracking-[0.32em] text-[8px] flex-shrink-0 w-24"
              style={{ color: "var(--orange-faint)" }}
            >
              {field.label}
            </span>

            {/* Value — clip-path reveal L→R */}
            <div className="overflow-hidden flex-1">
              <motion.p
                className="text-[13px] font-light"
                style={{ color: "var(--fg-muted)" }}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
                transition={{ duration: 0.75, delay: 0.25 + i * 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {field.value}
              </motion.p>
            </div>
          </div>

          {/* Thin fill line */}
          <div className="mt-3 ml-[116px] h-[1px] overflow-hidden"
            style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full"
              style={{ background: "#eb4511", opacity: 0.5 }}
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 0.9, delay: 0.45 + i * 0.22, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Visual 2 — Q&A conversation transcript */
function ConversationVisual({ inView }: { inView: boolean }) {
  const exchanges = [
    {
      q: "Walk me through why you chose this embedding model over ada-002.",
      a: "It outperforms ada-002 by 14% on domain-specific retrieval in our internal evals. I ran three separate benchmarks before committing.",
    },
    {
      q: "What would you change if you rebuilt this from scratch?",
      a: "I'd decouple the chunking pipeline from indexing entirely. Right now they're tightly coupled and painful to iterate on independently.",
    },
    {
      q: "You mentioned a latency tradeoff — walk me through that decision.",
      a: "We accepted 120ms over 40ms because the accuracy delta was 18 points on our eval set. The use case justified it.",
    },
  ];

  return (
    <div className="w-full flex flex-col py-8 px-2 gap-7">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span
          className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
          style={{ color: "var(--orange-faint)" }}
        >
          Session Transcript
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </motion.div>

      {/* Exchanges */}
      {exchanges.map((ex, i) => (
        <div key={i} className="flex flex-col gap-2">
          {/* Question */}
          <motion.div
            className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.7, ease }}
          >
            <span
              className="font-label-sm uppercase tracking-widest text-[9px] mt-0.5 w-4 flex-shrink-0"
              style={{ color: "var(--fg-faint)" }}
            >
              Q
            </span>
            <p
              className="text-[13px] font-light italic leading-relaxed"
              style={{ color: "var(--fg-muted)" }}
            >
              {ex.q}
            </p>
          </motion.div>

          {/* Answer — brighter, slightly delayed */}
          <motion.div
            className="flex gap-3 items-start"
            initial={{ opacity: 0, x: 6 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45 + i * 0.7, ease }}
          >
            <span
              className="font-label-sm uppercase tracking-widest text-[9px] mt-0.5 w-4 flex-shrink-0"
              style={{ color: "#eb4511", opacity: 0.8 }}
            >
              A
            </span>
            <p
              className="text-[13px] font-light leading-relaxed"
              style={{ color: "var(--fg-muted)" }}
            >
              {ex.a}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/** Visual 3 — stamp verdict + SVG circle */
function VerdictVisual({ inView }: { inView: boolean }) {
  const r    = 72;
  const circ = 2 * Math.PI * r;

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-8 gap-8">

      {/* SVG circle stamp */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          width="220"
          height="220"
          style={{ overflow: "visible" }}
        >
          {/* Outer guide ring — faint */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />

          {/* Main circle — draws itself */}
          <motion.circle
            cx="100" cy="100" r={r}
            fill="none"
            stroke="var(--orange-faint)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            transform="rotate(-90 100 100)"
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: 0 } : {}}
            transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
          />

          {/* Inner ring — slightly smaller */}
          <motion.circle
            cx="100" cy="100" r={r - 8}
            fill="none"
            stroke="var(--orange-tint)"
            strokeWidth="1"
            strokeDasharray={2 * Math.PI * (r - 8)}
            transform="rotate(-90 100 100)"
            initial={{ strokeDashoffset: 2 * Math.PI * (r - 8) }}
            animate={inView ? { strokeDashoffset: 0 } : {}}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="flex items-start gap-1"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.2, ease }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "60px",
                lineHeight: 0.9,
                color: "var(--fg)",
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
                fontSize: "18px",
                color: "#eb4511",
                marginTop: "8px",
              }}
            >
              /100
            </span>
          </motion.div>

          <motion.span
            className="font-label-sm uppercase tracking-[0.35em] text-[8px] mt-2"
            style={{ color: "var(--fg-faint)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 1.5 }}
          >
            Orcred Score
          </motion.span>
        </div>
      </div>

      {/* PASSED stamp — presses down like a rubber stamp */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -12, scale: 1.15 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.65, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="border px-6 py-2"
          style={{
            borderColor: "var(--orange-dim)",
            transform: "rotate(-2deg)",
          }}
        >
          <span
            className="font-label-sm uppercase tracking-[0.5em] text-[11px]"
            style={{ color: "var(--orange-muted)" }}
          >
            Passed
          </span>
        </div>
        <p
          className="font-label-sm uppercase tracking-[0.3em] text-[8px]"
          style={{ color: "var(--fg-faint)" }}
        >
          Senior ML Engineer · Verified
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Steps data
───────────────────────────────────────── */

const steps = [
  {
    index: "01",
    numeral: "I",
    label: "Step",
    title: "They Submit",
    headline: "The project\nand the person.",
    desc: "A real project. A written explanation of every decision — why they chose this architecture, what they tried that failed, what they'd do differently. No templates. No guided prompts.",
    detail: "Engineers who built something real write differently. Specific. Confident. Uncertain in the right places. The submission is already a signal.",
    flip: false,
  },
  {
    index: "02",
    numeral: "II",
    label: "Core",
    title: "You Talk",
    headline: "45 minutes.\nYour judgment.",
    desc: "No script. Just you and the candidate and the work they say they built. You go wherever your instincts take you — the tradeoff they glossed over, the decision that seems too confident.",
    detail: "That instinct you've trusted in every technical interview — the one that fires within 60 seconds — now it has a formal home.",
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
    flip: false,
  },
];

/* ─────────────────────────────────────────
   Section
───────────────────────────────────────── */

export default function ProcessSection() {
  return (
    <section id="process" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* Section title rule */}
      <motion.div
        className="px-6 sm:px-10 lg:px-16 pt-6 pb-0 max-w-[1400px] mx-auto flex items-center gap-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span
          className="font-label-sm uppercase tracking-[0.45em] text-[9px]"
          style={{ color: "var(--fg-faint)" }}
        >
          How It Works
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </motion.div>

      {/* Steps */}
      {steps.map((step, i) => (
        <ProcessStep
          key={step.numeral}
          step={step}
          i={i}
          footer={i === steps.length - 1 ? (
            <div className="flex justify-end">
              <Link
                href="/how-it-works"
                className="font-label-sm uppercase tracking-[0.25em] text-[11px] transition-colors duration-200 flex items-center gap-2"
                style={{ color: "var(--fg-muted)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
              >
                See the full process
                <span style={{ letterSpacing: 0 }}>→</span>
              </Link>
            </div>
          ) : undefined}
        />
      ))}
    </section>
  );
}

function ProcessStep({ step, i, footer }: { step: (typeof steps)[0]; i: number; footer?: React.ReactNode }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const visual =
    i === 0 ? <SubmissionVisual inView={inView} /> :
    i === 1 ? <ConversationVisual inView={inView} /> :
              <VerdictVisual inView={inView} />;

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center border-b px-6 sm:px-10 lg:px-16 py-20 relative"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-page)",
      }}
    >
      {/* Roman numeral watermark — anchored to bottom border */}
      <div
        className="absolute inset-x-0 hidden lg:flex pointer-events-none select-none watermark-numeral"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(160px, 22vw, 360px)",
          lineHeight: 1,
          color: "var(--watermark)",
          justifyContent: step.flip ? "flex-start" : "flex-end",
          alignItems: "flex-end",
          userSelect: "none",
          zIndex: 0,
          /* bottom: -0.22em slides the descender space (≈0.2em for
             Cormorant Garamond) past the overflow:hidden clip point so
             the glyph foot lands on the border. em = own font-size. */
          bottom: "-0.22em",
        }}
      >
        {step.numeral}
      </div>

      {/* Grid — sits above numeral via z-index:1 stacking context */}
      <div className="relative z-[1] w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

        {/* ── Text block ── */}
        <div
          className={`relative lg:col-span-4 flex flex-col gap-7
            ${step.flip ? "lg:col-start-9 lg:order-2" : "lg:col-start-1 lg:order-1"}`}
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
                color: "var(--orange-faint)",
              }}
            >
              {step.index}
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span
              className="font-label-sm uppercase tracking-[0.38em] text-[9px]"
              style={{ color: "var(--orange-faint)" }}
            >
              {step.label}
            </span>
          </motion.div>

          {/* Sub-label */}
          <motion.p
            className="font-label-sm uppercase tracking-[0.28em] text-[10px]"
            style={{ color: "var(--fg-muted)" }}
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
              color: "var(--fg)",
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

          {/* Description */}
          <motion.p
            className="text-[15px] leading-[1.9] font-light"
            style={{ color: "var(--fg-muted)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
          >
            {step.desc}
          </motion.p>

          {/* Detail — left-bordered */}
          <motion.p
            className="text-[14px] leading-[1.85] font-light pl-4"
            style={{
              color: "var(--fg-muted)",
              borderLeft: "1px solid var(--orange-tint)",
            }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.46, ease: "easeOut" }}
          >
            {step.detail}
          </motion.p>

          {footer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.55, ease: "easeOut" }}
            >
              {footer}
            </motion.div>
          )}
        </div>

        {/* ── Visual ── */}
        <div
          className={`relative lg:col-span-7 overflow-hidden
            ${step.flip ? "lg:col-start-1 lg:order-1" : "lg:col-start-6 lg:order-2"}`}
        >
          {/* Curtain reveal */}
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
            transition={{ duration: 1.35, delay: 0.08, ease }}
          >
            {visual}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
