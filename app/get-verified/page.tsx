"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Step definitions ── */
const STEPS = [
  { num: "01", label: "Personal",  sub: "Who you are"       },
  { num: "02", label: "Project",   sub: "What you built"    },
  { num: "03", label: "Deep Dive", sub: "Decisions & docs"  },
  { num: "04", label: "Schedule",  sub: "Timing & consent"  },
];

interface FieldDef {
  id: string; label: string; placeholder: string;
  type: "text" | "email" | "url" | "textarea"; required?: boolean; hint?: string;
}

const stepFields: FieldDef[][] = [
  // Step 01 — Personal
  [
    { id: "name",     label: "Full Name",        placeholder: "Your name",           type: "text",  required: true },
    { id: "email",    label: "Email",             placeholder: "you@example.com",     type: "email", required: true },
    { id: "linkedin", label: "GitHub / LinkedIn", placeholder: "github.com/you",      type: "url"                  },
  ],
  // Step 02 — Project
  [
    { id: "project", label: "Project Title",    placeholder: "What did you build?",                                                    type: "text",     required: true },
    { id: "stack",   label: "Tech Stack",        placeholder: "PyTorch, FastAPI, Pinecone…",                                            type: "text"                    },
    { id: "desc",    label: "What does it do?",  placeholder: "One or two sentences on the problem it solves.",                         type: "textarea", required: true },
    { id: "loom",    label: "Loom Walkthrough",  placeholder: "loom.com/share/…",
      hint: "5-min video explaining what you built and why. Someone who didn't build it cannot make this video.",                        type: "url",      required: true },
  ],
  // Step 03 — Deep Dive
  [
    { id: "ai_tools", label: "AI Tools Used",           placeholder: "e.g. Used Copilot for boilerplate, Claude for debugging tradeoffs — not for core logic.",
      hint: "Orcred is not anti-AI. Declare honestly what you used and for what.",                                                       type: "textarea"                 },
    { id: "decision", label: "Hardest Technical Decision", placeholder: "Walk us through one real tradeoff — what you chose, what you considered, and why.", type: "textarea", required: true },
    { id: "broke",    label: "One Thing That Broke",       placeholder: "What went wrong, how long it took to fix, and what the fix was.",
      hint: "This single answer tells a reviewer more about your understanding than almost anything else.",                               type: "textarea", required: true  },
  ],
  // Step 04 — Schedule & Consent
  [
    { id: "timezone",     label: "Your Timezone",  placeholder: "e.g. IST, GMT+5:30, PST",                                             type: "text",     required: true },
    { id: "availability", label: "Availability",   placeholder: "e.g. Weekdays after 6pm, weekend mornings — any 2-hour window works.",
      hint: "The review is 45–60 minutes. We'll confirm a slot via email.",                                                              type: "textarea", required: true },
  ],
];

const allFieldIds = stepFields.flat().map(f => f.id);

/* ── Input field ── */
function Field({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    width:       "100%",
    padding:     def.type === "textarea" ? "11px 14px" : "10px 14px",
    background:  "#fdfcfa",
    border:      `1.5px solid ${focused ? "#eb4511" : "rgba(15,13,12,0.16)"}`,
    borderRadius: "2px",
    color:       "#0f0d0c",
    fontFamily:  "Inter, system-ui, sans-serif",
    fontWeight:  400,
    fontSize:    "14px",
    lineHeight:  1.65,
    outline:     "none",
    transition:  "border-color 0.2s ease, background 0.2s ease",
    resize:      "none",
    display:     "block",
  };

  return (
    <div>
      <label
        htmlFor={def.id}
        style={{
          display:        "block",
          marginBottom:   "6px",
          fontSize:       "10px",
          fontWeight:     600,
          letterSpacing:  "0.1em",
          textTransform:  "uppercase",
          color:          focused ? "#eb4511" : "rgba(15,13,12,0.55)",
          transition:     "color 0.2s ease",
        }}
      >
        {def.label}
        {def.required && <span style={{ color: "#eb4511", marginLeft: "3px" }}>*</span>}
      </label>

      {def.type === "textarea" ? (
        <textarea
          id={def.id} rows={4} value={value} placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle}
          className="placeholder:text-[rgba(15,13,12,0.28)]"
        />
      ) : (
        <input
          id={def.id} type={def.type} value={value} placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle}
          className="placeholder:text-[rgba(15,13,12,0.28)]"
        />
      )}

      {def.hint && (
        <div style={{ marginTop: "6px", fontSize: "11px", fontWeight: 400, lineHeight: 1.65, color: "rgba(15,13,12,0.4)", fontStyle: "italic" }}>
          {def.hint}
        </div>
      )}
    </div>
  );
}

