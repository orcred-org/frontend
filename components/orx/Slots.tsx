"use client";

/**
 * Slot counter for the founding cohort.
 *
 * Three shapes for three jobs: a pill for chrome and the hero, a meter for the
 * moments where the decision is actually made, and a bare line for use inside
 * running text. All three read from one constant, so they can never disagree
 * with each other or with reality.
 *
 * When the cohort closes, every variant switches to the closed state rather
 * than showing "0 left" — a spent counter still shouting is the kind of detail
 * that makes a real number look invented.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  COHORT,
  cohortFilled,
  cohortNearlyFull,
  cohortOpen,
  slotsLeft,
  slotsTaken,
} from "@/lib/cohort";
import { EASE, T } from "./kit";

function Pulse({ size = 6 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      style={{ width: size, height: size, borderRadius: 999, backgroundColor: "var(--or)", flexShrink: 0 }}
      animate={reduce || !cohortNearlyFull ? undefined : { opacity: [1, 0.25, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Slots({
  variant = "pill",
  className = "",
}: {
  variant?: "pill" | "meter" | "line";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  /* ── Pill ──────────────────────────────────────────────────────────── */
  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-2.5 ${className}`}
        style={{ padding: "8px 14px", borderRadius: 999, backgroundColor: "var(--or-soft)" }}
      >
        {cohortOpen ? (
          <>
            <Pulse />
            <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--or)", letterSpacing: "-0.005em" }}>
              <span className="orx-num">{slotsLeft}</span> of {COHORT.total} founding slots left
            </span>
          </>
        ) : (
          <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--or)", letterSpacing: "-0.005em" }}>
            Founding cohort full
          </span>
        )}
      </span>
    );
  }

  /* ── Line ──────────────────────────────────────────────────────────── */
  if (variant === "line") {
    return (
      <span className={className} style={{ ...T.fine, color: "var(--ink-2)" }}>
        {cohortOpen ? (
          <>
            <span className="orx-num" style={{ color: "var(--or)", fontWeight: 600 }}>{slotsLeft}</span>
            {" "}of {COHORT.total} founding slots remain — free verification, no payment.
          </>
        ) : (
          <>All {COHORT.total} founding slots are taken. Paid applications are open at ₹1,999.</>
        )}
      </span>
    );
  }

  /* ── Meter ─────────────────────────────────────────────────────────── */
  return (
    <div ref={ref} className={className} style={{ maxWidth: 420 }}>
      <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: 11 }}>
        <span className="orx-label" style={{ color: "var(--or)" }}>
          {cohortOpen ? "Founding cohort" : "Founding cohort closed"}
        </span>
        <span style={{ ...T.fine, color: "var(--ink-2)" }} className="orx-num">
          {slotsTaken} / {COHORT.total} claimed
        </span>
      </div>

      <div
        style={{
          height: 8,
          borderRadius: 999,
          backgroundColor: "rgba(16,17,20,0.07)",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ height: "100%", borderRadius: 999, backgroundColor: "var(--or)" }}
          initial={reduce ? { width: `${cohortFilled * 100}%` } : { width: 0 }}
          animate={seen ? { width: `${cohortFilled * 100}%` } : undefined}
          transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
        />
      </div>

      <div style={{ ...T.fine, marginTop: 11 }}>
        {cohortOpen ? (
          <>
            <span className="orx-num" style={{ color: "var(--or)", fontWeight: 600 }}>{slotsLeft}</span>
            {" "}
            {slotsLeft === 1 ? "slot" : "slots"} left. Verification is free for the founding cohort,
            then ₹1,999.
          </>
        ) : (
          <>Every founding slot is taken. Paid applications are open at ₹1,999.</>
        )}
      </div>
    </div>
  );
}
