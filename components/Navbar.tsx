"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "The Standard",         href: "#story"      },
  { label: "How It Works",         href: "#process"    },
  { label: "Assessment Framework", href: "#scores"     },
  { label: "Why Orcred",           href: "#comparison" },
];

function scrollTo(href: string) {
  if (href.startsWith("#")) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Navbar() {
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "var(--bg-page)",
        borderBottom: "1px solid #e2dbd4",
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[80px] px-6 sm:px-10 lg:px-16">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="20" fill="#eb4511"/>
          </svg>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "26px",
              letterSpacing: "-0.01em",
              color: "#0f0d0c",
            }}
          >
            Orcred
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "-0.01em",
                  color: "#4a4440",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#1a1714")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#4a4440")}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "-0.01em",
                  color: "#4a4440",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1a1714")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4a4440")}
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Apply Now */}
        <Link
          href="/contact"
          className="font-label-sm uppercase tracking-[0.2em] text-[11px] px-5 py-2.5 transition-all duration-200"
          style={{
            backgroundColor: "#eb4511",
            color: "#ffffff",
            border: "1px solid #eb4511",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#eb4511";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#eb4511";
            (e.currentTarget as HTMLElement).style.color = "#ffffff";
          }}
        >
          Apply Now
        </Link>

      </div>
    </motion.header>
  );
}
