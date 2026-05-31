"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface FieldDef {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "url" | "textarea";
  required?: boolean;
}

const fields: FieldDef[] = [
  { id: "name",        label: "Full Name",                       placeholder: "Your name",                                     type: "text",     required: true  },
  { id: "email",       label: "Email",                           placeholder: "you@example.com",                               type: "email",    required: true  },
  { id: "github",      label: "GitHub / LinkedIn",               placeholder: "github.com/you",                                type: "url"                      },
  { id: "project",     label: "Project Title",                   placeholder: "What did you build?",                           type: "text",     required: true  },
  { id: "stack",       label: "Tech Stack",                      placeholder: "PyTorch, FastAPI, Pinecone…",                   type: "text"                     },
  { id: "description", label: "What does it do?",                placeholder: "One or two sentences on the problem it solves.", type: "textarea", required: true  },
  { id: "decision",    label: "Hardest technical decision made",  placeholder: "Walk us through one real tradeoff.",             type: "textarea", required: true  },
];

function Field({ def, value, onChange, index }: {
  def: FieldDef; value: string; onChange: (v: string) => void; index: number;
}) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    background: "transparent", color: "var(--fg)", outline: "none", width: "100%",
    fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300,
    fontSize: "14px", lineHeight: 1.75, paddingBottom: "10px", resize: "none",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: index * 0.06, ease }}>
      <label htmlFor={def.id} className="font-label-sm uppercase tracking-[0.38em] text-[9px] block mb-2"
        style={{ color: focused ? "var(--orange)" : "var(--fg-muted)", transition: "color 0.25s ease" }}>
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
    </motion.div>
  );
}

function Success() {
  return (
    <motion.div key="success" className="flex flex-col items-start gap-8 py-4"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
      <div className="relative w-[56px] h-[56px]">
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "var(--orange-dim)" }} />
        <div className="absolute inset-[7px] rounded-full border" style={{ borderColor: "var(--orange-tint)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[11px] h-[11px] rounded-full" style={{ background: "#eb4511", boxShadow: "0 0 14px 4px var(--orange-dim)" }} />
        </div>
      </div>
      <div>
        <div className="font-label-sm uppercase tracking-[0.42em] text-[9px] mb-5" style={{ color: "var(--orange-faint)" }}>Received</div>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, color: "var(--fg)" }}>
          We&apos;ll be in touch<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--fg-muted)" }}>shortly.</span>
        </div>
      </div>
      <div className="w-8 h-px" style={{ background: "#eb4511", opacity: 0.7 }} />
      <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.9, color: "var(--fg-muted)", maxWidth: "320px" }}>
        We review every submission personally and will reach out to schedule your review session.
      </div>
    </motion.div>
  );
}

export default function GetVerifiedPage() {
  const [values, setValues] = useState(Object.fromEntries(fields.map(f => [f.id, ""])));
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]             = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "verify", ...values }),
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
        style={{ background: "radial-gradient(ellipse 60% 45% at 50% 20%, var(--orange-tint) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex-1 max-w-[1100px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-10">
          <Link href="/"
            className="inline-flex items-center gap-2 font-label-sm uppercase tracking-[0.32em] text-[10px] transition-colors duration-200"
            style={{ color: "var(--fg-faint)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-faint)")}
          >← Home</Link>
        </motion.div>

        <motion.div className="flex items-center gap-4 mb-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <div className="w-8 h-px" style={{ background: "var(--border)" }} />
          <div className="font-label-sm uppercase tracking-[0.42em] text-[9px]" style={{ color: "var(--orange-faint)" }}>Verification</div>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </motion.div>

        {/* Two-column: heading left, form right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left — heading + context */}
          <div className="lg:col-span-4">
            <motion.div
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 54px)", lineHeight: 1.05, color: "var(--fg)", marginBottom: "20px" }}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}
            >
              Get Verified.
            </motion.div>
            <motion.div
              style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.85, color: "var(--fg-muted)", maxWidth: "320px" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.25 }}
            >
              You built something real. A senior engineer will review it in 45 minutes — your project, your decisions, your understanding. One score. One credential.
            </motion.div>
            <motion.div className="mt-8 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.35 }}>
              {["₹2,000 verification fee", "Score delivered within 24 hrs", "40–60% pass rate, by design"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#eb4511" }} />
                  <div style={{ fontSize: "12px", fontWeight: 400, color: "var(--fg-muted)" }}>{item}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              {sent ? <Success key="success" /> : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-8"
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.7, ease }}>
                  {fields.map((f, i) => (
                    <Field key={f.id} def={f} value={values[f.id]}
                      onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} index={i} />
                  ))}
                  <div className="pt-4">
                    <motion.button type="submit" disabled={submitting}
                      className="relative font-label-sm uppercase tracking-[0.3em] text-[11px] py-2"
                      style={{ color: submitting ? "var(--fg-faint)" : "var(--fg)", background: "transparent" }}
                      initial="rest" whileHover={submitting ? "rest" : "hover"} animate="rest" whileTap={{ scale: 0.98 }}>
                      {submitting ? "Sending…" : "Submit Application"}
                      <motion.span className="absolute bottom-0 left-0 h-[1px]" style={{ background: "#eb4511" }}
                        variants={{ rest: { width: "0%", transition: { duration: 0.3 } }, hover: { width: "100%", transition: { duration: 0.6, ease: [0.22,1,0.36,1] } } }} />
                    </motion.button>
                    {error && <div className="mt-3 font-label-sm text-[9px] tracking-[0.2em]" style={{ color: "#eb4511" }}>{error}</div>}
                    <div className="mt-4 font-label-sm uppercase tracking-[0.32em] text-[8px]" style={{ color: "var(--fg-faint)" }}>Fields marked * are required</div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
