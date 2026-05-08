"use client";

import { motion } from "framer-motion";

interface CtaProps {
  onApply: () => void;
}

export default function CtaSection({ onApply }: CtaProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 lg:px-margin-edge text-center bg-white mesh-gradient">
      <motion.h2
        className="font-display-2xl text-primary text-3d-enhanced mb-6 uppercase leading-[0.85] text-[80px] sm:text-[120px] lg:text-display-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        The standard
        <br />
        starts with
        <br />
        you.
      </motion.h2>

      <motion.p
        className="text-base sm:text-lg text-on-surface-variant font-light mb-10 sm:mb-14 max-w-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
      >
        5 founding reviewers. 2 founders. Built from nothing.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      >
        <motion.button
          onClick={onApply}
          className="bg-black/90 text-white px-12 sm:px-16 py-4 sm:py-6 rounded-full font-label-sm uppercase tracking-widest font-bold text-[11px] sm:text-[12px] hover:bg-accent-orange transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          Apply for a Founding Spot
        </motion.button>
      </motion.div>

      <motion.p
        className="mt-8 sm:mt-12 font-label-sm text-on-surface-variant/40 tracking-[0.4em] uppercase text-[10px] sm:text-[11px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        Pure signal. Zero noise.
      </motion.p>
    </section>
  );
}