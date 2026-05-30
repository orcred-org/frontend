"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import OrcredMark from "@/components/OrcredMark";
import { useTheme } from "@/lib/ThemeContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsubscribe;
  }, [scrollY]);

  const blur = useTransform(scrollY, [0, 100], [0, 20]);

  return (
    <motion.header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled
          ? theme === "dark" ? "rgba(1,2,4,0.92)" : "rgba(250,247,242,0.92)"
          : "transparent",
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
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          transition: "border-color 0.5s ease",
        }}
      />

      {/* Centered brand mark */}
      <div className="relative flex items-center justify-center h-[68px] px-8">

        {/* Left ornamental rule */}
        <motion.div
          className="absolute left-8 right-[50%] mr-24 h-px pointer-events-none"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative flex items-center gap-3 z-10"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <OrcredMark size={15} glow />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "20px",
              letterSpacing: "0.12em",
              color: "var(--fg)",
              transition: "color 0.4s ease",
            }}
          >
            ORCRED
          </span>
        </Link>

        {/* Right ornamental rule */}
        <motion.div
          className="absolute left-[50%] ml-24 right-8 h-px pointer-events-none"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute right-8 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300"
          style={{ color: "var(--fg-muted)" }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            /* Sun icon */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            /* Moon icon */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

      </div>
    </motion.header>
  );
}
