"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

const navLinks = [
  { label: "The Problem", href: "#story"      },
  { label: "Platform",    href: "#platform"   },
  { label: "Process",     href: "#process"    },
  { label: "Scores",      href: "#scores"     },
  { label: "Compare",     href: "#comparison" },
];

function scrollTo(href: string) {
  if (href.startsWith("#")) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsubscribe;
  }, [scrollY]);

  const blur = useTransform(scrollY, [0, 100], [0, 20]);

  /* ── Light mode navbar ── */
  if (!isDark) {
    return (
      <motion.header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(250,247,242,0.95)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[68px] px-6 sm:px-10 lg:px-16">

          {/* Brand — orange circle only */}
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" fill="#eb4511"/>
            </svg>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-label-sm uppercase tracking-[0.32em] text-[9px] transition-colors duration-200"
                style={{ color: "var(--fg-muted)", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side — Contact + theme toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="font-label-sm uppercase tracking-[0.32em] text-[9px] px-4 py-2 border transition-colors duration-200"
              style={{ borderColor: "#eb4511", color: "#eb4511" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#eb4511"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#eb4511"; }}
            >
              Contact Us
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8"
              style={{ color: "var(--fg-muted)", background: "none", border: "none", cursor: "pointer" }}
              aria-label="Switch to dark mode"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
          </div>

        </div>
      </motion.header>
    );
  }

  /* ── Dark mode navbar (original centred wordmark) ── */
  return (
    <motion.header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(1,2,4,0.92)" : "transparent",
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

      {/* Centred brand */}
      <div className="relative flex items-center justify-center h-[68px] px-8">

        <motion.div
          className="absolute left-8 right-[50%] mr-24 h-px pointer-events-none"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        <Link
          href="/"
          className="relative flex items-center gap-3 z-10"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" fill="#eb4511"/>
          </svg>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 500,
              fontSize: "20px",
              letterSpacing: "0.09em",
              color: "var(--fg)",
              transition: "color 0.4s ease",
            }}
          >
            ORCRED
          </span>
        </Link>

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
          className="absolute right-8 z-10 flex items-center justify-center w-8 h-8"
          style={{ color: "var(--fg-muted)", background: "none", border: "none" }}
          aria-label="Toggle theme"
        >
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
        </button>

      </div>
    </motion.header>
  );
}
