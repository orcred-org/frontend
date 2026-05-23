"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const criteria = [
  {
    roman: "I.",
    title: "Technical Depth",
    weight: "35%",
    desc: "Did they build something that works — and do they know why it works?",
  },
  {
    roman: "II.",
    title: "Communication",
    weight: "25%",
    desc: "Can they walk a room through their decisions without notes?",
  },
  {
    roman: "III.",
    title: "Reproducibility",
    weight: "20%",
    desc: "Is the work clean enough that someone else could pick it up tomorrow?",
  },
  {
    roman: "IV.",
    title: "Originality",
    weight: "20%",
    desc: "Did they think, or did they follow?",
  },
];

export default function ScoresSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="scores"
      className="py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: "#010204" }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16 sm:mb-20 lg:mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-end"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div>
            <span
              className="font-label-sm uppercase tracking-[0.35em] text-[9px] sm:text-[10px] block mb-5"
              style={{ color: "rgba(235,69,17,0.7)" }}
            >
              Assessment Framework
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(36px, 5.5vw, 68px)",
                lineHeight: 1.05,
                color: "rgba(235,225,205,0.9)",
              }}
            >
              The Orcred
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300 }}>
                Score.
              </span>
            </h2>
          </div>
          <div className="md:text-right md:max-w-xs md:ml-auto">
            <p
              className="text-[15px] font-light leading-relaxed pb-4 border-b"
              style={{
                color: "rgba(235,225,205,0.62)",
                borderColor: "rgba(235,225,205,0.27)",
              }}
            >
              Not a grade. A signal.
              <br />
              Four things that actually matter.
            </p>
          </div>
        </motion.div>

        {/* Top rule */}
        <div
          className="h-px mb-0"
          style={{ background: "rgba(235,225,205,0.32)" }}
        />

        {/* Criteria table */}
        <div ref={ref}>
          {criteria.map((c, i) => (
            <motion.div
              key={c.roman}
              className="group grid grid-cols-12 items-center border-b cursor-default"
              style={{ borderColor: "rgba(235,225,205,0.27)" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ backgroundColor: "rgba(235,225,205,0.22)" }}
            >
              {/* Roman numeral */}
              <div className="col-span-1 py-8 sm:py-10 lg:py-12 pr-4">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(16px, 2vw, 22px)",
                    color: "rgba(235,225,205,0.42)",
                  }}
                >
                  {c.roman}
                </span>
              </div>

              {/* Name + desc */}
              <div className="col-span-8 sm:col-span-9 py-8 sm:py-10 lg:py-12 pr-6">
                <h3
                  className="font-label-sm uppercase tracking-[0.25em] text-[10px] sm:text-[11px] mb-2 transition-colors duration-300 group-hover:text-accent-orange"
                  style={{ color: "rgba(235,225,205,0.9)" }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-[13px] sm:text-[14px] leading-relaxed font-light"
                  style={{ color: "rgba(235,225,205,0.62)" }}
                >
                  {c.desc}
                </p>
              </div>

              {/* Weight */}
              <div className="col-span-3 sm:col-span-2 py-8 sm:py-10 lg:py-12 text-right">
                <motion.span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(28px, 4vw, 48px)",
                    lineHeight: 1,
                    color: "rgba(235,225,205,0.38)",
                  }}
                  whileHover={{
                    color: "#eb4511",
                    transition: { duration: 0.25 },
                  }}
                >
                  {c.weight}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          className="mt-14 sm:mt-16 flex items-center gap-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-8 h-px bg-accent-orange opacity-70" />
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(18px, 2.5vw, 28px)",
              color: "rgba(235,69,17,0.85)",
            }}
          >
            Not everyone passes. That&apos;s the point.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
