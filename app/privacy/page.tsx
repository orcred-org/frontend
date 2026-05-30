"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you submit an application — either to get verified or to become a reviewer — we collect the information you provide directly: your name, email address, GitHub or LinkedIn profile, project details, and any written responses you include in the form.",
      "We do not collect any data passively beyond standard server logs (IP address, browser type, page visit timestamps) that are retained briefly for security purposes.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "Your application data is used solely to evaluate your submission and contact you about next steps. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
      "If you are accepted as a reviewer, limited professional information (name, verified credential) may appear on the Orcred platform as part of your public reviewer profile, with your consent.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "Application data is retained for the duration of the review process and for a reasonable period thereafter in case of follow-up. You may request deletion of your data at any time by emailing us.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "This site uses no tracking cookies. We use only essential session storage to maintain your form state within a single visit. No third-party analytics or advertising cookies are set.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "The site is hosted on Vercel. Font assets are loaded from Google Fonts. Neither service receives your application data. We do not use any third-party analytics, CRM, or advertising platforms.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You have the right to access, correct, or delete personal data we hold about you. To exercise these rights, contact us at the email below. We will respond within 30 days.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For any privacy-related questions or requests, reach us at: privacy@orcred.com",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* Subtle ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ── */}
      <main className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-label-sm uppercase tracking-[0.32em] text-[10px] transition-colors duration-200"
            style={{ color: "var(--fg-faint)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-faint)")}
          >
            ← Home
          </Link>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="w-8 h-px" style={{ background: "var(--border)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
            style={{ color: "var(--orange-faint)" }}
          >
            Legal
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            color: "var(--fg)",
            marginBottom: "8px",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "var(--fg-faint)",
            marginBottom: "48px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Last updated May 2026
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-full h-px mb-12"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
        />

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease }}
            >
              <h2
                className="font-label-sm uppercase tracking-[0.32em] text-[10px] mb-4"
                style={{ color: "var(--orange-muted)" }}
              >
                {s.title}
              </h2>
              <div className="space-y-3">
                {s.body.map((para, j) => (
                  <p
                    key={j}
                    className="text-[14px] sm:text-[15px] font-light leading-[1.9]"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </main>

    </div>
  );
}
