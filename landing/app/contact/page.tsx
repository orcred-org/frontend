"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

const fields = [
  { id: "name",    label: "Full Name",  placeholder: "Your name",        type: "text"     as const, required: true  },
  { id: "email",   label: "Email",      placeholder: "you@example.com",  type: "email"    as const, required: true  },
  { id: "message", label: "Message",    placeholder: "How can we help?", type: "textarea" as const, required: true  },
];

function Field({ def, value, onChange, index }: {
  def: typeof fields[0]; value: string; onChange: (v: string) => void; index: number;
}) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    background: "transparent", color: "#0f0d0c", outline: "none", width: "100%",
    fontWeight: 400, fontSize: "14px", lineHeight: 1.75, paddingBottom: "10px", resize: "none",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: index * 0.07, ease }}>
      <label htmlFor={def.id} style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: focused ? "#eb4511" : "rgba(15,13,12,0.4)", transition: "color 0.25s ease", display: "block", marginBottom: 8 }}>
        {def.label}{def.required && <span style={{ color: "#eb4511", marginLeft: "4px" }}>*</span>}
      </label>
      {def.type === "textarea" ? (
        <textarea id={def.id} rows={4} value={value} placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base} className="block placeholder:text-[rgba(15,13,12,0.25)]" />
      ) : (
        <input id={def.id} type={def.type} value={value} placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, display: "block" }} className="placeholder:text-[rgba(15,13,12,0.25)]" />
      )}
      <div className="w-full h-px mt-1 transition-colors duration-300"
        style={{ background: focused ? "#eb4511" : "rgba(15,13,12,0.12)" }} />
    </motion.div>
  );
}

function Success() {
  return (
    <motion.div key="success" className="flex flex-col items-start gap-8 py-4"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
      <div className="relative w-[56px] h-[56px]">
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(235,69,17,0.3)" }} />
        <div className="absolute inset-[7px] rounded-full border" style={{ borderColor: "rgba(235,69,17,0.15)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[11px] h-[11px] rounded-full" style={{ background: "#eb4511", boxShadow: "0 0 14px 4px rgba(235,69,17,0.25)" }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#eb4511", marginBottom: 16 }}>Received</div>
        <div style={{ fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#0f0d0c" }}>
          We&apos;ll be in touch shortly.
        </div>
      </div>
      <div className="w-8 h-px" style={{ background: "#eb4511", opacity: 0.7 }} />
      <div style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.8, color: "rgba(15,13,12,0.55)", maxWidth: "320px" }}>
        We read every message personally and will get back to you soon.
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  const [values, setValues]       = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...values }),
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

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="relative z-10 flex-1 flex flex-col max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">

        {/* Page title */}
        <motion.div className="mb-14" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#eb4511" }}>
              Contact
            </span>
          </div>
          <div style={{ fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#0f0d0c", marginBottom: 12 }}>
            Contact Us
          </div>
          <div style={{ fontSize: "clamp(14px, 1.2vw, 16px)", fontWeight: 400, lineHeight: 1.7, color: "rgba(15,13,12,0.45)", fontStyle: "italic" }}>
            Every message is read by a founder.
          </div>
        </motion.div>

        <div className="w-full h-px mb-12" style={{ background: "rgba(15,13,12,0.1)" }} />

        <AnimatePresence mode="wait">
          {sent ? <Success key="success" /> : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-9 max-w-xl"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.7, ease }}>
              {fields.map((f, i) => (
                <Field key={f.id} def={f} value={values[f.id as keyof typeof values]}
                  onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} index={i} />
              ))}
              <div className="pt-4">
                <motion.button type="submit" disabled={submitting}
                  className="relative uppercase text-[11px] py-2"
                  style={{ fontWeight: 500, letterSpacing: "0.2em", color: submitting ? "rgba(15,13,12,0.35)" : "#0f0d0c", background: "transparent" }}
                  initial="rest" whileHover={submitting ? "rest" : "hover"} animate="rest" whileTap={{ scale: 0.98 }}>
                  {submitting ? "Sending…" : "Send Message"}
                  <motion.span className="absolute bottom-0 left-0 h-[1px]" style={{ background: "#eb4511" }}
                    variants={{ rest: { width: "0%", transition: { duration: 0.3, ease: "easeOut" } }, hover: { width: "100%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} />
                </motion.button>
                {error && <div className="mt-3 text-[9px] tracking-[0.2em]" style={{ color: "#eb4511" }}>{error}</div>}
                <div className="mt-4 uppercase text-[8px] tracking-[0.28em]" style={{ color: "rgba(15,13,12,0.35)" }}>Fields marked * are required</div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
