"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationForm({ isOpen, onClose }: ApplicationFormProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white flex flex-col"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 sm:px-10 lg:px-margin-edge h-[72px] border-b border-black/5 flex-shrink-0">
            <div className="font-bold text-2xl sm:text-3xl tracking-tighter text-primary flex items-center gap-1.5">
              Pruv<span className="asymmetric-dot mb-3" />
            </div>
            <div className="flex items-center gap-6">
              <span className="hidden sm:block font-label-sm text-on-surface-variant/40 uppercase tracking-widest text-[10px] sm:text-[11px]">
                Founding Reviewer Application
              </span>
              <motion.button
                onClick={onClose}
                className="flex items-center gap-2 font-label-sm text-black/60 hover:text-black transition-colors uppercase tracking-widest text-[11px] sm:text-[12px]"
                whileHover={{ x: -2 }}
              >
                ← Close
              </motion.button>
            </div>
          </div>

          {/* Tally Form */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://tally.so/embed/1ADkrO?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Founding Reviewer Application"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}