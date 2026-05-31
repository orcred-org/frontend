"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Step definitions ── */
const STEPS = [
  { num: "01", label: "Personal",  sub: "Who you are"        },
  { num: "02", label: "Project",   sub: "What you built"     },
  { num: "03", label: "Deep Dive", sub: "Decisions & docs"   },
  { num: "04", label: "Schedule",  sub: "Timing & consent"   },
];

/* ── Field types per step ── */
interface FieldDef {
  id: string; label: string; placeholder: string;
  type: "text" | "email" | "url" | "textarea"; required?: boolean; hint?: string;
}

const stepFields: FieldDef[][] = [
  // Step 01 — Personal
  [
    { id: "name",     label: "Full Name",        placeholder: "Your name",           type: "text",  required: true  },
    { id: "email",    label: "Email",             placeholder: "you@example.com",     type: "email", required: true  },
    { id: "linkedin", label: "GitHub / LinkedIn", placeholder: "github.com/you",      type: "url"                   },
  ],
  // Step 02 — Project
  [
    { id: "project",  label: "Project Title",     placeholder: "What did you build?",                                     type: "text",     required: true  },
    { id: "stack",    label: "Tech Stack",         placeholder: "PyTorch, FastAPI, Pinecone…",                             type: "text"                     },
    { id: "desc",     label: "What does it do?",   placeholder: "One or two sentences on the problem it solves.",          type: "textarea", required: true  },
    { id: "loom",     label: "Loom Walkthrough",   placeholder: "loom.com/share/…",
      hint: "5-min video explaining what you built and why. Someone who didn't build it cannot make this video.",           type: "url",      required: true  },
  ],
  // Step 03 — Deep Dive
  [
    { id: "ai_tools", label: "AI Tools Used",      placeholder: "e.g. Used Copilot for boilerplate, Claude for debugging tradeoffs — not for core logic.",
      hint: "Orcred is not anti-AI. Declare honestly what you used and for what.",                                          type: "textarea"                 },
    { id: "decision", label: "Hardest Technical Decision", placeholder: "Walk us through one real tradeoff — what you chose, what you considered, and why.", type: "textarea", required: true },
    { id: "broke",    label: "One Thing That Broke",       placeholder: "What went wrong, how long it took to fix, and what the fix was.",
      hint: "This single answer tells a reviewer more about your understanding than almost anything else.",                  type: "textarea", required: true },
  ],
  // Step 04 — Schedule & Consent
  [
    { id: "timezone",     label: "Your Timezone",   placeholder: "e.g. IST, GMT+5:30, PST",                type: "text",     required: true },
    { id: "availability", label: "Availability",    placeholder: "e.g. Weekdays after 6pm, weekend mornings — any 2-hour window works.",
      hint: "The review is 45–60 minutes. We'll confirm a slot via email.",                                  type: "textarea", required: true },
  ],
];

const allFieldIds = stepFields.flat().map(f => f.id);

/* ── Single field ── */
function Field({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    background: "transparent", color: "var(--fg)", outline: "none", width: "100%",
    fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300,
    fontSize: "14px", lineHeight: 1.75, paddingBottom: "10px", resize: "none",
  };
  return (
    <div>
      <label htmlFor={def.id} className="font-label-sm uppercase tracking-[0.38em] text-[9px] block mb-2"
        style={{ color: focused ? "#eb4511" : "var(--fg-muted)", transition: "color 0.25s ease" }}>
        {def.label}{def.required && <span style={{ color: "#eb4511", marginLeft: "4px" }}>*</span>}
      </label>
      {def.type === "textarea" ? (
        <textarea id={def.id} rows={3} value={value} placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base} className="block placeholder:text-[var(--fg-faint)]" />
      ) : (
        <input id={def.id} type={def.type} value={value} placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, display: "block" }} className="placeholder:text-[var(--fg-faint)]" />
      )}
      <div className="w-full h-px mt-1 transition-colors duration-300"
        style={{ background: focused ? "#eb4511" : "var(--border-strong)" }} />
      {def.hint && (
        <div className="mt-2" style={{ fontSize: "11px", fontWeight: 400, lineHeight: 1.6, color: "rgba(15,13,12,0.4)", fontStyle: "italic" }}>
          {def.hint}
        </div>
      )}
    </div>
  );
}

