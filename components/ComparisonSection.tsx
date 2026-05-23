"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const rows = [
  {
    platform: "GitHub",
    proves: "You pushed code.",
    misses: "Whether you understand any of it.",
    orcred: false,
  },
  {
    platform: "LeetCode",
    proves: "You can memorise patterns.",
    misses: "Whether you can engineer a real system.",
    orcred: false,
  },
  {
    platform: "Certificates",
    proves: "You watched the videos.",
    misses: "Whether you can apply any of it.",
    orcred: false,
  },
  {
    platform: "Orcred",
    proves: "You understand what you built.",
    misses: "Nothing. The gap is closed.",
    orcred: true,
  },
];

export default function ComparisonSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: "#010204" }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(235,69,17,0.035) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto">

        {/* Section marker */}
        <motion.div
          className="flex items-center gap-5 mb-16 sm:mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
            style={{ color: "rgba(235,225,205,0.25)" }}
          >
            Why Orcred
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.07)" }} />
        </motion.div>

        {/* Headline */}
        <motion.div
          className="mb-16 sm:mb-20 max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.05, ease }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 5vw, 66px)",
              lineHeight: 1.05,
              color: "rgba(235,225,205,0.9)",
            }}
          >
            Everything else shows.
            <br />
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: "rgba(235,225,205,0.65)",
              }}
            >
              Orcred proves.
            </span>
          </h2>
        </motion.div>

        {/* Table */}
        <div ref={ref} className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[580px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(235,225,205,0.07)" }}>
                {["", "What it proves", "What it misses"].map((col, i) => (
                  <th
                    key={i}
                    className="py-5 text-left font-label-sm uppercase tracking-widest text-[9px]"
                    style={{
                      color: "rgba(235,225,205,0.2)",
                      paddingRight: i < 2 ? "32px" : 0,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.platform}
                  className="group cursor-default"
                  style={{
                    borderBottom: `1px solid ${
                      row.orcred
                        ? "rgba(235,69,17,0.14)"
                        : "rgba(235,225,205,0.045)"
                    }`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
                >
                  {/* Platform name */}
                  <td className="py-9 sm:py-11 pr-8 whitespace-nowrap">
                    <motion.span
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: row.orcred ? 400 : 300,
                        fontSize: "clamp(22px, 2.8vw, 36px)",
                        color: row.orcred
                          ? "#eb4511"
                          : "rgba(235,225,205,0.62)",
                        lineHeight: 1,
                        display: "block",
                        transition: "color 0.3s ease",
                      }}
                      whileHover={
                        !row.orcred
                          ? { color: "rgba(235,225,205,0.82)" }
                          : {}
                      }
                    >
                      {row.platform}
                    </motion.span>
                  </td>

                  {/* Proves */}
                  <td
                    className="py-9 sm:py-11 pr-8 text-[13px] sm:text-[14px] font-light leading-relaxed"
                    style={{
                      color: row.orcred
                        ? "rgba(235,225,205,0.55)"
                        : "rgba(235,225,205,0.25)",
                    }}
                  >
                    {row.proves}
                  </td>

                  {/* Misses */}
                  <td
                    className="py-9 sm:py-11 text-[13px] sm:text-[14px] font-light leading-relaxed"
                    style={{
                      color: row.orcred
                        ? "rgba(235,69,17,0.85)"
                        : "rgba(235,225,205,0.22)",
                    }}
                  >
                    {row.misses}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tagline */}
        <motion.div
          className="mt-16 sm:mt-20 flex items-center gap-4"
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
              fontSize: "clamp(17px, 2.2vw, 26px)",
              color: "rgba(235,225,205,0.50)",
            }}
          >
            One conversation changes the signal permanently.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
