"use client";

import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 lg:px-margin-edge text-center bg-white mesh-gradient">
      <motion.h2
        className="font-display-2xl text-primary text-3d-enhanced mb-12 sm:mb-16 lg:mb-20 uppercase leading-[0.85] text-[80px] sm:text-[120px] lg:text-display-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        Ready
        <br />
        to Pruv?
      </motion.h2>

      <motion.div
        className="glass-panel p-2 sm:p-3 lg:p-4 rounded-full flex flex-col sm:flex-row items-center w-full max-w-sm sm:max-w-xl lg:max-w-2xl border-black/5 shadow-2xl glow-hover gap-2 sm:gap-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      >
        <input
          aria-label="Email Address"
          className="bg-transparent border-none focus:ring-0 px-6 sm:px-10 py-4 sm:py-5 font-body-md w-full text-base sm:text-lg placeholder:opacity-30 rounded-full"
          placeholder="Enter your email"
          type="email"
        />
        <motion.button
          className="w-full sm:w-auto bg-accent-orange text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-label-sm whitespace-nowrap uppercase tracking-widest font-bold text-[11px] sm:text-[12px]"
          whileHover={{ backgroundColor: "#000", scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          Join Waitlist
        </motion.button>
      </motion.div>

      <motion.p
        className="mt-8 sm:mt-12 font-label-sm text-on-surface-variant/40 tracking-[0.4em] uppercase text-[10px] sm:text-[11px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        PURE SIGNAL. ZERO NOISE.
      </motion.p>
    </section>
  );
}