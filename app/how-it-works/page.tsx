"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Types ── */
interface ListItem {
  label: string;
  body: string;
}

interface ScoreRow {
  range: string;
  meaning: string;
  pass: boolean;
}

interface Dimension {
  label: string;
  weight: string;
  body: string;
}

interface Step {
  num: string;
  title: string;
  intro: string;
  items?: ListItem[];
  dimensions?: Dimension[];
  scoreTable?: ScoreRow[];
  note?: string;
  noteLink?: { label: string; href: string };
}

/* ── Content ── */
const steps: Step[] = [
  {
    num: "01",
    title: "Submit Your Project",
    intro:
      "Everything starts with your submission. Orcred verifies one specific project — something you built, something you own, something you can talk about for an hour without running out of things to say.",
    items: [
      {
        label: "GitHub repository",
        body: "Your actual codebase. Not a fork. Not a tutorial clone. Your own work, with a commit history that reflects genuine building over time.",
      },
      {
        label: "5-minute Loom walkthrough",
        body: "Record yourself explaining what you built and why — the architecture, the decisions. Someone who did not build the project cannot make this video. That is the point.",
      },
      {
        label: "Three build decisions",
        body: "Written in your own words. For each: what you chose, what alternatives you considered, and why. They do not need to be long. They need to be honest and specific.",
      },
      {
        label: "One thing that broke",
        body: "Every real project has this moment. What went wrong, how long it took to figure out, and what the fix was. This single answer tells a reviewer more about your understanding than almost anything else.",
      },
      {
        label: "AI tools declaration",
        body: "Did you use Cursor, Claude, Copilot, or anything else? Declare it. Orcred is not anti-AI. The question is not whether you used AI — it is whether you understand what it built for you.",
      },
    ],
    note: "Incomplete submissions are returned with specific notes on what is missing. You will not be charged until your submission is accepted.",
  },
  {
    num: "02",
    title: "Payment",
    intro:
      "Once your submission is accepted, payment of ₹1,999 confirms your slot in the verification queue. Payment is processed via Razorpay — UPI, cards, and net banking accepted.",
    note: "Full refund if a reviewer cannot be assigned within 10 business days, or if your assigned reviewer cancels and cannot be rescheduled within 5 business days. 50% refund if you cancel more than 48 hours before your call. No refund after the review is completed. Full details in our Terms of Service.",
    noteLink: { label: "Terms of Service", href: "/terms" },
  },
  {
    num: "03",
    title: "AI Build Bot",
    intro:
      "Once payment is confirmed, your AI Build Bot activates for your specific project. It knows your tech stack and the dimensions the reviewer will assess. It is your thinking partner while you prepare — not a shortcut.",
    items: [
      {
        label: "What it does",
        body: "Explains concepts, helps you think through debugging, reviews your code for readability and correctness, and suggests direction when you are stuck.",
      },
      {
        label: "What it will never do",
        body: "Write implementation code, complete functions, or give working solutions. It does not engage with other projects or general topics outside your submission.",
      },
    ],
    note: "You have 50 messages per submission. The credential only means something if you genuinely understand what you built. The Build Bot helps you get there.",
  },
  {
    num: "04",
    title: "Reviewer Matching",
    intro:
      "Your submission is matched to a senior engineer who specialises in your specific domain — NLP, computer vision, MLOps, LLMs, or wherever your project sits. This is not random assignment.",
    items: [
      {
        label: "Reviewer standards",
        body: "Every Orcred reviewer has a minimum of 5 years of industry experience in AI/ML engineering, vetted through a sample review, a calibration session with the founding team, and a signed confidentiality and quality agreement.",
      },
      {
        label: "Conflict policy",
        body: "Your reviewer will never be a student or recent graduate, someone without relevant specialisation in your domain, or anyone with a personal or professional connection to you.",
      },
    ],
    note: "Current target: reviewer assignment within 3–5 business days of payment confirmation.",
  },
  {
    num: "05",
    title: "The Live Socratic Review",
    intro:
      "45 to 60 minutes. Both parties on camera. Mandatory. Every question is generated specifically for your project — there is no question bank and no way to coach for it.",
    items: [
      {
        label: "Identity verification",
        body: "At the start of the call you will be asked to show a valid photo ID matching the name on your Orcred account. This happens before every call without exception.",
      },
      {
        label: "Reviewer anonymity",
        body: "Your reviewer appears under an anonymous display name. Their real name, employer, and LinkedIn are never disclosed. This ensures the assessment is based entirely on your understanding and nothing else.",
      },
      {
        label: "The questions",
        body: "Your reviewer has read your submission thoroughly before the call. They know your GitHub, your Loom, your build decisions. Questions probe specific edge cases, architecture choices, and your understanding of code you claim to own.",
      },
      {
        label: "Recording",
        body: "Every call is recorded with both parties' consent. Stored securely, accessible only to the Orcred founding team for quality control and dispute resolution. Deleted after 90 days unless under active dispute.",
      },
    ],
    note: "The review is not adversarial. It is a genuine technical conversation. If you built it and you understand it — you will be fine.",
  },
  {
    num: "06",
    title: "Score and Written Feedback",
    intro:
      "Within 24 hours of your review, your Orcred Score and written feedback are delivered to your account. Your score is out of 100 across four dimensions.",
    dimensions: [
      {
        label: "Technical Depth",
        weight: "35%",
        body: "How well you understand the architecture, algorithms, and decisions inside your system. The highest weighted dimension because it is the hardest to fake.",
      },
      {
        label: "Communication",
        weight: "25%",
        body: "How clearly you explained your thinking. Can you make a complex system understandable to a smart person who is not inside your head?",
      },
      {
        label: "Reproducibility",
        weight: "20%",
        body: "Could someone else run and understand this project from what you have built and documented? A project only you can run is a liability.",
      },
      {
        label: "Originality",
        weight: "20%",
        body: "Genuine problem solving versus tutorial following. Did you make real decisions or assemble existing pieces without understanding why?",
      },
    ],
    scoreTable: [
      { range: "90 – 100", meaning: "Exceptional — reviewer recommended",                          pass: true  },
      { range: "75 – 89",  meaning: "Strong — ready for industry",                                 pass: true  },
      { range: "60 – 74",  meaning: "Passed — solid with room to grow",                            pass: true  },
      { range: "40 – 59",  meaning: "Did not pass — partial understanding, specific gaps noted",   pass: false },
      { range: "0 – 39",   meaning: "Did not pass — significant gaps in understanding",            pass: false },
    ],
    note: "Pass threshold is 60. Every student — pass or fail — receives specific written feedback across all four dimensions. A rejection with good feedback is more valuable than a pass with no insight.",
  },
  {
    num: "07",
    title: "Your Credential Page",
    intro:
      "If you pass, your Orcred credential page goes live at orcred.com/username/projectname within 24 hours of your score being delivered. It is permanent.",
    items: [
      {
        label: "What it shows",
        body: "Project name and description, tech stack, declared AI tools, review date, your Orcred Score overall and per dimension, and reviewer tier.",
      },
      {
        label: "LinkedIn",
        body: "One-click Add to LinkedIn pre-fills every certification field. Every recruiter who visits your profile sees the Orcred Verified badge with a live link to your credential page.",
      },
      {
        label: "Integrity",
        body: "Every credential is cryptographically signed and server-generated. It cannot be faked or edited. The credential page lives at that URL as long as Orcred exists.",
      },
    ],
  },
];

