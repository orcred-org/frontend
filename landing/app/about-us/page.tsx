"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

const paragraphs = [
  "Between us we've seen both sides of this — what it looks like when real builders get filtered out before anyone reads a line of their code, and what it looks like inside engineering teams when the wrong person gets hired because they interviewed well.",
  "We kept arriving at the same conclusion. The way AI/ML engineers are evaluated in India is broken in a way that consistently hurts the people who deserved to get through the most.",
  "We started Orcred in 2026. We're still early. No big team, no fancy backing. Just two people who couldn't stop thinking about this problem long enough to decide that waiting for someone else to fix it wasn't an option anymore.",
  "So we built it ourselves.",
  "That's us.",
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <main className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">

        {/* Page title */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#eb4511" }}>
              Company
            </span>
          </div>
          <div style={{ fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#0f0d0c", marginBottom: 12 }}>
            About Us
          </div>
          <div style={{ fontSize: "clamp(14px, 1.2vw, 16px)", fontWeight: 400, lineHeight: 1.7, color: "rgba(15,13,12,0.45)", fontStyle: "italic" }}>
            Two founders. One problem we couldn&apos;t walk away from.
          </div>
        </motion.div>

        <div className="w-full h-px mb-12" style={{ background: "rgba(15,13,12,0.1)" }} />

        {/* Body */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          {paragraphs.map((para, i) => (
            <p
              key={i}
              style={{ fontSize: "clamp(14px, 1.2vw, 15px)", fontWeight: 400, lineHeight: 1.9, color: "rgba(15,13,12,0.58)" }}
            >
              {para}
            </p>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
