"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── field types ─── */
interface FieldDef {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "url" | "textarea";
  required?: boolean;
}

const verifyFields: FieldDef[] = [
  { id: "name",        label: "Full Name",                        placeholder: "Your name",                                    type: "text",     required: true  },
  { id: "email",       label: "Email",                            placeholder: "you@example.com",                              type: "email",    required: true  },
  { id: "github",      label: "GitHub / LinkedIn",                placeholder: "github.com/you",                               type: "url"                      },
  { id: "project",     label: "Project Title",                    placeholder: "What did you build?",                          type: "text",     required: true  },
  { id: "stack",       label: "Tech Stack",                       placeholder: "PyTorch, FastAPI, Pinecone…",                  type: "text"                     },
  { id: "description", label: "What does it do?",                 placeholder: "One or two sentences on the problem it solves.", type: "textarea", required: true },
  { id: "decision",    label: "Hardest technical decision made",  placeholder: "Walk us through one real tradeoff.",            type: "textarea", required: true },
];

const reviewerFields: FieldDef[] = [
  { id: "name",        label: "Full Name",                        placeholder: "Your name",                                    type: "text",     required: true  },
  { id: "email",       label: "Email",                            placeholder: "you@example.com",                              type: "email",    required: true  },
  { id: "linkedin",    label: "LinkedIn / GitHub",                placeholder: "linkedin.com/in/you",                          type: "url"                      },
  { id: "role",        label: "Current Role & Company",           placeholder: "e.g. Senior ML Engineer @ Stripe",             type: "text",     required: true  },
  { id: "years",       label: "Years in ML",                      placeholder: "e.g. 6 years",                                 type: "text",     required: true  },
  { id: "scope",       label: "What kind of work do you review?", placeholder: "Describe the domain / stack you know best.",   type: "textarea", required: true  },
];

/* ─── single field ─── */
function Field({
  def, value, onChange, index,
}: {
  def: FieldDef; value: string; onChange: (v: string) => void; index: number;
}) {
  const [focused, setFocused] = useState(false);

  const base: React.CSSProperties = {
    background: "transparent",
    color: "rgba(235,225,205,0.88)",
    outline: "none",
    width: "100%",
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontWeight: 300,
    fontSize: "14px",
    lineHeight: 1.75,
    paddingBottom: "10px",
    resize: "none",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.07, ease }}
    >
      <label
        htmlFor={def.id}
        className="font-label-sm uppercase tracking-[0.38em] text-[9px] block mb-2"
        style={{
          color: focused ? "rgba(235,69,17,0.7)" : "rgba(235,225,205,0.45)",
          transition: "color 0.25s ease",
        }}
      >
        {def.label}
        {def.required && (
          <span style={{ color: "rgba(235,69,17,0.5)", marginLeft: "4px" }}>*</span>
        )}
      </label>

      {def.type === "textarea" ? (
        <textarea
          id={def.id}
          rows={3}
          value={value}
          placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
          className="block placeholder:text-[rgba(235,225,205,0.38)]"
        />
      ) : (
        <input
          id={def.id}
          type={def.type}
          value={value}
          placeholder={def.placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...base, display: "block" }}
          className="placeholder:text-[rgba(235,225,205,0.38)]"
        />
      )}

      <div
        className="w-full h-px mt-1 transition-colors duration-300"
        style={{ background: focused ? "rgba(235,69,17,0.55)" : "rgba(235,225,205,0.30)" }}
      />
    </motion.div>
  );
}

