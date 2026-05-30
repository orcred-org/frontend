"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CtaSection() {
  const router = useRouter();

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 text-center relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(235,69,17,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Main headline */}
        <motion.h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(52px, 9vw, 120px)",
            lineHeight: 1.0,
            letterSpacing: "-0.01em",
            color: "var(--fg)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease }}
        >
          The standard
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--fg-muted)" }}>
            starts with
          </span>
          <br />
          you.
        </motion.h2>

        {/* CTA */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => router.push("/contact")}
            className="relative font-label-sm uppercase tracking-[0.3em] text-[11px] sm:text-[12px] py-2"
            style={{ color: "var(--fg)", background: "transparent" }}
            initial="rest"
            whileHover="hover"
            animate="rest"
            whileTap={{ scale: 0.98 }}
          >
            Contact Us
            <motion.span
              className="absolute bottom-0 left-0 h-[1px]"
              style={{ background: "#eb4511" }}
              variants={{
                rest:  { width: "0%",   transition: { duration: 0.3,  ease: "easeOut" } },
                hover: { width: "100%", transition: { duration: 0.6,  ease: [0.22, 1, 0.36, 1] } },
              }}
            />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
