"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const scores = [
  {
    title: "Technical Depth",
    pct: "35%",
    desc: "Algorithmic complexity, efficient resource management, and hardware-aware optimization.",
  },
  {
    title: "Communication",
    pct: "25%",
    desc: "Ability to articulate design choices and explain complex concepts simply and effectively.",
  },
  {
    title: "Reproducibility",
    pct: "20%",
    desc: "Code hygiene, environment configuration, and clarity of documentation for third-party use.",
  },
  {
    title: "Originality",
    pct: "20%",
    desc: "Novelty of implementation and independence from standard template code or tutorial structures.",
  },
];

export default function ScoresSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section id="scores" className="py-24 sm:py-32 lg:py-section-gap bg-surface-container-low/30 px-6 sm:px-10 lg:px-margin-edge relative">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-24 lg:mb-32 gap-6 sm:gap-8">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold leading-none tracking-tight">
              The Pruv <br /> Score.
            </h2>
          </motion.div>
          <motion.p
            className="text-base sm:text-lg lg:text-body-lg text-on-surface-variant max-w-xs pb-2 border-b border-black/10 font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            Multidimensional technical assessment across four critical vectors.
          </motion.p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {scores.map((score, i) => (
            <motion.div
              key={score.title}
              className="glass-panel p-8 sm:p-12 lg:p-16 hover:border-accent-orange transition-all group bg-white/40 glow-hover relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-orange/0 group-hover:bg-accent-orange/5 rounded-full blur-3xl transition-colors" />
              <div className="flex justify-between items-baseline mb-6 sm:mb-10 lg:mb-12">
                <h3 className="font-headline-md text-xl sm:text-2xl lg:text-3xl">{score.title}</h3>
                <motion.span
                  className="font-display-xl text-3xl sm:text-4xl lg:text-5xl group-hover:text-accent-orange transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {score.pct}
                </motion.span>
              </div>
              <p className="font-body-md text-on-surface-variant text-sm sm:text-base lg:text-lg">
                {score.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="font-headline-md text-accent-orange italic text-xl sm:text-2xl lg:text-3xl tracking-tighter">
            Not everyone passes. That&apos;s the point.
          </p>
        </motion.div>
      </div>
    </section>
  );
}