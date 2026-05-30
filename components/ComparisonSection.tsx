"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const aspects = [
  {
    aspect:       "What it proves",
    orcred:       "You understand what you built.",
    github:       "You pushed code.",
    leetcode:     "You memorised patterns.",
    certificates: "You finished the course.",
  },
  {
    aspect:       "How it works",
    orcred:       "45-min live review. A senior engineer. Your project, your decisions.",
    github:       "Commit history and repository activity.",
    leetcode:     "Timed algorithmic problem-solving.",
    certificates: "Course modules and a completion test.",
  },
  {
    aspect:       "What it misses",
    orcred:       "Nothing. Understanding is directly assessed.",
    github:       "Whether you understand any of it.",
    leetcode:     "Whether you can engineer a real system.",
    certificates: "Whether you can apply any of it.",
  },
];

const cols = [
  { key: "orcred",       label: "Orcred",       highlight: true  },
  { key: "github",       label: "GitHub",        highlight: false },
  { key: "leetcode",     label: "LeetCode",      highlight: false },
  { key: "certificates", label: "Certificates",  highlight: false },
];

export default function ComparisonSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="comparison"
      className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: "var(--bg-alt)" }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Heading */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          <div
            style={{
              fontSize:      "clamp(22px, 2.8vw, 38px)",
              fontWeight:    400,
              letterSpacing: "-0.02em",
              lineHeight:    1.1,
              color:         "#0f0d0c",
              maxWidth:      "720px",
            }}
          >
            How Orcred compares to other credentials
          </div>
        </motion.div>

        {/* Intro */}
        <motion.div
          className="mb-12 sm:mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
        >
          <div
            style={{
              fontSize:   "clamp(14px, 1.2vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.8,
              color:      "rgba(15,13,12,0.6)",
              maxWidth:   "640px",
            }}
          >
            GitHub shows commits. LeetCode shows patterns. Certificates show completions.
            None of them answer the one question every hiring manager actually has:
            does this person understand what they built?
          </div>
          <div
            style={{
              fontSize:   "clamp(14px, 1.2vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.8,
              color:      "rgba(15,13,12,0.6)",
              maxWidth:   "640px",
              marginTop:  "14px",
            }}
          >
            Here&apos;s how they compare.
          </div>
        </motion.div>

        {/* Table */}
        <div ref={ref} className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: "620px" }}>

            {/* Column headers */}
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(15,13,12,0.15)" }}>
                {/* Aspect header */}
                <th
                  className="text-left pb-4 pr-6"
                  style={{
                    fontSize:      "11px",
                    fontWeight:    700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color:         "#0f0d0c",
                    width:         "14%",
                  }}
                >
                  Aspect
                </th>

                {cols.map((col) => (
                  <th
                    key={col.key}
                    className="text-left pb-4 pr-6"
                    style={{
                      fontSize:      "11px",
                      fontWeight:    700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color:         col.highlight ? "#eb4511" : "#0f0d0c",
                      width:         "21.5%",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows */}
            <tbody>
              {aspects.map((row, i) => (
                <motion.tr
                  key={row.aspect}
                  style={{ borderBottom: "1px solid rgba(15,13,12,0.1)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                >
                  {/* Aspect label */}
                  <td
                    className="py-6 pr-6 align-top"
                    style={{
                      fontSize:      "11px",
                      fontWeight:    700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color:         "#0f0d0c",
                      whiteSpace:    "nowrap",
                    }}
                  >
                    {row.aspect}
                  </td>

                  {cols.map((col) => (
                    <td
                      key={col.key}
                      className="py-6 pr-6 align-top"
                      style={{
                        fontSize:          "clamp(13px, 1.1vw, 15px)",
                        fontWeight:        col.highlight ? 500 : 400,
                        lineHeight:        1.7,
                        color:             col.highlight
                                             ? "#0f0d0c"
                                             : "rgba(15,13,12,0.55)",
                        backgroundColor:   col.highlight
                                             ? "rgba(235,69,17,0.04)"
                                             : "transparent",
                        paddingLeft:       col.highlight ? "12px" : undefined,
                        borderLeft:        col.highlight
                                             ? "2px solid rgba(235,69,17,0.3)"
                                             : undefined,
                      }}
                    >
                      {row[col.key as keyof typeof row]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tagline */}
        <motion.div
          className="mt-12 flex items-center gap-4"
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
              color:         "rgba(15,13,12,0.5)",
              letterSpacing: "0.01em",
            }}
          >
            One conversation changes the signal permanently.
          </div>
        </motion.div>

      </div>
    </section>
  );
}
