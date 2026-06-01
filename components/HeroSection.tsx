"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface HeroProps { onApply: () => void; }

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "40–60%", label: "Pass rate"   },
  { value: "45 min", label: "Live review" },
  { value: "24 hrs", label: "Turnaround"  },
  { value: "₹2,000", label: "Per attempt" },
];

export default function HeroSection({ onApply: _ }: HeroProps) {
  return (
    <section
      id="hero-section"
      style={{
        backgroundColor: "var(--bg-page)",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full py-20">
        <div style={{ maxWidth: 600 }}>

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span className="font-label-sm uppercase tracking-[0.3em] text-[10px]" style={{ color: "#eb4511" }}>
              AI · ML Verification Standard
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="mb-6"
            style={{
              fontSize:      "clamp(22px, 2.8vw, 38px)",
              fontWeight:    400,
              letterSpacing: "-0.02em",
              lineHeight:    1.15,
              color:         "#0f0d0c",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            The verification standard<br />
            for AI engineers.
          </motion.div>

          {/* Body */}
          <motion.div
            style={{
              fontSize:   "clamp(13px, 1.1vw, 15px)",
              fontWeight: 400,
              lineHeight: 1.85,
              color:      "rgba(15,13,12,0.55)",
              maxWidth:   480,
              marginBottom: 36,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            A live 45-minute technical review with a senior engineer who has read your code and watched your walkthrough. One score. One credential. Delivered in 24 hours.
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            style={{ marginBottom: 56 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/get-verified"
              className="inline-flex items-center px-10 py-4 font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
              style={{ backgroundColor: "#eb4511", color: "#ffffff", border: "1px solid #eb4511", borderRadius: "100px", transition: "opacity 0.15s ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Apply for Verification
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
              style={{ border: "1px solid #0f0d0c", backgroundColor: "transparent", color: "#0f0d0c", borderRadius: "100px", transition: "opacity 0.15s ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              How it works
              <span style={{ letterSpacing: 0, color: "inherit" }}>→</span>
            </Link>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
