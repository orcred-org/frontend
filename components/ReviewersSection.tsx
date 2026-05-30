"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ReviewersProps {
  onApply: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const perks = [
  "Equity in Orcred",
  "Your name on the platform from day one",
  "A founding badge that never goes away",
  "Direct say in what the standard looks like",
];

export default function ReviewersSection({ onApply }: ReviewersProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id="reviewers"
      className="relative min-h-screen flex items-center px-6 sm:px-10 lg:px-16"
      style={{
        backgroundColor: "var(--bg-page)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Ambient warm left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 65% at 25% 50%, rgba(235,69,17,0.05) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-6 items-center py-24 lg:py-32"
      >

        {/* ── Left — headline + body ── */}
        <div className="lg:col-span-6 lg:pr-16">

          {/* Chapter marker */}
          <motion.div
            className="flex items-center gap-4 mb-10"
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
              04
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
            <span
              className="font-label-sm uppercase tracking-[0.38em] text-[9px]"
              style={{ color: "rgba(235,69,17,0.65)" }}
            >
              For Engineers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.05, delay: 0.12, ease }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(38px, 4.5vw, 72px)",
                lineHeight: 1.0,
                color: "var(--fg)",
              }}
            >
              You know within
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--fg-muted)",
                }}
              >
                60 seconds.
              </span>
            </h2>
          </motion.div>

          {/* Orange rule */}
          <motion.div
            className="h-px bg-accent-orange w-8 opacity-70"
            style={{ marginTop: "32px", marginBottom: "32px" }}
            initial={{ scaleX: 0, originX: "left" }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.28, ease }}
          />

          {/* Body */}
          <motion.p
            className="text-[14px] sm:text-[15px] leading-[1.9] font-light max-w-md mb-10"
            style={{ color: "var(--fg-muted)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.38, ease: "easeOut" }}
          >
            You&apos;ve been in enough rooms to know.
            The student who built something real talks about it differently —
            the decisions, the tradeoffs, the failures.
            That instinct is exactly what Orcred is built on.
            We&apos;re two founders, and we need 5 engineers to make it real.
          </motion.p>

          {/* Perks */}
          <div className="space-y-3.5">
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.52 + i * 0.1, ease }}
              >
                <div
                  className="w-px h-[14px] flex-shrink-0"
                  style={{ background: "rgba(235,69,17,0.55)" }}
                />
                <span
                  className="text-[13px] font-light"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {perk}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right — application card ── */}
        <motion.div
          className="lg:col-span-5 lg:col-start-8"
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={inView ? { opacity: 1, clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 1.3, delay: 0.15, ease }}
        >
          <div
            className="relative border p-10 sm:p-12"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-alt)",
            }}
          >
            {/* Corner accent — top-left L */}
            <div
              className="absolute top-0 left-0 w-10 h-[1px]"
              style={{ background: "#eb4511" }}
            />
            <div
              className="absolute top-0 left-0 w-[1px] h-10"
              style={{ background: "#eb4511" }}
            />

            {/* Label */}
            <div className="mb-6">
              <span
                className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
                style={{ color: "rgba(235,69,17,0.7)" }}
              >
                Founding Cohort
              </span>
            </div>

            {/* Big italic numeral */}
            <div className="mb-6">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(72px, 11vw, 110px)",
                  lineHeight: 1,
                  color: "var(--border)",
                  display: "block",
                }}
              >
                5
              </span>
              <span
                className="font-label-sm uppercase tracking-[0.35em] text-[8px]"
                style={{ color: "var(--fg-faint)", marginTop: "-4px", display: "block" }}
              >
                spots remaining
              </span>
            </div>

            {/* Divider */}
            <div
              className="w-full h-px mb-8"
              style={{ background: "var(--border)" }}
            />

            {/* Description */}
            <p
              className="text-[13px] sm:text-[14px] font-light leading-[1.85] mb-10"
              style={{ color: "var(--fg-muted)" }}
            >
              This is not a gig.
              <br />
              It&apos;s a stake in something built from scratch.
            </p>

            {/* CTA button — underline sweep */}
            <motion.button
              onClick={onApply}
              className="relative w-full py-[15px] font-label-sm uppercase tracking-[0.3em] text-[10px]"
              style={{ color: "var(--fg)", background: "transparent" }}
              initial="rest"
              whileHover="hover"
              animate="rest"
              whileTap={{ scale: 0.98 }}
            >
              Apply for a Founding Spot
              <motion.span
                className="absolute bottom-0 left-0 h-[1px]"
                style={{ background: "#eb4511" }}
                variants={{
                  rest:  { width: "0%",   transition: { duration: 0.3,  ease: "easeOut" } },
                  hover: { width: "100%", transition: { duration: 0.6,  ease: [0.22, 1, 0.36, 1] } },
                }}
              />
            </motion.button>

            {/* Fine print */}
            <p
              className="text-center mt-5 font-label-sm uppercase tracking-[0.3em] text-[8px]"
              style={{ color: "var(--fg-faint)" }}
            >
              Equity included
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
