"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

interface FieldDef {
  id: string; label: string; placeholder: string;
  type: "text" | "email" | "url" | "textarea"; required?: boolean; hint?: string;
  half?: boolean;
}

const fields: FieldDef[] = [
  { id: "name",    label: "Full Name",             placeholder: "Your name",                                                 type: "text",     required: true,  half: true  },
  { id: "email",   label: "Email",                 placeholder: "you@example.com",                                           type: "email",    required: true,  half: true  },
  { id: "role",    label: "Current Role & Company", placeholder: "e.g. Senior ML Engineer @ Stripe",                         type: "text",     required: true               },
  { id: "linkedin", label: "LinkedIn / GitHub",    placeholder: "linkedin.com/in/you or github.com/you",                     type: "url"                                   },
  { id: "years",   label: "Years in AI/ML",        placeholder: "e.g. 6 years",                                              type: "text",     required: true,  half: true  },
  { id: "domain",  label: "Specialisation",        placeholder: "e.g. NLP, Computer Vision, MLOps, LLMs",                   type: "text",     required: true,  half: true  },
  { id: "scope",   label: "What kind of work do you review best?",
    placeholder: "Describe the domain, stack, and type of projects you're most equipped to evaluate.",
    hint: "We match candidates to reviewers by domain — be specific.",                                                         type: "textarea", required: true               },
  { id: "why",     label: "Why do you want to be an Orcred reviewer?",
    placeholder: "What draws you to this? You can be direct.",                                                                 type: "textarea", required: true               },
  { id: "timezone", label: "Timezone & Availability",
    placeholder: "e.g. IST — available weekday evenings and weekend mornings",
    hint: "We'll use this to propose a calibration call time in our first reply.",                                              type: "text",     required: true               },
];

/* ── Perks list ── */
const perks = [
  { label: "Equity in Orcred",        sub: "Founding reviewer terms"              },
  { label: "₹1,200 per review",       sub: "Per completed session"                },
  { label: "Founding reviewer badge", sub: "Permanent, public credential"         },
  { label: "Direct say in the standard", sub: "You help define what passes"       },
  { label: "Flexible schedule",       sub: "Sessions fit around your day job"     },
];

/* ── Eligibility bar ── */
const eligibility = [
  "5+ years AI/ML industry experience",
  "Active or recent engineering role",
  "No current or recent connection to applicants",
];

/* ── Single field ── */
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
    transition:  "border-color 0.2s ease",
    resize:      "none",
    display:     "block",
  };

  return (
    <div>
      <label
        htmlFor={def.id}
        style={{
          display: "block", marginBottom: "6px",
          fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: focused ? "#eb4511" : "rgba(15,13,12,0.55)",
          transition: "color 0.2s ease",
        }}
      >
        {def.label}{def.required && <span style={{ color: "#eb4511", marginLeft: "3px" }}>*</span>}
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
        <div style={{ marginTop: "6px", fontSize: "11px", lineHeight: 1.65, color: "rgba(15,13,12,0.4)", fontStyle: "italic" }}>
          {def.hint}
        </div>
      )}
    </div>
  );
}