/* ─── form block ─── */
function FormBlock({
  fields,
  onSubmit,
}: {
  fields: FieldDef[];
  onSubmit: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.id, ""]))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.form
      key="form"
      onSubmit={handleSubmit}
      className="space-y-9 w-full"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease }}
    >
      {fields.map((f, i) => (
        <Field
          key={f.id}
          def={f}
          value={values[f.id]}
          onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))}
          index={i}
        />
      ))}

      <div className="pt-4">
        <motion.button
          type="submit"
          className="relative font-label-sm uppercase tracking-[0.3em] text-[11px] py-2"
          style={{ color: "rgba(235,225,205,0.88)", background: "transparent" }}
          initial="rest"
          whileHover="hover"
          animate="rest"
          whileTap={{ scale: 0.98 }}
        >
          Submit
          <motion.span
            className="absolute bottom-0 left-0 h-[1px]"
            style={{ background: "#eb4511" }}
            variants={{
              rest:  { width: "0%",   transition: { duration: 0.3, ease: "easeOut" } },
              hover: { width: "100%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          />
        </motion.button>
        <p
          className="mt-4 font-label-sm uppercase tracking-[0.32em] text-[8px]"
          style={{ color: "rgba(235,225,205,0.35)" }}
        >
          Fields marked * are required
        </p>
      </div>
    </motion.form>
  );
}

/* ─── success state ─── */
function Success() {
  return (
    <motion.div
      key="success"
      className="flex flex-col items-start gap-8 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="relative w-[56px] h-[56px]">
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(235,69,17,0.4)" }} />
        <div className="absolute inset-[7px] rounded-full border" style={{ borderColor: "rgba(235,69,17,0.18)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[11px] h-[11px] rounded-full"
            style={{ background: "#eb4511", boxShadow: "0 0 14px 4px rgba(235,69,17,0.45)" }}
          />
        </div>
      </div>

      <div>
        <p
          className="font-label-sm uppercase tracking-[0.42em] text-[9px] mb-5"
          style={{ color: "rgba(235,69,17,0.65)" }}
        >
          Received
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: 1.05,
            color: "rgba(235,225,205,0.92)",
          }}
        >
          We&apos;ll be in touch
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(235,225,205,0.65)" }}>
            shortly.
          </span>
        </h2>
      </div>

      <div className="w-8 h-px" style={{ background: "#eb4511", opacity: 0.7 }} />

      <p
        className="text-[13px] font-light leading-[1.9] max-w-xs"
        style={{ color: "rgba(235,225,205,0.62)" }}
      >
        We review every submission personally and will reach out to schedule next steps.
      </p>
    </motion.div>
  );
}

/* ─── page ─── */
type Path = "verify" | "reviewer" | null;

export default function ContactPage() {
  const [path,  setPath]  = useState<Path>(null);
  const [sent,  setSent]  = useState(false);

  const choosePath = (p: Path) => {
    setSent(false);
    setPath(p);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#010204" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(235,69,17,0.045) 0%, transparent 70%)",
        }}
      />

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 flex flex-col max-w-[1100px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24">

        {/* Section marker */}
        <motion.div
          className="flex items-center gap-4 mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="w-8 h-px" style={{ background: "rgba(235,225,205,0.13)" }} />
          <span
            className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
            style={{ color: "rgba(235,69,17,0.6)" }}
          >
            Get in touch
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(235,225,205,0.13)" }} />
        </motion.div>

        {/* Path selector */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-0 mb-0"
          style={{ borderBottom: path ? "1px solid rgba(235,225,205,0.13)" : "none" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          {([
            {
              key:      "verify"   as Path,
              eyebrow:  "Student / Engineer",
              headline: "Get Verified",
              body:     "You built something real. Let a senior engineer verify it in 45 minutes.",
            },
            {
              key:      "reviewer" as Path,
              eyebrow:  "Senior ML Engineer",
              headline: "Become a Reviewer",
              body:     "You can tell in 60 seconds. Join us as a reviewer and shape the standard.",
            },
          ] as const).map((opt, i) => {
            const active = path === opt.key;
            const faded  = path !== null && !active;

            return (
              <motion.button
                key={opt.key}
                onClick={() => choosePath(active ? null : opt.key)}
                className={`relative text-left px-0 py-10 sm:py-12 flex flex-col gap-4 overflow-hidden ${
                  i === 0
                    ? "border-b sm:border-b-0 sm:border-r sm:pr-12"
                    : "sm:pl-12"
                }`}
                style={{
                  borderColor: "rgba(235,225,205,0.13)",
                  opacity: faded ? 0.25 : 1,
                  transition: "opacity 0.4s ease",
                }}
                initial="rest"
                whileHover={active ? "active" : faded ? "rest" : "hover"}
                animate={active ? "active" : "rest"}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: i === 0
                      ? "radial-gradient(ellipse 80% 100% at 20% 50%, rgba(235,69,17,0.06) 0%, transparent 70%)"
                      : "radial-gradient(ellipse 80% 100% at 80% 50%, rgba(235,69,17,0.06) 0%, transparent 70%)",
                  }}
                  variants={{ rest: { opacity: 0 }, hover: { opacity: 1 }, active: { opacity: 0 } }}
                  transition={{ duration: 0.4 }}
                />

                {/* Eyebrow */}
                <motion.span
                  className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
                  variants={{
                    rest:   { color: "rgba(235,225,205,0.42)", x: 0   },
                    hover:  { color: "rgba(235,69,17,0.75)",   x: i === 0 ? 4 : -4 },
                    active: { color: "rgba(235,69,17,0.80)",   x: 0   },
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {opt.eyebrow}
                </motion.span>

                {/* Headline */}
                <motion.span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                    fontStyle: active ? "italic" : "normal",
                    fontSize: "clamp(32px, 4vw, 58px)",
                    lineHeight: 1.0,
                    display: "block",
                    transition: "font-style 0.2s ease",
                  }}
                  variants={{
                    rest:   { color: "rgba(235,225,205,0.82)", scale: 1,    x: 0   },
                    hover:  { color: "rgba(235,225,205,0.96)", scale: 1.03, x: i === 0 ? 6 : -6 },
                    active: { color: "#eb4511",                scale: 1,    x: 0   },
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {opt.headline}
                </motion.span>

                {/* Body */}
                <motion.span
                  className="text-[13px] font-light leading-relaxed max-w-xs block"
                  variants={{
                    rest:   { color: "rgba(235,225,205,0.48)", x: 0   },
                    hover:  { color: "rgba(235,225,205,0.70)", x: i === 0 ? 4 : -4 },
                    active: { color: "rgba(235,225,205,0.75)", x: 0   },
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {opt.body}
                </motion.span>

                {/* Underline — partial on hover, full when active */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[1px]"
                  style={{ background: "#eb4511" }}
                  variants={{
                    rest:   { width: "0%",   opacity: 0.6 },
                    hover:  { width: "35%",  opacity: 0.5 },
                    active: { width: "100%", opacity: 1   },
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Form area */}
        <AnimatePresence mode="wait">
          {path && (
            <motion.div
              key={path}
              className="mt-16 sm:mt-20 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.65, ease }}
            >
              {/* Form label */}
              <div className="mb-10">
                <span
                  className="font-label-sm uppercase tracking-[0.42em] text-[9px]"
                  style={{ color: "rgba(235,225,205,0.40)" }}
                >
                  {path === "verify" ? "Verification Application" : "Reviewer Application"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <Success key="success" />
                ) : (
                  <FormBlock
                    key={path + "-form"}
                    fields={path === "verify" ? verifyFields : reviewerFields}
                    onSubmit={() => setSent(true)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
