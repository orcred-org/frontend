"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const criteria = [
  {
    icon: "terminal",
    title: "Technical Depth",
    weight: "35%",
    desc: "Did they build something that works — and do they know why it works? The highest-weighted dimension because it is the hardest to fake.",
  },
  {
    icon: "chat",
    title: "Communication",
    weight: "25%",
    desc: "Can they walk a room through their decisions without notes? Clarity of thought under live questioning separates builders from memorisers.",
  },
  {
    icon: "sync",
    title: "Reproducibility",
    weight: "20%",
    desc: "Is the work clean enough that someone else could pick it up tomorrow? A project only you can run is a liability.",
  },
  {
    icon: "lightbulb",
    title: "Originality",
    weight: "20%",
    desc: "Did they think, or did they follow? Genuine problem solving versus tutorial assembly — the difference always shows.",
  },
];

export default function ScoresSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="scores"
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section label */}
        <motion.div
          className="flex items-center gap-5 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <div
            className="font-label-sm uppercase tracking-[0.45em] text-[9px]"
            style={{ color: "var(--fg-faint)" }}
          >
            Assessment Framework
          </div>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        {/* Main heading */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          <div
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "#0f0d0c",
              marginBottom: "12px",
            }}
          >
            Why the score matters.
          </div>
          <div
            style={{
              fontSize: "clamp(14px, 1.2vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(15,13,12,0.55)",
              maxWidth: "480px",
            }}
          >
            Not a grade. A signal. Four dimensions that actually measure understanding.
          </div>
        </motion.div>

        {/* 2-column criteria grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10 sm:gap-y-12"
        >
          {criteria.map((c, i) => (
            <motion.div
              key={c.title}
              className="flex gap-5"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
            >
              {/* Icon circle */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width:        "48px",
                  height:       "48px",
                  borderRadius: "50%",
                  border:       "1.5px solid #eb4511",
                  color:        "#eb4511",
                  marginTop:    "2px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px", fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                >
                  {c.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Title + weight */}
                <div className="flex items-baseline gap-3 mb-2">
                  <div
                    style={{
                      fontSize:      "clamp(15px, 1.3vw, 17px)",
                      fontWeight:    400,
                      letterSpacing: "-0.01em",
                      lineHeight:    1.3,
                      color:         "#0f0d0c",
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    className="font-label-sm uppercase tracking-[0.2em] text-[9px]"
                    style={{ color: "#eb4511", opacity: 0.8, flexShrink: 0 }}
                  >
                    {c.weight}
                  </div>
                </div>

                {/* Body */}
                <div
                  style={{
                    fontSize:   "clamp(13px, 1.1vw, 14px)",
                    fontWeight: 400,
                    lineHeight: 1.85,
                    color:      "rgba(15,13,12,0.6)",
                  }}
                >
                  {c.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          className="mt-14 sm:mt-16 flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-8 h-px" style={{ backgroundColor: "#eb4511", opacity: 0.7 }} />
          <div
            style={{
              fontSize:      "clamp(13px, 1.2vw, 15px)",
              fontWeight:    400,
              fontStyle:     "italic",
              color:         "rgba(180,45,5,0.75)",
              letterSpacing: "0.01em",
            }}
          >
            Not everyone passes. That&apos;s the point.
          </div>
        </motion.div>

      </div>
    </section>
  );
}
