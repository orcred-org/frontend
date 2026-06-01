"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

interface HeroProps { onApply: () => void; }

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 1.1, delay, ease } },
});
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 1.3, delay, ease } },
});

const dims = [
  { label: "Tech Depth",      score: 91 },
  { label: "Communication",   score: 84 },
  { label: "Reproducibility", score: 88 },
  { label: "Originality",     score: 79 },
];

/* ── Corner registration mark helper ── */
function Corner({ top, right, bottom, left }: {
  top?: number; right?: number; bottom?: number; left?: number;
}) {
  const bt = top    !== undefined;
  const br = right  !== undefined;
  const bb = bottom !== undefined;
  const bl = left   !== undefined;
  return (
    <div style={{
      position: "absolute",
      width: 11, height: 11,
      top, right, bottom, left,
      borderTop:    bt ? "1px solid rgba(235,69,17,0.45)" : "none",
      borderRight:  br ? "1px solid rgba(235,69,17,0.45)" : "none",
      borderBottom: bb ? "1px solid rgba(235,69,17,0.45)" : "none",
      borderLeft:   bl ? "1px solid rgba(235,69,17,0.45)" : "none",
    }} />
  );
}

/* ── Certificate card ── */
function CertificateCard() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, delay: 0.5, ease }}
      style={{ position: "relative", width: "100%", maxWidth: 380 }}
    >
      {/* Offset shadow layer */}
      <div style={{
        position: "absolute", inset: 0,
        transform: "translate(5px, 7px)",
        backgroundColor: "rgba(235,69,17,0.06)",
        border: "1px solid rgba(235,69,17,0.12)",
      }} />

      {/* Outer border */}
      <div style={{
        position: "relative",
        backgroundColor: "#fdf9f4",
        border: "1px solid rgba(15,13,12,0.16)",
        padding: "3px",
      }}>
        {/* Inner inset border */}
        <div style={{
          border: "0.5px solid rgba(15,13,12,0.09)",
          padding: "26px 24px 20px",
          position: "relative",
        }}>
          {/* Registration marks */}
          <Corner top={5}    left={5}   />
          <Corner top={5}    right={5}  />
          <Corner bottom={5} left={5}   />
          <Corner bottom={5} right={5}  />

          {/* Header row */}
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            marginBottom: 16, paddingBottom: 14,
            borderBottom: "0.5px solid rgba(15,13,12,0.09)",
          }}>
            <div>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.42em",
                textTransform: "uppercase", color: "#0f0d0c", marginBottom: 2,
              }}>
                Orcred
              </div>
              <div style={{
                fontSize: 8, fontWeight: 400, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(15,13,12,0.4)",
              }}>
                Certificate of Verification
              </div>
            </div>

            {/* Concentric seal */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "1px solid rgba(235,69,17,0.32)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <div style={{
                width: 25, height: 25, borderRadius: "50%",
                border: "0.5px solid rgba(235,69,17,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: "#eb4511", opacity: 0.75,
                }} />
              </div>
            </div>
          </div>

          {/* Candidate */}
          <div style={{
            fontSize: 7, fontWeight: 600, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "rgba(15,13,12,0.3)", marginBottom: 3,
          }}>
            Candidate
          </div>
          <div style={{
            fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
            color: "#0f0d0c", marginBottom: 2,
          }}>
            Arjun Mehta
          </div>
          <div style={{
            fontSize: 10, color: "rgba(15,13,12,0.42)",
            letterSpacing: "-0.01em", marginBottom: 18,
          }}>
            RAG Pipeline · LangChain · Pinecone · FastAPI
          </div>

          {/* Score + bars row */}
          <div style={{
            padding: "14px 0 16px",
            borderTop: "0.5px solid rgba(15,13,12,0.08)",
            borderBottom: "0.5px solid rgba(15,13,12,0.08)",
            marginBottom: 16,
            display: "flex", alignItems: "stretch", gap: 16,
          }}>
            {/* Large score */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
              <span style={{
                fontSize: 58, fontWeight: 700,
                letterSpacing: "-0.05em", lineHeight: 1, color: "#0f0d0c",
              }}>87</span>
              <div style={{ paddingBottom: 7, display: "flex", flexDirection: "column", gap: 1 }}>
                <span style={{ fontSize: 13, color: "#eb4511", fontWeight: 400, lineHeight: 1 }}>/100</span>
                <span style={{
                  fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(15,13,12,0.28)", lineHeight: 1,
                }}>Score</span>
              </div>
            </div>

            {/* Vertical divider */}
            <div style={{ width: "0.5px", backgroundColor: "rgba(15,13,12,0.08)", flexShrink: 0 }} />

            {/* Dimension bars */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 9 }}>
              {dims.map((d, i) => (
                <div key={d.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{
                      fontSize: 7, fontWeight: 500, color: "rgba(15,13,12,0.38)",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>{d.label}</span>
                    <span style={{ fontSize: 7, color: "rgba(15,13,12,0.28)" }}>{d.score}</span>
                  </div>
                  <div style={{ height: "1.5px", background: "rgba(15,13,12,0.07)", overflow: "hidden" }}>
                    <motion.div
                      style={{ height: "100%", backgroundColor: "#eb4511", opacity: 0.65 }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${d.score}%` } : {}}
                      transition={{ duration: 1.1, delay: 0.65 + i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontSize: 7, letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(15,13,12,0.26)", marginBottom: 2,
              }}>
                Issued
              </div>
              <div style={{ fontSize: 9, color: "rgba(15,13,12,0.4)", letterSpacing: "0.05em" }}>
                May 2026 · Founding Cohort
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, rotate: -14, scale: 0.7 }}
              animate={inView ? { opacity: 1, rotate: -5, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 1.45, ease }}
              style={{ border: "1.5px solid #eb4511", padding: "5px 11px" }}
            >
              <span style={{
                fontSize: 8, fontWeight: 700, color: "#eb4511",
                letterSpacing: "0.5em", textTransform: "uppercase",
              }}>Passed</span>
            </motion.div>
          </div>

          {/* Verification hash */}
          <div style={{
            marginTop: 12, paddingTop: 9,
            borderTop: "0.5px solid rgba(15,13,12,0.07)",
          }}>
            <span style={{
              fontSize: 7, color: "rgba(15,13,12,0.2)",
              fontFamily: "monospace", letterSpacing: "0.06em",
            }}>
              VC-2026-05-87A · sha256: 4f7c2e91b3a8d0f5
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const stats = [
  { value: "40–60%", label: "Pass rate"   },
  { value: "45 min", label: "Live review" },
  { value: "24 hrs", label: "Turnaround"  },
  { value: "₹2,000", label: "Per attempt" },
];

export default function HeroSection({ onApply: _ }: HeroProps) {
  return (
    <section
      id="hero-section"
      style={{
        backgroundColor: "var(--bg-page)",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top rule */}
      <motion.div
        style={{ height: "1px", backgroundColor: "rgba(15,13,12,0.12)", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.05, ease }}
      />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 64px)",
        paddingTop:    "clamp(72px, 11vh, 110px)",
        paddingBottom: "clamp(48px, 8vh, 80px)",
      }}>
        <div style={{ width: "100%", maxWidth: 640 }}>

          {/* Eyebrow */}
          <motion.div
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}
            variants={fadeIn(0.12)} initial="hidden" animate="show"
          >
            <div style={{ width: 20, height: "1px", backgroundColor: "#eb4511", flexShrink: 0 }} />
            <span style={{
              fontSize: 9, fontWeight: 600,
              letterSpacing: "0.38em", textTransform: "uppercase", color: "#eb4511",
            }}>
              AI · ML Verification Standard
            </span>
          </motion.div>

          {/* Headline — same scale as section titles */}
          <motion.div
            style={{ marginBottom: 20 }}
            variants={fadeUp(0.2)} initial="hidden" animate="show"
          >
            <div style={{
              fontSize:      "clamp(22px, 2.8vw, 38px)",
              fontWeight:    600,
              letterSpacing: "-0.02em",
              lineHeight:    1.2,
              color:         "#0f0d0c",
            }}>
              The verification standard<br />
              <span style={{ color: "#eb4511" }}>for AI engineers.</span>
            </div>
          </motion.div>

          {/* Body copy */}
          <motion.p
            style={{
              fontSize: "clamp(14px, 1.15vw, 16px)",
              lineHeight: 1.85,
              color: "rgba(15,13,12,0.52)",
              maxWidth: 480,
              margin: "0 0 32px",
            }}
            variants={fadeIn(0.3)} initial="hidden" animate="show"
          >
            A live 45-minute technical review with a senior engineer who has read your code and watched your walkthrough. One score. One credential. Delivered in 24 hours.
          </motion.p>

          {/* CTAs */}
          <motion.div
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginBottom: 48 }}
            variants={fadeIn(0.38)} initial="hidden" animate="show"
          >
            <Link
              href="/get-verified"
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "12px 26px",
                backgroundColor: "#0f0d0c",
                fontSize: 9, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                transition: "background-color 0.18s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#eb4511")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0f0d0c")}
            >
              <span className="text-on-dark">Apply for Verification</span>
            </Link>
            <Link
              href="/how-it-works"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 9, fontWeight: 600,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(15,13,12,0.42)",
                paddingBottom: 3,
                borderBottom: "1px solid rgba(15,13,12,0.16)",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#0f0d0c")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(15,13,12,0.42)")}
            >
              How it works
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            style={{
              paddingTop: 22,
              borderTop: "1px solid rgba(15,13,12,0.1)",
              display: "flex", flexWrap: "wrap", gap: 0,
            }}
            variants={fadeIn(0.48)} initial="hidden" animate="show"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  paddingRight: i < stats.length - 1 ? 24 : 0,
                  marginRight:  i < stats.length - 1 ? 24 : 0,
                  borderRight:  i < stats.length - 1 ? "1px solid rgba(15,13,12,0.1)" : "none",
                }}
              >
                <div style={{
                  fontSize: "clamp(15px, 1.7vw, 21px)",
                  fontWeight: 700, letterSpacing: "-0.03em",
                  color: "#0f0d0c", lineHeight: 1, marginBottom: 5,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: 8, fontWeight: 500,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "rgba(15,13,12,0.36)",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Bottom rule */}
      <motion.div
        style={{ height: "1px", backgroundColor: "rgba(15,13,12,0.12)", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease }}
      />
    </section>
  );
}
