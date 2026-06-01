"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const panels = [
  {
    num: "01",
    chapter: "The Problem",
    headline: "Everyone has a project.",
    body: "Someone spent six months building something real. Someone else spent a weekend prompting ChatGPT. Right now their portfolios look identical — and that gap is costing real builders their careers.",
  },
  {
    num: "02",
    chapter: "The Session",
    headline: "45 minutes. One engineer. Your work.",
    body: "Not a quiz. Not a take-home test. A real conversation about the project you built, every decision you made, every tradeoff you chose. The ones who built it for real talk about it differently.",
  },
  {
    num: "03",
    chapter: "The Proof",
    headline: "Now there's proof.",
    body: "An Orcred Score. A verified credential backed by a senior engineer's sign-off. Something you carry into any room and say — a real engineer reviewed this work. It passed.",
  },
];

/* ── Sticky timeline ── */
function Timeline({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const TOTAL = Math.round((typeof window !== "undefined" ? window.innerHeight : 800) * 0.76);

  const fillH   = useTransform(progress, [0, 1], [0, TOTAL]);
  const tipY    = useTransform(progress, [0, 1], [0, TOTAL]);

  return (
    <div style={{
      position:       "sticky",
      top:            0,
      height:         "100vh",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
    }}>
      <div style={{ position: "relative", height: TOTAL, width: 20 }}>

        {/* Grey track */}
        <div style={{
          position:        "absolute",
          left:            "50%",
          top:             0,
          bottom:          0,
          width:           3,
          backgroundColor: "rgba(15,13,12,0.08)",
          transform:       "translateX(-50%)",
          borderRadius:    3,
        }} />

        {/* Orange fill */}
        <motion.div style={{
          position:        "absolute",
          left:            "50%",
          top:             0,
          width:           3,
          height:          fillH,
          backgroundColor: "#eb4511",
          transform:       "translateX(-50%)",
          borderRadius:    3,
        }} />

        {/* Glowing tip — rides the end of the fill */}
        <motion.div style={{
          position:     "absolute",
          left:         "50%",
          top:          tipY,
          width:        10,
          height:       10,
          borderRadius: "50%",
          backgroundColor: "#eb4511",
          x:            "-50%",
          y:            "-50%",
          boxShadow:    "0 0 14px 5px rgba(235,69,17,0.55), 0 0 4px 2px rgba(235,69,17,0.9)",
        }} />

      </div>
    </div>
  );
}

/* ── Text panel ── */
function TextPanel({ panel }: { panel: (typeof panels)[number] }) {
  return (
    <div
      className="py-28 sm:py-36"
      style={{ borderBottom: "1px solid rgba(15,13,12,0.1)" }}
    >
      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="flex items-center gap-4">
          <span style={{ fontSize: 11, fontWeight: 700, color: "#eb4511" }}>{panel.num}</span>
          <div style={{ width: 28, height: 1, background: "rgba(15,13,12,0.15)" }} />
          <span className="font-label-sm uppercase tracking-[0.35em] text-[9px]" style={{ color: "rgba(15,13,12,0.45)" }}>
            {panel.chapter}
          </span>
        </div>

        <div style={{
          fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: 400,
          letterSpacing: "-0.02em", lineHeight: 1.15, color: "#0f0d0c",
        }}>
          {panel.headline}
        </div>

        <div style={{
          fontSize: "clamp(13px, 1.1vw, 15px)", fontWeight: 400,
          lineHeight: 1.85, color: "rgba(15,13,12,0.55)", maxWidth: 480,
        }}>
          {panel.body}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main export ── */
export default function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 40, damping: 25 });

  return (
    <section ref={sectionRef} id="story" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* Section label */}
      <motion.div
        className="px-6 sm:px-10 lg:px-16 pt-16 pb-0 max-w-[1400px] mx-auto flex items-center gap-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex-1 h-px" style={{ background: "rgba(15,13,12,0.1)" }} />
        <span className="font-label-sm uppercase tracking-[0.45em] text-[9px]" style={{ color: "rgba(15,13,12,0.4)" }}>
          The Standard
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(15,13,12,0.1)" }} />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Left: text */}
          <div className="lg:col-span-9">
            {panels.map((p, i) => <TextPanel key={i} panel={p} />)}
          </div>

          {/* Right: timeline */}
          <div className="hidden lg:block lg:col-span-3">
            <Timeline progress={progress} />
          </div>

        </div>
      </div>
    </section>
  );
}
