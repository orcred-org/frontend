"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

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
    title: "Cookies & Analytics",
    body: [
      "We use Google Analytics (GA4) to understand how visitors use this site — pages visited, session duration, and general usage patterns. This data is anonymised and aggregated; it does not identify you personally.",
      "Google Analytics cookies are only set after you explicitly click Accept on the cookie consent banner. If you decline, no analytics cookies are placed and no data is sent to Google.",
      "We use no advertising cookies, retargeting pixels, or any other third-party tracking. Essential session storage (not a cookie) is used solely to maintain your form state within a single visit.",
      "You can withdraw consent at any time by clearing your browser cookies and declining when the banner next appears.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "The site is hosted on Vercel. Font assets are loaded from Google Fonts. With your consent, anonymised usage data is sent to Google Analytics. None of these services receive your application data or personal information submitted through our forms.",
      "We do not use any CRM, advertising, or data-broker platforms.",
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
      "For any privacy-related questions or requests, reach us at: contact@orcred.com",
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
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <main className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">

        {/* Page title */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#eb4511" }}>
              Legal
            </span>
          </div>
          <div style={{ fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#0f0d0c", marginBottom: 12 }}>
            Privacy Policy
          </div>
          <div style={{ fontSize: "clamp(13px, 1.1vw, 14px)", fontWeight: 400, lineHeight: 1.7, color: "rgba(15,13,12,0.4)", fontStyle: "italic" }}>
            Last updated June 2026
          </div>
        </motion.div>

        <div className="w-full h-px mb-12" style={{ background: "rgba(15,13,12,0.1)" }} />

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease }}
            >
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#eb4511", marginBottom: 12 }}>
                {s.title}
              </div>
              <div className="space-y-3">
                {s.body.map((para, j) => (
                  <p
                    key={j}
                    style={{ fontSize: "clamp(14px, 1.2vw, 15px)", fontWeight: 400, lineHeight: 1.85, color: "rgba(15,13,12,0.58)" }}
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
