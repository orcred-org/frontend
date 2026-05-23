"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsubscribe;
  }, [scrollY]);

  const blur = useTransform(scrollY, [0, 100], [0, 20]);

  return (
    <motion.header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(1,2,4,0.92)" : "rgba(0,0,0,0)",
        transition: "background-color 0.5s ease",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Backdrop blur */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
          WebkitBackdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
          borderBottom: scrolled ? "1px solid rgba(235,225,205,0.13)" : "1px solid transparent",
          transition: "border-color 0.5s ease",
        }}
      />

      {/* Centered brand mark */}
      <div className="relative flex items-center justify-center h-[68px] px-8">

        {/* Left ornamental rule */}
        <motion.div
          className="absolute left-8 right-[50%] mr-24 h-px pointer-events-none"
          style={{ background: scrolled ? "rgba(235,225,205,0.14)" : "rgba(235,225,205,0.12)" }}
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 z-10">
          <div
            className="w-[15px] h-[15px] rounded-full bg-accent-orange flex-shrink-0"
            style={{ boxShadow: "0 0 10px 3px rgba(235,69,17,0.38)" }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "20px",
              letterSpacing: "0.12em",
              color: scrolled ? "rgba(235,225,205,0.88)" : "rgba(235,225,205,0.82)",
              transition: "color 0.4s ease",
            }}
          >
            ORCRED
          </span>
        </Link>

        {/* Right ornamental rule */}
        <motion.div
          className="absolute left-[50%] ml-24 right-8 h-px pointer-events-none"
          style={{ background: scrolled ? "rgba(235,225,205,0.14)" : "rgba(235,225,205,0.12)" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

      </div>
    </motion.header>
  );
}