/* ── Step timeline ── */
function Timeline({ current }: { current: number }) {
  return (
    <div className="flex flex-row lg:flex-col gap-0 lg:gap-0">
      {STEPS.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex flex-col lg:flex-row items-center lg:items-start gap-0 lg:gap-4 flex-1 lg:flex-none">
            {/* Dot + vertical connector */}
            <div className="flex flex-col items-center lg:items-center">
              {/* Circle */}
              <div
                className="flex items-center justify-center flex-shrink-0 transition-all duration-400"
                style={{
                  width:           "32px",
                  height:          "32px",
                  borderRadius:    "50%",
                  backgroundColor: done ? "#eb4511" : active ? "transparent" : "transparent",
                  border:          done ? "none" : active ? "2px solid #eb4511" : "1.5px solid rgba(15,13,12,0.2)",
                }}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <div style={{ fontSize: "10px", fontWeight: 700, color: active ? "#eb4511" : "rgba(15,13,12,0.3)", letterSpacing: "0.05em" }}>
                    {step.num}
                  </div>
                )}
              </div>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block w-px flex-1 mt-1" style={{ height: "40px", backgroundColor: i < current ? "#eb4511" : "rgba(15,13,12,0.12)" }} />
              )}
            </div>

            {/* Label — hidden on mobile, shown on desktop */}
            <div className="hidden lg:block pt-1 pb-10">
              <div style={{ fontSize: "12px", fontWeight: active ? 600 : 400, color: active ? "#0f0d0c" : done ? "#eb4511" : "rgba(15,13,12,0.4)", transition: "all 0.3s ease" }}>
                {step.label}
              </div>
              <div style={{ fontSize: "10px", fontWeight: 400, color: "rgba(15,13,12,0.35)", marginTop: "2px" }}>
                {step.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Mobile step bar ── */
function MobileStepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8 lg:hidden">
      {STEPS.map((_, i) => (
        <div key={i} className="flex-1 h-[2px] rounded-full transition-all duration-400"
          style={{ backgroundColor: i <= current ? "#eb4511" : "rgba(15,13,12,0.15)" }} />
      ))}
      <div className="font-label-sm uppercase tracking-[0.2em] text-[9px] ml-2 flex-shrink-0" style={{ color: "rgba(15,13,12,0.45)" }}>
        {current + 1}/{STEPS.length}
      </div>
    </div>
  );
}

