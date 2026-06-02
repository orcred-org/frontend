"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

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
      "Questions about these terms? Reach us at: contact@orcred.com",
    ],
  },
];

export default function TermsPage() {
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
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

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
            Terms of Service
          </div>
          <div style={{ fontSize: "clamp(13px, 1.1vw, 14px)", fontWeight: 400, lineHeight: 1.7, color: "rgba(15,13,12,0.4)", fontStyle: "italic" }}>
            Last updated May 2026
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
