"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using Orcred — including submitting an application, participating in a review session, or browsing this site — you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
    ],
  },
  {
    title: "What Orcred Is",
    body: [
      "Orcred is a professional credentialing platform for AI/ML engineers. We facilitate structured technical review sessions conducted by senior engineers, resulting in a verified credential (an Orcred Score) that attests to the candidate's demonstrated understanding of their work.",
      "Orcred does not guarantee employment, job placement, or any specific outcome as a result of receiving a credential.",
    ],
  },
  {
    title: "Candidate Terms",
    body: [
      "By submitting an application to be verified, you confirm that the project and work described is your own. Misrepresentation of your work is grounds for immediate disqualification and permanent ineligibility.",
      "A session fee may apply at the time of booking. Fees are non-refundable once a review session has been scheduled and confirmed.",
      "Your Orcred Score and credential are tied to a specific project submission. Scores do not transfer between projects.",
    ],
  },
  {
    title: "Reviewer Terms",
    body: [
      "Reviewers agree to conduct sessions honestly, professionally, and in accordance with Orcred's evaluation framework. Scores must reflect genuine assessment of the candidate's demonstrated understanding.",
      "Reviewers may not solicit candidates for private engagements, employment, or any compensation outside of Orcred.",
      "Orcred reserves the right to remove a reviewer from the platform for conduct that undermines the integrity of the credential.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "All platform content, branding, scoring methodology, and design assets are the property of Orcred. You may not reproduce, distribute, or create derivative works without explicit written consent.",
      "Candidate project descriptions submitted during the application process remain the intellectual property of the candidate.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "Orcred is provided on an as-is basis. We make no warranties, express or implied, regarding the platform's availability, accuracy, or fitness for any particular purpose.",
      "To the maximum extent permitted by law, Orcred shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms. We will note the date of the most recent update at the top of this page.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions about these terms? Reach us at: legal@orcred.com",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#010204" }}>

      {/* Subtle ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 20%, rgba(235,69,17,0.03) 0%, transparent 70%)",
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
            style={{ color: "rgba(235,225,205,0.45)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(235,225,205,0.75)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(235,225,205,0.45)")}
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
          <div className="w-8 h-px" style={{ background: "rgba(235,225,205,0.13)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
            style={{ color: "rgba(235,69,17,0.6)" }}
          >
            Legal
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.13)" }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            color: "rgba(235,225,205,0.92)",
            marginBottom: "8px",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          Terms of Service
        </motion.h1>
        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "rgba(235,225,205,0.45)",
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
          style={{ background: "rgba(235,225,205,0.13)" }}
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
                style={{ color: "rgba(235,69,17,0.7)" }}
              >
                {s.title}
              </h2>
              <div className="space-y-3">
                {s.body.map((para, j) => (
                  <p
                    key={j}
                    className="text-[14px] sm:text-[15px] font-light leading-[1.9]"
                    style={{ color: "rgba(235,225,205,0.62)" }}
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
