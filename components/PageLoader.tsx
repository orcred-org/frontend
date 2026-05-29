"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrcredMark from "@/components/OrcredMark";

const SESSION_KEY = "orcred-loaded";

interface PageLoaderProps {
  onDone?: () => void;
}

export default function PageLoader({ onDone }: PageLoaderProps) {
  // This component is loaded with { ssr: false }, so window/sessionStorage are
  // always available at initialisation time — no hydration mismatch risk.
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(SESSION_KEY);
  });

  useEffect(() => {
    if (!visible) {
      // Returning visitor — unlock Lenis immediately and let the page show
      document.dispatchEvent(new Event("lenis:start"));
      onDone?.();
      return;
    }

    // First visit this session — run the full entrance, then mark as seen
    const t = setTimeout(() => {
      setVisible(false);
      document.dispatchEvent(new Event("lenis:start"));
      sessionStorage.setItem(SESSION_KEY, "1");
      onDone?.();
    }, 2200);

    return () => {
      clearTimeout(t);
      document.dispatchEvent(new Event("lenis:start"));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#010204" }}
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

          {/* Fruit logomark */}
          <motion.div
            className="mb-10"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrcredMark size={88} glow />
          </motion.div>

          {/* Brand name */}
          <motion.p
            className="font-label-sm uppercase tracking-[0.5em] text-[10px] mb-2"
            style={{ color: "rgba(235,225,205,0.60)" }}
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
              color: "rgba(235,225,205,0.40)",
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
