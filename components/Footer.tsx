"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16"
      style={{
        backgroundColor: "#06090e",
        borderTop: "1px solid rgba(235,225,205,0.06)",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20 items-start">

          {/* Brand */}
          <motion.div
            className="sm:col-span-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 40px)",
                letterSpacing: "0.06em",
                color: "rgba(235,225,205,0.82)",
              }}
            >
              <div
                className="w-[13px] h-[13px] rounded-full flex-shrink-0"
                style={{
                  background: "#eb4511",
                  boxShadow: "0 0 10px 3px rgba(235,69,17,0.35)",
                }}
              />
              ORCRED
            </div>
            <p
              className="text-[13px] sm:text-[14px] leading-relaxed font-light max-w-sm"
              style={{ color: "rgba(235,225,205,0.32)" }}
            >
              The verification standard for AI/ML engineers.
              Real projects. Real engineers. Real credentials.
            </p>
            <p
              className="text-[12px] mt-3 font-light"
              style={{ color: "rgba(235,225,205,0.18)" }}
            >
              Built by two founders. From scratch.
            </p>
          </motion.div>

          {/* Platform links */}
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <span
              className="font-label-sm uppercase tracking-widest block mb-4 text-[9px] sm:text-[10px]"
              style={{ color: "rgba(235,225,205,0.2)" }}
            >
              Platform
            </span>
            {[
              { label: "How it Works",     href: "#process"   },
              { label: "The Orcred Score", href: "#scores"    },
              { label: "For Reviewers",    href: "#reviewers" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-label-sm uppercase tracking-widest block text-[10px] sm:text-[11px] transition-colors duration-200 hover:text-accent-orange"
                style={{ color: "rgba(235,225,205,0.42)" }}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>

          {/* Legal links */}
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <span
              className="font-label-sm uppercase tracking-widest block mb-4 text-[9px] sm:text-[10px]"
              style={{ color: "rgba(235,225,205,0.2)" }}
            >
              Legal &amp; Contact
            </span>
            {["Terms", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-label-sm uppercase tracking-widest block text-[10px] sm:text-[11px] transition-colors duration-200 hover:text-accent-orange"
                style={{ color: "rgba(235,225,205,0.42)" }}
              >
                {item}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 sm:mt-24 pt-8 sm:pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8"
          style={{ borderTop: "1px solid rgba(235,225,205,0.05)" }}
        >
          <div
            className="font-label-sm tracking-widest text-[9px] sm:text-[10px] uppercase text-center sm:text-left"
            style={{ color: "rgba(235,225,205,0.2)" }}
          >
            © 2026 ORCRED. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-[7px] h-[7px] rounded-full bg-green-500 animate-pulse" />
            <span
              className="font-label-sm uppercase tracking-widest text-[9px] sm:text-[10px]"
              style={{ color: "rgba(235,225,205,0.2)" }}
            >
              Now Recruiting Founding Reviewers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
