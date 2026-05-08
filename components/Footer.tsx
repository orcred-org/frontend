"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-margin-edge">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20 items-start">
          <motion.div
            className="sm:col-span-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-primary flex items-center gap-2 mb-6 sm:mb-10">
              Pruv<span className="asymmetric-dot" />
            </div>
            <p className="font-body-md text-on-surface-variant max-w-sm text-sm sm:text-base">
              The new global standard for verifying technical engineering depth in
              the era of AI-augmented development.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <span className="font-label-sm opacity-30 uppercase tracking-widest block mb-3 sm:mb-4 text-[10px] sm:text-[11px]">
              NAVIGATION
            </span>
            {["Methodology", "Process", "Ethics"].map((item) => (
              <Link
                key={item}
                className="font-label-sm text-primary hover:text-accent-orange transition-colors block uppercase text-[11px] sm:text-[12px]"
                href="#"
              >
                {item}
              </Link>
            ))}
          </motion.div>

          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <span className="font-label-sm opacity-30 uppercase tracking-widest block mb-3 sm:mb-4 text-[10px] sm:text-[11px]">
              LEGAL &amp; CONTACT
            </span>
            {["Terms", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                className="font-label-sm text-primary hover:text-accent-orange transition-colors block uppercase text-[11px] sm:text-[12px]"
                href="#"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        </div>

        <div className="mt-16 sm:mt-24 lg:mt-32 pt-8 sm:pt-12 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
          <div className="font-label-sm text-on-surface-variant/40 tracking-widest text-[10px] sm:text-[11px] text-center sm:text-left">
            © 2024 PRUV SYSTEM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-label-sm opacity-40 uppercase tracking-widest text-[10px] sm:text-[11px]">
              System Status: Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}