/* ── Success state ── */
function Success() {
  return (
    <motion.div className="flex flex-col items-start gap-8 py-4"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
      <div className="relative w-[56px] h-[56px]">
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "var(--orange-dim)" }} />
        <div className="absolute inset-[7px] rounded-full border" style={{ borderColor: "var(--orange-tint)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[11px] h-[11px] rounded-full" style={{ background: "#eb4511", boxShadow: "0 0 14px 4px var(--orange-dim)" }} />
        </div>
      </div>
      <div>
        <div className="font-label-sm uppercase tracking-[0.42em] text-[9px] mb-5" style={{ color: "var(--orange-faint)" }}>Application received</div>
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
  const [step,    setStep]    = useState(0);
  const [values,  setValues]  = useState(Object.fromEntries(allFieldIds.map(id => [id, ""])));
  const [consent, setConsent] = useState({ id: false, recording: false });
  const [submitting, setSubmitting] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const currentFields = stepFields[step];
  const isLast = step === STEPS.length - 1;

  /* validate required fields in current step */
  const canProceed = () => {
    if (isLast) return consent.id && consent.recording;
    return currentFields.filter(f => f.required).every(f => values[f.id].trim() !== "");
  };

  const handleNext = () => { if (canProceed()) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

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
        <div className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-24">
          <Success />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex-1 max-w-[1100px] mx-auto w-full px-6 sm:px-10 lg:px-16 py-16 sm:py-20">

        {/* Back to home */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-10">
          <Link href="/"
            className="inline-flex items-center gap-2 font-label-sm uppercase tracking-[0.32em] text-[10px] transition-colors duration-200"
            style={{ color: "var(--fg-faint)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-faint)")}
          >← Home</Link>
        </motion.div>

        {/* Page title */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, color: "var(--fg)", marginBottom: "8px" }}>
            Apply for Verification.
          </div>
          <div style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.7, color: "rgba(15,13,12,0.5)" }}>
            Complete all four steps to submit your application.
          </div>
        </motion.div>

        {/* Mobile progress bar */}
        <MobileStepBar current={step} />

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Timeline — left */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-[80px]">
            <Timeline current={step} />
          </div>

          {/* Form area — right */}
          <div className="lg:col-span-8 lg:col-start-5">

            {/* Step header */}
            <div className="mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="font-label-sm uppercase tracking-[0.38em] text-[9px] mb-2" style={{ color: "var(--orange-faint)" }}>
                Step {STEPS[step].num} of {STEPS.length}
              </div>
              <div style={{ fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 600, color: "#0f0d0c", letterSpacing: "-0.015em" }}>
                {STEPS[step].label}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(15,13,12,0.5)", marginTop: "4px" }}>
                {STEPS[step].sub}
              </div>
            </div>

            {/* Animated fields */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.4, ease }}
              >
                {/* Regular fields */}
                {step < 3 && (
                  <div className="space-y-8">
                    {currentFields.map(f => (
                      <Field key={f.id} def={f} value={values[f.id]}
                        onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} />
                    ))}
                  </div>
                )}

                {/* Step 04 — Schedule + Consent */}
                {step === 3 && (
                  <div className="space-y-8">
                    {stepFields[3].map(f => (
                      <Field key={f.id} def={f} value={values[f.id]}
                        onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} />
                    ))}

                    {/* Consent */}
                    <div className="pt-2 space-y-5">
                      <div className="font-label-sm uppercase tracking-[0.38em] text-[9px]" style={{ color: "var(--fg-muted)" }}>
                        Acknowledgements *
                      </div>

                      {[
                        { key: "id" as const,        text: "I understand that I will be asked to show a valid government-issued photo ID at the start of the review call." },
                        { key: "recording" as const, text: "I consent to the review session being recorded for quality control and dispute resolution. Recordings are deleted after 90 days unless under active dispute." },
                      ].map(item => (
                        <label key={item.key} className="flex items-start gap-4 cursor-pointer group">
                          <div
                            className="flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200"
                            style={{
                              width: "18px", height: "18px",
                              border: consent[item.key] ? "none" : "1.5px solid rgba(15,13,12,0.3)",
                              backgroundColor: consent[item.key] ? "#eb4511" : "transparent",
                            }}
                            onClick={() => setConsent(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          >
                            {consent[item.key] && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <polyline points="1.5,5 4,7.5 8.5,2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.75, color: "rgba(15,13,12,0.7)" }}>
                            {item.text}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
              {/* Back */}
              <div>
                {step > 0 && (
                  <button onClick={handleBack}
                    className="font-label-sm uppercase tracking-[0.2em] text-[10px] transition-colors duration-200"
                    style={{ color: "rgba(15,13,12,0.4)", background: "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0f0d0c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(15,13,12,0.4)")}
                  >← Back</button>
                )}
              </div>

              {/* Next / Submit */}
              <div className="flex items-center gap-4">
                {error && <div className="font-label-sm text-[9px] tracking-[0.2em]" style={{ color: "#eb4511" }}>{error}</div>}
                {!isLast ? (
                  <motion.button onClick={handleNext} disabled={!canProceed()}
                    className="font-label-sm uppercase tracking-[0.2em] text-[11px] px-6 py-3 transition-all duration-200"
                    style={{
                      backgroundColor: canProceed() ? "#eb4511" : "rgba(15,13,12,0.08)",
                      color:           canProceed() ? "#ffffff" : "rgba(15,13,12,0.3)",
                      border: "none", cursor: canProceed() ? "pointer" : "default",
                    }}
                    whileTap={canProceed() ? { scale: 0.98 } : {}}
                  >Continue →</motion.button>
                ) : (
                  <motion.button onClick={handleSubmit} disabled={submitting || !canProceed()}
                    className="font-label-sm uppercase tracking-[0.2em] text-[11px] px-6 py-3 transition-all duration-200"
                    style={{
                      backgroundColor: canProceed() && !submitting ? "#eb4511" : "rgba(15,13,12,0.08)",
                      color:           canProceed() && !submitting ? "#ffffff" : "rgba(15,13,12,0.3)",
                      border: "none", cursor: canProceed() && !submitting ? "pointer" : "default",
                    }}
                    whileTap={canProceed() ? { scale: 0.98 } : {}}
                  >{submitting ? "Submitting…" : "Submit Application"}</motion.button>
                )}
              </div>
            </div>

            {/* Required note */}
            <div className="mt-4 font-label-sm uppercase tracking-[0.32em] text-[8px]" style={{ color: "var(--fg-faint)" }}>
              Fields marked * are required to proceed
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
