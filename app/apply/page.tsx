"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const perks = [
  "Equity in Orcred",
  "Your name on the platform from day one",
  "A founding badge that never goes away",
  "Direct say in what the standard looks like",
];

export default function ApplyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#06090e" }}>

      {/* ── Header ── */}
      <header
        className="flex items-center justify-between flex-shrink-0 px-8 sm:px-12 lg:px-16"
        style={{
          height: "68px",
          borderBottom: "1px solid rgba(235,225,205,0.07)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-[13px] h-[13px] rounded-full flex-shrink-0"
            style={{
              background: "#eb4511",
              boxShadow: "0 0 10px 3px rgba(235,69,17,0.38)",
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "19px",
              letterSpacing: "0.13em",
              color: "rgba(235,225,205,0.82)",
            }}
          >
            ORCRED
          </span>
        </div>

        {/* Back */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-label-sm uppercase tracking-[0.32em] text-[10px]"
          style={{ color: "rgba(235,225,205,0.3)" }}
          whileHover={{ color: "rgba(235,225,205,0.65)", x: -3 }}
          transition={{ duration: 0.2 }}
        >
          ← Back
        </motion.button>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 lg:grid lg:grid-cols-[42%_58%]">

        {/* Left — sticky info panel */}
        <div
          className="lg:sticky lg:top-0 lg:h-[calc(100vh-68px)] flex flex-col justify-between
            px-8 sm:px-12 lg:px-16 py-12 lg:py-16 border-b lg:border-b-0"
          style={{ borderColor: "rgba(235,225,205,0.07)", borderRight: "1px solid rgba(235,225,205,0.07)" }}
        >
          <div>
            {/* Chapter marker */}
            <motion.div
              className="flex items-center gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
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
                05
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(235,225,205,0.07)" }}
              />
              <span
                className="font-label-sm uppercase tracking-[0.38em] text-[9px]"
                style={{ color: "rgba(235,69,17,0.65)" }}
              >
                Founding Cohort
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(44px, 5.5vw, 80px)",
                lineHeight: 1.0,
                color: "rgba(235,225,205,0.92)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease }}
            >
              Be the
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#eb4511" }}>
                standard.
              </span>
            </motion.h1>

            {/* Orange rule */}
            <motion.div
              className="h-px bg-accent-orange w-8 opacity-70"
              style={{ marginTop: "28px", marginBottom: "28px" }}
              initial={{ scaleX: 0, originX: "left" }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            />

            {/* Body */}
            <motion.p
              className="text-[14px] sm:text-[15px] font-light leading-[1.9] max-w-sm mb-10"
              style={{ color: "rgba(235,225,205,0.38)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              Two founders, one idea, and five seats at the table.
              We&apos;re building the verification standard for AI/ML engineers —
              and we need 5 engineers who know the difference between
              someone who built something and someone who ran something.
            </motion.p>

            {/* What you get */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.48 }}
            >
              <span
                className="font-label-sm uppercase tracking-[0.4em] text-[9px] block mb-5"
                style={{ color: "rgba(235,225,205,0.2)" }}
              >
                What you get
              </span>
              <div className="space-y-4">
                {perks.map((perk, i) => (
                  <motion.div
                    key={perk}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 + i * 0.1, ease }}
                  >
                    <div
                      className="w-px h-[13px] flex-shrink-0"
                      style={{ background: "rgba(235,69,17,0.55)" }}
                    />
                    <span
                      className="text-[13px] font-light"
                      style={{ color: "rgba(235,225,205,0.42)" }}
                    >
                      {perk}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom fine print */}
          <motion.div
            className="pt-8 mt-8"
            style={{ borderTop: "1px solid rgba(235,225,205,0.06)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <p
              className="font-label-sm uppercase tracking-[0.38em] text-[8px]"
              style={{ color: "rgba(235,225,205,0.18)" }}
            >
              5 spots · Equity included · Built from scratch
            </p>
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div
          className="px-8 sm:px-12 lg:px-16 py-12 lg:py-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        >
          {/* Form label */}
          <div className="mb-8">
            <span
              className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
              style={{ color: "rgba(235,225,205,0.2)" }}
            >
              Your Application
            </span>
          </div>

          {/* Tally embed */}
          <iframe
            src="https://tally.so/embed/1ADkrO?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="1400"
            frameBorder="0"
            title="Founding Reviewer Application"
            className="w-full"
          />
        </motion.div>

      </div>
    </div>
  );
}
