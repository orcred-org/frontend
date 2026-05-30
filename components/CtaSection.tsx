"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = [
  { value: "40–60%", label: "Pass rate" },
  { value: "24 hrs", label: "Score delivery" },
  { value: "₹2,000", label: "Verification fee" },
];

export default function CtaSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* ── Light mode: bold dark full-bleed section ── */
  if (!isDark) {
    return (
      <section
        className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20 text-center"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="max-w-[720px] mx-auto">

          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span className="font-label-sm uppercase tracking-[0.3em] text-[10px]" style={{ color: "#eb4511" }}>
              Get Verified
            </span>
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
          </motion.div>

          <motion.h2
            className="mb-6"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#0f0d0c" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease }}
          >
            If you built something real<br />and you understand it — come in.
          </motion.h2>

          <motion.p
            style={{ fontSize: "clamp(14px, 1.2vw, 16px)", lineHeight: 1.8, color: "#4a4440", maxWidth: "480px", margin: "0 auto 40px" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            One submission. One review. A credential that holds. The standard does not move.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center px-10 py-4 font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
              style={{ backgroundColor: "#eb4511", color: "#ffffff", border: "1px solid #eb4511" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#eb4511";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#eb4511";
                (e.currentTarget as HTMLElement).style.color = "#ffffff";
              }}
            >
              Apply for Verification
            </Link>
          </motion.div>

        </div>
      </section>
    );
  }

  /* ── Dark mode: original unchanged ── */
  const router_push = (path: string) => { window.location.href = path; };

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 text-center relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 55% at 50% 50%, var(--orange-tint) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "300px 300px" }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.h2
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(52px, 9vw, 120px)", lineHeight: 1.0, letterSpacing: "-0.01em", color: "var(--fg)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease }}
        >
          The standard
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--fg-muted)" }}>starts with</span>
          <br />
          you.
        </motion.h2>

        <motion.div className="mt-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}>
          <motion.button
            onClick={() => router_push("/contact")}
            className="relative font-label-sm uppercase tracking-[0.3em] text-[11px] sm:text-[12px] py-2"
            style={{ color: "var(--fg)", background: "transparent" }}
            initial="rest" whileHover="hover" animate="rest" whileTap={{ scale: 0.98 }}
          >
            Contact Us
            <motion.span
              className="absolute bottom-0 left-0 h-[1px]"
              style={{ background: "#eb4511" }}
              variants={{
                rest:  { width: "0%",   transition: { duration: 0.3, ease: "easeOut" } },
                hover: { width: "100%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