/* ── Page ── */
export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* Ambient warmth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)",
        }}
      />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "How It Works" }]} />

      <main className="relative z-10 flex-1 max-w-[860px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">

        {/* Eyebrow rule */}
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
            Process
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
          How It Works
        </motion.h1>

        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(18px, 2.5vw, 28px)",
            color: "var(--fg-muted)",
            marginBottom: "32px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          You built something real. We prove it.
        </motion.p>

        {/* Intro */}
        <motion.p
          className="text-[14px] sm:text-[15px] font-light leading-[1.9] mb-14"
          style={{ color: "var(--fg-muted)", maxWidth: "640px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.28 }}
        >
          Orcred is not a quiz. Not a multiple choice test. Not a course completion badge. It is a live technical verification — a conversation with a senior engineer who knows your project inside out before you walk in. Here is exactly what happens from the moment you submit to the moment your credential goes live.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-full h-px mb-16"
          style={{ background: "var(--border)" }}
          initial={{ scaleX: 0, originX: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.32, ease }}
        />

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.9, ease }}
            >
              {/* Step marker */}
              <div className="flex items-center gap-4 mb-7">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    color: "var(--orange-faint)",
                  }}
                >
                  {step.num}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span
                  className="font-label-sm uppercase tracking-[0.38em] text-[9px]"
                  style={{ color: "var(--orange-faint)" }}
                >
                  {step.title}
                </span>
              </div>

              {/* Step heading */}
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(26px, 3.2vw, 42px)",
                  lineHeight: 1.1,
                  color: "var(--fg)",
                  marginBottom: "14px",
                }}
              >
                {step.title}
              </h2>

              {/* Intro */}
              <p
                className="text-[14px] sm:text-[15px] font-light leading-[1.9] mb-7"
                style={{ color: "var(--fg-muted)", maxWidth: "640px" }}
              >
                {step.intro}
              </p>

              {/* Items */}
              {step.items && (
                <div className="space-y-5 mb-7">
                  {step.items.map((item) => (
                    <div key={item.label} className="flex gap-5">
                      <div
                        className="mt-[9px] w-[3px] h-[3px] rounded-full flex-shrink-0"
                        style={{ background: "#eb4511", opacity: 0.65 }}
                      />
                      <div>
                        <span
                          className="font-label-sm uppercase tracking-[0.3em] text-[9px] block mb-1"
                          style={{ color: "var(--fg)" }}
                        >
                          {item.label}
                        </span>
                        <p
                          className="text-[13px] sm:text-[14px] font-light leading-[1.85]"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dimensions */}
              {step.dimensions && (
                <div className="mb-8 border-t" style={{ borderColor: "var(--border)" }}>
                  {step.dimensions.map((d) => (
                    <div
                      key={d.label}
                      className="flex gap-8 py-4 border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="w-[130px] flex-shrink-0 pt-0.5">
                        <span
                          className="font-label-sm uppercase tracking-[0.28em] text-[8px] block"
                          style={{ color: "var(--fg)" }}
                        >
                          {d.label}
                        </span>
                        <span
                          className="font-label-sm text-[10px] block mt-1"
                          style={{ color: "#eb4511", opacity: 0.75 }}
                        >
                          {d.weight}
                        </span>
                      </div>
                      <p
                        className="text-[13px] sm:text-[14px] font-light leading-[1.85]"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        {d.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Score table */}
              {step.scoreTable && (
                <div className="mb-7 border-t" style={{ borderColor: "var(--border)" }}>
                  {step.scoreTable.map((row) => (
                    <div
                      key={row.range}
                      className="flex items-center gap-8 py-3 border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontStyle: "italic",
                          fontWeight: 300,
                          fontSize: "15px",
                          color: row.pass ? "var(--fg)" : "var(--fg-faint)",
                          width: "80px",
                          flexShrink: 0,
                        }}
                      >
                        {row.range}
                      </span>
                      <span
                        className="text-[13px] font-light"
                        style={{ color: row.pass ? "var(--fg-muted)" : "var(--fg-faint)" }}
                      >
                        {row.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Note */}
              {step.note && (
                <p
                  className="text-[12px] sm:text-[13px] font-light leading-[1.85] italic pl-4"
                  style={{
                    color: "var(--fg-faint)",
                    borderLeft: "2px solid var(--border)",
                  }}
                >
                  {step.note}
                  {step.noteLink && (
                    <>
                      {" "}
                      <Link
                        href={step.noteLink.href}
                        className="underline underline-offset-2 transition-colors duration-200"
                        style={{ color: "var(--orange-faint)" }}
                      >
                        {step.noteLink.label}
                      </Link>
                      .
                    </>
                  )}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Section divider */}
        <div className="w-full h-px my-20" style={{ background: "var(--border)" }} />

        {/* If You Did Not Pass */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <span
              className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
              style={{ color: "var(--orange-faint)" }}
            >
              If You Did Not Pass
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <div className="space-y-5 max-w-[640px]">
            <p
              className="text-[14px] sm:text-[15px] font-light leading-[1.9]"
              style={{ color: "var(--fg-muted)" }}
            >
              Failing an Orcred review is not the end. It is specific, documented, actionable information about exactly where your understanding has gaps. You receive your full score breakdown and written feedback within 24 hours. Read it carefully. The reviewer has told you exactly what to fix.
            </p>
            <p
              className="text-[14px] sm:text-[15px] font-light leading-[1.9]"
              style={{ color: "var(--fg-muted)" }}
            >
              If you do not pass, you receive a detailed written breakdown of every dimension you were scored on — exactly what fell short and exactly what to fix. When you are ready, you come back as a new submission. New reviewer. New questions. Full fee. Clean slate.
            </p>
          </div>
        </motion.div>

        {/* One Final Thing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
          className="py-16 border-t border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px] block mb-8"
            style={{ color: "var(--fg-faint)" }}
          >
            One Final Thing
          </span>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(22px, 3.2vw, 40px)",
              lineHeight: 1.25,
              color: "var(--fg)",
              maxWidth: "680px",
            }}
          >
            Orcred has a 40–60% pass rate. That number is not going to change. Not for growth. Not for partnerships. Not for anyone.
          </p>

          <p
            className="text-[14px] sm:text-[15px] font-light leading-[1.9] mt-6 max-w-[580px]"
            style={{ color: "var(--fg-muted)" }}
          >
            That pass rate is the only reason the credential means anything. Every company that sees Orcred Verified on a profile knows that between 40 and 60 percent of people who tried did not get it. That is what makes the ones who did worth paying attention to.
          </p>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(18px, 2.5vw, 26px)",
              color: "var(--fg-muted)",
              marginTop: "28px",
            }}
          >
            If you built something real and you understand it — come in.
          </p>
        </motion.div>

      </main>
    </div>
  );
}
