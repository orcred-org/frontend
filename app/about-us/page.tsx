"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)",
        }}
      />

      <main className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-label-sm uppercase tracking-[0.32em] text-[10px] transition-colors duration-200"
            style={{ color: "var(--fg-faint)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-faint)")}
          >
            ← Home
          </Link>
        </motion.div>

        <motion.div className="flex items-center gap-4 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <div className="w-8 h-px" style={{ background: "var(--border)" }} />
          <div className="font-label-sm uppercase tracking-[0.42em] text-[9px]" style={{ color: "var(--orange-faint)" }}>
            Company
          </div>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        <motion.h1
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, color: "var(--fg)", marginBottom: "48px" }}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}
        >
          About Us
        </motion.h1>

        <motion.div
          className="w-full h-px mb-12"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: "left" }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.25, ease }}
        />

      </main>
    </div>
  );
}
