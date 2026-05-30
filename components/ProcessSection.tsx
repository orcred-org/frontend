"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "Submit Your Project",
    body: "Your project, a five-minute Loom walkthrough, three written build decisions, and one honest account of what broke. Everything a reviewer needs to prepare — before the call begins.",
  },
  {
    num: "02",
    title: "Live Socratic Review",
    body: "45 minutes on camera with a senior engineer who has read every line of your submission. Questions are generated specifically for your work. There is no question bank and no way to coach for it.",
  },
  {
    num: "03",
    title: "Your Score & Credential",
    body: "A score out of 100 across four dimensions, written feedback on each, and — if you pass — your verified Orcred credential. Delivered within 24 hours of your review.",
  },
];

export default function ProcessSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="process" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* Steps list */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-12 sm:pb-16">

        {/* Section heading — CFA style large title */}
        <motion.div
          style={{
            fontSize: "clamp(32px, 3.8vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "#0f0d0c",
            marginBottom: "clamp(28px, 3vw, 40px)",
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
        >
          The verification process.
        </motion.div>

        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex gap-6 sm:gap-10 border-b cursor-default"
              style={{
                borderColor: "var(--border)",
                backgroundColor: hovered === i
                  ? "rgba(235, 69, 17, 0.055)"
                  : "transparent",
                transition: "background-color 0.35s ease",
                paddingTop:    "clamp(28px, 3.5vw, 44px)",
                paddingBottom: "clamp(28px, 3.5vw, 44px)",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
            >
              {/* ── Number box ── */}
              <div
                className="flex-shrink-0 flex items-center justify-center select-none"
                style={{
                  width:           "clamp(48px, 5vw, 60px)",
                  height:          "clamp(48px, 5vw, 60px)",
                  backgroundColor: "#eb4511",
                  fontFamily:      "Inter, system-ui, sans-serif",
                  fontWeight:      700,
                  fontSize:        "clamp(16px, 1.6vw, 20px)",
                  letterSpacing:   "-0.02em",
                  color:           "#ffffff",
                  lineHeight:      1,
                }}
              >
                {step.num}
              </div>

              {/* ── Content ── */}
              <div className="flex-1" style={{ paddingTop: "4px" }}>
                {/* Title */}
                <div
                  style={{
                    fontWeight:    600,
                    fontSize:      "clamp(16px, 1.5vw, 20px)",
                    color:         "#0f0d0c",
                    letterSpacing: "-0.015em",
                    lineHeight:    1.25,
                    marginBottom:  "10px",
                  }}
                >
                  {step.title}
                </div>

                {/* Body */}
                <div
                  style={{
                    fontSize:   "clamp(14px, 1.1vw, 15px)",
                    lineHeight: 1.85,
                    color:      "rgba(15,13,12,0.62)",
                    fontWeight: 400,
                    maxWidth:   "600px",
                  }}
                >
                  {step.body}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
            style={{
              border:          "1px solid #0f0d0c",
              backgroundColor: "transparent",
              color:           "#0f0d0c",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "#eb4511";
              el.style.borderColor = "#eb4511";
              el.style.setProperty("color", "#ffffff", "important");
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "transparent";
              el.style.borderColor = "#0f0d0c";
              el.style.setProperty("color", "#0f0d0c", "important");
            }}
          >
            See the Full Process
            <span style={{ letterSpacing: 0, color: "inherit" }}>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
