"use client";

import { motion } from "framer-motion";

export default function ReviewersSection() {
  return (
    <section id="reviewers" className="bg-zinc-50 border-y border-black/5 py-24 sm:py-32 lg:py-section-gap px-6 sm:px-10 lg:px-margin-edge overflow-hidden">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-20">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-label-sm text-accent-orange uppercase tracking-widest mb-6 sm:mb-10 block text-[10px] sm:text-[11px]">
            FOR SENIOR ENGINEERS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-headline-lg font-bold mb-8 sm:mb-12 leading-none tracking-tight">
            You&apos;ve seen what <br /> broken hiring <br /> looks like.
          </h2>
          <p className="text-base sm:text-lg lg:text-body-lg text-on-surface-variant max-w-xl font-light">
            Join our network of elite reviewers. Get paid to uphold the industry
            standard and help the best talent rise to the top.
          </p>
        </motion.div>

        <motion.div
          className="lg:col-span-5 flex flex-col items-center justify-center p-8 sm:p-12 glass-panel border-accent-orange/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <span className="material-symbols-outlined text-accent-orange text-3xl sm:text-4xl">
                shield_person
              </span>
            </div>
            <h3 className="font-headline-md text-xl sm:text-2xl mb-8 sm:mb-12">
              Apply to the Network
            </h3>
            <motion.button
              className="bg-black text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full font-label-sm uppercase tracking-widest font-bold text-[11px] sm:text-[12px]"
              whileHover={{
                backgroundColor: "#eb4511",
                boxShadow: "0 20px 40px -10px rgba(235,69,17,0.4)",
                scale: 1.04,
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Start Application
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}