/* ── Success ── */
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
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--fg-muted)" }}>shortly.</span>
        </div>
      </div>
      <div className="w-8 h-px" style={{ background: "#eb4511", opacity: 0.7 }} />
      <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.9, color: "var(--fg-muted)", maxWidth: "360px" }}>
        We review every application personally. If you&apos;re a fit, we&apos;ll reach out to schedule a short calibration call.
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function BecomeAReviewerPage() {
  const [values,     setValues]     = useState(Object.fromEntries(fields.map(f => [f.id, ""])));
  const [submitting, setSubmitting] = useState(false);
  const [sent,       setSent]       = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const canSubmit = fields.filter(f => f.required).every(f => values[f.id].trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reviewer", ...values }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 40% at 50% 0%, var(--orange-tint) 0%, transparent 65%)" }} />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Become a Reviewer" }]} />

      <div className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Left: editorial ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-[80px]">

            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
            >
              <div className="w-5 h-px" style={{ backgroundColor: "#eb4511" }} />
              <span className="font-label-sm uppercase tracking-[0.38em] text-[9px]" style={{ color: "#eb4511" }}>
                Founding Reviewers
              </span>
            </motion.div>

            {/* Title */}
            <motion.div
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(30px, 3.5vw, 48px)", lineHeight: 1.05, color: "var(--fg)", marginBottom: "16px" }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}
            >
              Become a Reviewer.
            </motion.div>

            <motion.div
              style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.85, color: "var(--fg-muted)", marginBottom: "32px" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
            >
              You&apos;ve been in enough rooms to know within 60 seconds. That instinct is exactly what Orcred is built on.
            </motion.div>

            {/* Availability callout */}
            <motion.div
              style={{
                padding: "14px 16px", marginBottom: "28px",
                backgroundColor: "rgba(235,69,17,0.05)",
                border: "1px solid rgba(235,69,17,0.22)",
                borderLeft: "3px solid #eb4511",
              }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.25 }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#eb4511", marginBottom: "4px" }}>
                5 spots remaining
              </div>
              <div style={{ fontSize: "12px", fontWeight: 400, lineHeight: 1.65, color: "rgba(15,13,12,0.58)" }}>
                Founding reviewer cohort. First intake only.
              </div>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
            >
              <div className="font-label-sm uppercase tracking-[0.3em] text-[9px] mb-4" style={{ color: "rgba(15,13,12,0.4)" }}>
                What you get
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                {perks.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-[5px] w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: "#eb4511", opacity: 0.7 }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f0d0c", letterSpacing: "-0.01em" }}>{p.label}</div>
                      <div style={{ fontSize: "11px", fontWeight: 400, color: "rgba(15,13,12,0.45)", marginTop: "1px" }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Eligibility */}
            <motion.div
              className="mt-8 pt-8"
              style={{ borderTop: "1px solid rgba(15,13,12,0.09)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.4 }}
            >
              <div className="font-label-sm uppercase tracking-[0.3em] text-[9px] mb-4" style={{ color: "rgba(15,13,12,0.4)" }}>
                Minimum requirements
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                {eligibility.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginTop: "2px", flexShrink: 0 }}>
                      <polyline points="2,6 5,9 10,3" stroke="#eb4511" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div style={{ fontSize: "12px", fontWeight: 400, color: "rgba(15,13,12,0.6)", lineHeight: 1.5 }}>{e}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── Right: form card ── */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease }}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(15,13,12,0.11)",
                boxShadow: "0 2px 24px rgba(15,13,12,0.05)",
              }}
            >
              {/* Card header */}
              <div style={{
                padding: "22px 32px 20px",
                borderBottom: "1px solid rgba(15,13,12,0.09)",
                backgroundColor: "rgba(250,247,242,0.6)",
              }}>
                <div style={{ fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 600, color: "#0f0d0c", letterSpacing: "-0.015em" }}>
                  Reviewer Application
                </div>
                <div style={{ fontSize: "12px", fontWeight: 400, color: "rgba(15,13,12,0.45)", marginTop: "3px" }}>
                  Takes about 5 minutes. Reviewed personally by the founding team.
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "32px 32px 28px" }}>
                <AnimatePresence mode="wait">
                  {sent ? (
                    <Success key="success" />
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Field grid — half-width fields sit side by side */}
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: "24px" }}>

                        {/* Row: Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {fields.filter(f => f.half).slice(0, 2).map(f => (
                            <Field key={f.id} def={f} value={values[f.id]}
                              onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} />
                          ))}
                        </div>

                        {/* Full-width: Role */}
                        <Field def={fields[2]} value={values[fields[2].id]}
                          onChange={v => setValues(prev => ({ ...prev, [fields[2].id]: v }))} />

                        {/* Full-width: LinkedIn */}
                        <Field def={fields[3]} value={values[fields[3].id]}
                          onChange={v => setValues(prev => ({ ...prev, [fields[3].id]: v }))} />

                        {/* Row: Years + Domain */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {fields.filter(f => f.half).slice(2, 4).map(f => (
                            <Field key={f.id} def={f} value={values[f.id]}
                              onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} />
                          ))}
                        </div>

                        {/* Full-width: Scope */}
                        <Field def={fields[6]} value={values[fields[6].id]}
                          onChange={v => setValues(prev => ({ ...prev, [fields[6].id]: v }))} />

                        {/* Full-width: Why */}
                        <Field def={fields[7]} value={values[fields[7].id]}
                          onChange={v => setValues(prev => ({ ...prev, [fields[7].id]: v }))} />

                        {/* Full-width: Timezone & availability */}
                        <Field def={fields[8]} value={values[fields[8].id]}
                          onChange={v => setValues(prev => ({ ...prev, [fields[8].id]: v }))} />

                      </div>

                      {/* Card footer */}
                      <div style={{
                        marginTop: "32px", paddingTop: "24px",
                        borderTop: "1px solid rgba(15,13,12,0.09)",
                        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "12px",
                      }}>
                        <div style={{ fontSize: "11px", fontWeight: 400, color: "rgba(15,13,12,0.35)" }}>
                          Fields marked <span style={{ color: "#eb4511" }}>*</span> are required
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          {error && (
                            <div className="font-label-sm text-[9px] tracking-[0.2em]" style={{ color: "#eb4511" }}>{error}</div>
                          )}
                          <motion.button
                            type="submit"
                            disabled={submitting || !canSubmit}
                            className="font-label-sm uppercase tracking-[0.2em] text-[11px] transition-all duration-200"
                            style={{
                              padding: "10px 28px",
                              backgroundColor: canSubmit && !submitting ? "#eb4511" : "rgba(15,13,12,0.07)",
                              color: canSubmit && !submitting ? "#ffffff" : "rgba(15,13,12,0.25)",
                              border: "none",
                              borderRadius: "50px",
                              cursor: canSubmit && !submitting ? "pointer" : "default",
                              transition: "opacity 0.15s ease",
                            }}
                            onMouseEnter={e => (canSubmit && !submitting) && ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                          >
                            {submitting ? "Submitting…" : "Submit Application"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Note */}
            <div className="mt-5" style={{ fontSize: "11px", fontWeight: 400, color: "var(--fg-faint)" }}>
              Your information is handled in accordance with our{" "}
              <a href="/privacy" style={{ color: "rgba(15,13,12,0.45)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Privacy Policy
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
