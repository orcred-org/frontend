"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const rows = [
  {
    platform: "GitHub",
    proves: "You pushed code.",
    misses: "Whether you understand any of it.",
  },
  {
    platform: "LeetCode",
    proves: "You can memorise patterns.",
    misses: "Whether you can engineer a real system.",
  },
  {
    platform: "Certificates",
    proves: "You watched the videos.",
    misses: "Whether you can apply any of it.",
  },
];

export default function ComparisonSection() {
  const ref = useRef<HTMLTableElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="py-24 sm:py-32 lg:py-section-gap px-6 sm:px-10 lg:px-margin-edge bg-white">
      <div className="max-w-container-max mx-auto overflow-x-auto">
        <table ref={ref} className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-black/10">
              <th className="py-6 sm:py-10 lg:py-12 text-left font-label-sm text-on-surface-variant uppercase tracking-widest opacity-40 text-[10px] sm:text-[11px]">PLATFORM</th>
              <th className="py-6 sm:py-10 lg:py-12 text-left font-label-sm text-on-surface-variant uppercase tracking-widest opacity-40 text-[10px] sm:text-[11px]">WHAT IT PROVES</th>
              <th className="py-6 sm:py-10 lg:py-12 text-left font-label-sm text-on-surface-variant uppercase tracking-widest opacity-40 text-[10px] sm:text-[11px]">WHAT IT MISSES</th>
            </tr>
          </thead>
          <tbody className="text-on-surface-variant">
            {rows.map((row, i) => (
              <motion.tr
                key={row.platform}
                className="border-b border-black/5 group"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <td className="py-8 sm:py-12 lg:py-14 font-bold text-xl sm:text-2xl lg:text-3xl text-primary transition-all group-hover:pl-4 group-hover:text-accent-orange tracking-tight">
                  {row.platform}
                </td>
                <td className="py-8 sm:py-12 lg:py-14 font-body-md text-sm sm:text-base lg:text-lg pr-4">{row.proves}</td>
                <td className="py-8 sm:py-12 lg:py-14 font-body-md text-sm sm:text-base lg:text-lg">{row.misses}</td>
              </motion.tr>
            ))}
            <motion.tr
              className="relative bg-black text-white"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              <td className="py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-10 font-bold text-3xl sm:text-4xl lg:text-5xl italic border-l-8 border-accent-orange tracking-tight">Pruv</td>
              <td className="py-12 sm:py-16 lg:py-20 text-white font-light text-base sm:text-xl lg:text-2xl pr-4">You understand what you built.</td>
              <td className="py-12 sm:py-16 lg:py-20 text-accent-orange font-bold text-base sm:text-xl lg:text-2xl tracking-tighter">Nothing. The gap is closed.</td>
            </motion.tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}