/* ── Top horizontal stepper ── */
function Stepper({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%", marginBottom: "32px" }}>
      {STEPS.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Row: connector · circle · connector
                Always render both sides — transparent on the outer edges so
                the circle stays centred in every step slot. */}
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {/* Left connector (transparent for first step) */}
              <div style={{
                flex: 1, height: "1.5px",
                backgroundColor: i === 0 ? "transparent" : i <= current ? "#eb4511" : "rgba(15,13,12,0.14)",
                transition: "background-color 0.4s ease",
              }} />

              <div style={{
                width:           "36px",
                height:          "36px",
                borderRadius:    "50%",
                flexShrink:      0,
                backgroundColor: done || active ? "#eb4511" : "transparent",
                border:          active ? "2px solid #eb4511" : done ? "none" : "1.5px solid rgba(15,13,12,0.2)",
                outline:         active ? "3px solid rgba(235,69,17,0.15)" : "none",
                outlineOffset:   "2px",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                transition:      "all 0.3s ease",
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polyline points="2.5,7 5.5,10 11.5,4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: active ? "#ffffff" : "rgba(15,13,12,0.32)", letterSpacing: "0.02em" }}>
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Right connector (transparent for last step) */}
              <div style={{
                flex: 1, height: "1.5px",
                backgroundColor: i === STEPS.length - 1 ? "transparent" : i < current ? "#eb4511" : "rgba(15,13,12,0.14)",
                transition: "background-color 0.4s ease",
              }} />
            </div>

            {/* Label */}
            <div style={{ marginTop: "8px", textAlign: "center" }}>
              <div style={{
                fontSize:      "11px",
                fontWeight:    active ? 700 : done ? 500 : 400,
                color:         active ? "#0f0d0c" : done ? "#eb4511" : "rgba(15,13,12,0.38)",
                letterSpacing: "0.01em",
                transition:    "all 0.3s ease",
              }}>
                {step.label}
              </div>
              <div className="hidden sm:block" style={{ fontSize: "10px", color: "rgba(15,13,12,0.3)", marginTop: "2px" }}>
                {step.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Info callout box (used on step 4) ── */
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding:         "14px 16px",
      backgroundColor: "rgba(235,69,17,0.04)",
      border:          "1px solid rgba(235,69,17,0.2)",
      borderLeft:      "3px solid #eb4511",
      marginBottom:    "28px",
    }}>
      <div style={{ fontSize: "12px", lineHeight: 1.7, color: "rgba(15,13,12,0.6)", fontWeight: 400 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Success state ── */
function Success() {
  return (
    <motion.div
      className="flex flex-col items-start gap-8 py-4"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}
    >
      <div className="relative w-[56px] h-[56px]">
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "var(--orange-dim)" }} />
        <div className="absolute inset-[7px] rounded-full border" style={{ borderColor: "var(--orange-tint)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[11px] h-[11px] rounded-full" style={{ background: "#eb4511", boxShadow: "0 0 14px 4px var(--orange-dim)" }} />
        </div>
      </div>
      <div>
        <div className="font-label-sm uppercase tracking-[0.42em] text-[9px] mb-5" style={{ color: "var(--orange-faint)" }}>
          Application received
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, color: "var(--fg)" }}>
          We&apos;ll be in touch<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--fg-muted)" }}>to schedule your review.</span>
        </div>
      </div>
      <div className="w-8 h-px" style={{ background: "#eb4511", opacity: 0.7 }} />
      <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.9, color: "var(--fg-muted)", maxWidth: "360px" }}>
        We review every submission personally. Expect to hear from us within 2–3 business days with a confirmed slot and next steps.
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function GetVerifiedPage() {
  const [step,       setStep]       = useState(0);
  const [values,     setValues]     = useState(Object.fromEntries(allFieldIds.map(id => [id, ""])));
  const [consent,    setConsent]    = useState({ id: false, recording: false });
  const [submitting, setSubmitting] = useState(false);
  const [sent,       setSent]       = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const currentFields = stepFields[step];
  const isLast = step === STEPS.length - 1;

  const canProceed = () => {
    if (isLast) return consent.id && consent.recording;
    return currentFields.filter(f => f.required).every(f => values[f.id].trim() !== "");
  };

  const handleNext  = () => { if (canProceed()) setStep(s => s + 1); };
  const handleBack  = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "verify", ...values, consent_id: consent.id, consent_recording: consent.recording }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)" }} />
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Apply for Verification" }]} />
        <div className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-16">
          <Success />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 40% at 50% 0%, var(--orange-tint) 0%, transparent 65%)" }} />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Apply for Verification" }]} />

      <div className="relative z-10 flex-1 w-full max-w-[820px] mx-auto px-6 sm:px-10 py-10 sm:py-12">

        {/* Page title */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span className="font-label-sm uppercase tracking-[0.38em] text-[9px]" style={{ color: "#eb4511" }}>
              Verification Application
            </span>
          </div>
          <div style={{
            fontFamily:    "'Cormorant Garamond', Georgia, serif",
            fontWeight:    400,
            fontSize:      "clamp(28px, 3.8vw, 46px)",
            lineHeight:    1.05,
            color:         "var(--fg)",
            marginBottom:  "10px",
          }}>
            Apply for Verification.
          </div>
          <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.7, color: "rgba(15,13,12,0.48)" }}>
            Four steps · about 15 minutes · reviewed personally by our team.
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease }}
        >
          <Stepper current={step} />
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease }}
          style={{
            backgroundColor: "#ffffff",
            border:          "1px solid rgba(15,13,12,0.11)",
            boxShadow:       "0 2px 24px rgba(15,13,12,0.05)",
          }}
        >
          {/* Card header */}
          <div style={{
            padding:       "24px 32px 22px",
            borderBottom:  "1px solid rgba(15,13,12,0.09)",
            backgroundColor: "rgba(250,247,242,0.6)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <div className="font-label-sm uppercase tracking-[0.35em] text-[9px] mb-1" style={{ color: "var(--orange-faint)" }}>
                  Step {STEPS[step].num} of {STEPS.length}
                </div>
                <div style={{ fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 600, color: "#0f0d0c", letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                  {STEPS[step].label}
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 400, color: "rgba(15,13,12,0.4)", paddingBottom: "2px" }}>
                {STEPS[step].sub}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: "16px", height: "2px", backgroundColor: "rgba(15,13,12,0.08)", borderRadius: "1px", overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", backgroundColor: "#eb4511", borderRadius: "1px" }}
                initial={false}
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease }}
              />
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: "32px 32px 28px" }}>

            {/* Step 4 info callout */}
            {step === 3 && (
              <InfoBox>
                <strong style={{ fontWeight: 600, color: "#0f0d0c" }}>What happens next:</strong> Once we receive your application, we'll verify your submission and confirm your slot within 2–3 business days. Payment of ₹2,000 is collected after acceptance — not before.
              </InfoBox>
            )}

            {/* Animated fields */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.32, ease }}
              >
                {step < 3 ? (
                  <div className="space-y-7">
                    {currentFields.map(f => (
                      <Field
                        key={f.id} def={f} value={values[f.id]}
                        onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-7">
                    {stepFields[3].map(f => (
                      <Field
                        key={f.id} def={f} value={values[f.id]}
                        onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))}
                      />
                    ))}

                    {/* Divider */}
                    <div style={{ height: "1px", backgroundColor: "rgba(15,13,12,0.09)" }} />

                    {/* Acknowledgements */}
                    <div>
                      <div style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(15,13,12,0.55)" }}>
                          Acknowledgements
                        </span>
                        <span style={{ color: "#eb4511", marginLeft: "3px", fontSize: "10px" }}>*</span>
                        <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(15,13,12,0.38)", marginLeft: "8px" }}>
                          Both required to submit
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
                        {([
                          { key: "id" as const,        text: "I understand that I will be asked to show a valid government-issued photo ID at the start of the review call." },
                          { key: "recording" as const, text: "I consent to the review session being recorded for quality control and dispute resolution. Recordings are deleted after 90 days unless under active dispute." },
                        ] as const).map(item => (
                          <label
                            key={item.key}
                            style={{
                              display:         "flex",
                              alignItems:      "flex-start",
                              gap:             "14px",
                              padding:         "14px 16px",
                              backgroundColor: consent[item.key] ? "rgba(235,69,17,0.04)" : "rgba(15,13,12,0.02)",
                              border:          `1px solid ${consent[item.key] ? "rgba(235,69,17,0.28)" : "rgba(15,13,12,0.1)"}`,
                              cursor:          "pointer",
                              transition:      "all 0.2s ease",
                            }}
                            onClick={() => setConsent(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          >
                            <div style={{
                              width:           "18px",
                              height:          "18px",
                              borderRadius:    "2px",
                              flexShrink:      0,
                              marginTop:       "2px",
                              backgroundColor: consent[item.key] ? "#eb4511" : "transparent",
                              border:          consent[item.key] ? "none" : "1.5px solid rgba(15,13,12,0.28)",
                              display:         "flex",
                              alignItems:      "center",
                              justifyContent:  "center",
                              transition:      "all 0.18s ease",
                            }}>
                              {consent[item.key] && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <polyline points="1.5,5 4,7.5 8.5,2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.75, color: "rgba(15,13,12,0.68)" }}>
                              {item.text}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card footer — navigation */}
          <div style={{
            padding:         "20px 32px",
            borderTop:       "1px solid rgba(15,13,12,0.09)",
            backgroundColor: "rgba(250,247,242,0.5)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
          }}>
            {/* Back */}
            <div>
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="font-label-sm uppercase tracking-[0.2em] text-[10px] transition-colors duration-200"
                  style={{ color: "rgba(15,13,12,0.38)", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0f0d0c")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(15,13,12,0.38)")}
                >
                  ← Back
                </button>
              ) : (
                <div style={{ fontSize: "11px", fontWeight: 400, color: "rgba(15,13,12,0.35)" }}>
                  Fields marked <span style={{ color: "#eb4511" }}>*</span> are required
                </div>
              )}
            </div>

            {/* Next / Submit */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {error && (
                <div className="font-label-sm text-[9px] tracking-[0.2em]" style={{ color: "#eb4511" }}>
                  {error}
                </div>
              )}

              {!isLast ? (
                <motion.button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
                  style={{
                    padding:         "10px 28px",
                    backgroundColor: canProceed() ? "#eb4511" : "rgba(15,13,12,0.07)",
                    color:           canProceed() ? "#ffffff" : "rgba(15,13,12,0.25)",
                    border:          "none",
                    cursor:          canProceed() ? "pointer" : "default",
                  }}
                  whileTap={canProceed() ? { scale: 0.98 } : {}}
                >
                  Continue →
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={submitting || !canProceed()}
                  className="font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
                  style={{
                    padding:         "10px 28px",
                    backgroundColor: canProceed() && !submitting ? "#eb4511" : "rgba(15,13,12,0.07)",
                    color:           canProceed() && !submitting ? "#ffffff" : "rgba(15,13,12,0.25)",
                    border:          "none",
                    cursor:          canProceed() && !submitting ? "pointer" : "default",
                  }}
                  whileTap={canProceed() ? { scale: 0.98 } : {}}
                >
                  {submitting ? "Submitting…" : "Submit Application"}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="mt-5" style={{ fontSize: "11px", fontWeight: 400, color: "var(--fg-faint)" }}>
          Your information is handled in accordance with our{" "}
          <Link href="/privacy" style={{ color: "rgba(15,13,12,0.45)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Privacy Policy
          </Link>
        </div>

      </div>
    </div>
  );
}
