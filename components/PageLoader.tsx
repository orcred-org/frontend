"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  onDone?: () => void;
}

export default function PageLoader({ onDone }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Lock scroll and snap to top so any accidental scroll during loading is ignored
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      // Unlock scroll before exit animation begins
      document.body.style.overflow = "";
      setVisible(false);
      onDone?.();
    }, 2200);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#06090e" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
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

          {/* Concentric seal */}
          <div className="relative w-[80px] h-[80px] mb-10">
            <motion.div
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: "rgba(235,69,17,0.38)" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute inset-[9px] rounded-full border"
              style={{ borderColor: "rgba(235,69,17,0.18)" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-[15px] h-[15px] rounded-full"
                style={{
                  background: "#eb4511",
                  boxShadow: "0 0 20px 5px rgba(235,69,17,0.5)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Brand name */}
          <motion.p
            className="font-label-sm uppercase tracking-[0.5em] text-[10px] mb-2"
            style={{ color: "rgba(235,225,205,0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            Orcred
          </motion.p>

          <motion.p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "14px",
              color: "rgba(235,225,205,0.2)",
              letterSpacing: "0.05em",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            The Verification Standard
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
