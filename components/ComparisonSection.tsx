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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="py-24 sm:py-32 lg:py-section-gap px-6 sm:px-10 lg:px-margin-edge bg-white">
      <div className="max-w-container-max mx-auto">
        <motion.div
          className="mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-label-sm text-accent-orange tracking-[0.3em] uppercase text-[10px] sm:text-[11px]">
            Why Pruv
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold mt-4 leading-none tracking-tight">
            Everything else <br /> shows. Pruv proves.
          </h2>
        </motion.div>

        <div ref={ref} className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-6 sm:py-8 text-left font-label-sm text-on-surface-variant uppercase tracking-widest opacity-40 text-[10px] sm:text-[11px]">
                  PLATFORM
                </th>
                <th className="py-6 sm:py-8 text-left font-label-sm text-on-surface-variant uppercase tracking-widest opacity-40 text-[10px] sm:text-[11px]">
                  WHAT IT PROVES
                </th>
                <th className="py-6 sm:py-8 text-left font-label-sm text-on-surface-variant uppercase tracking-widest opacity-40 text-[10px] sm:text-[11px]">
                  WHAT IT MISSES
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {rows.map((row, i) => (
                <motion.tr
                  key={row.platform}
                  className="border-b border-black/5 group"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                >
                  <td className="py-8 sm:py-10 lg:py-12 font-bold text-xl sm:text-2xl lg:text-3xl text-primary transition-all group-hover:pl-4 group-hover:text-accent-orange tracking-tight">
                    {row.platform}
                  </td>
                  <td className="py-8 sm:py-10 lg:py-12 font-body-md text-sm sm:text-base lg:text-lg pr-4">
                    {row.proves}
                  </td>
                  <td className="py-8 sm:py-10 lg:py-12 font-body-md text-sm sm:text-base lg:text-lg">
                    {row.misses}
                  </td>
                </motion.tr>
              ))}
              <motion.tr
  className="border-b border-black/5 group cursor-default"
  initial={{ opacity: 0 }}
  animate={inView ? { opacity: 1 } : {}}
  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
  whileHover={{
  backgroundColor: "rgba(235,69,17,0.04)",
  transition: { duration: 0.2, ease: "easeOut" },
}}
whileTap={{
    backgroundColor: "rgba(235,69,17,0.06)",
    transition: { duration: 0.1 },
  }}
>
  <td className="py-8 sm:py-10 lg:py-12 font-bold text-xl sm:text-2xl lg:text-3xl text-primary transition-all group-hover:pl-4 group-hover:text-accent-orange tracking-tight">
    Pruv
  </td>
  <td className="py-8 sm:py-10 lg:py-12 font-body-md text-sm sm:text-base lg:text-lg pr-4">
    You understand what you built.
  </td>
  <td className="py-8 sm:py-10 lg:py-12 font-body-md text-sm sm:text-base lg:text-lg text-accent-orange font-medium">
    Nothing. The gap is closed.
  </td>
</motion.tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}