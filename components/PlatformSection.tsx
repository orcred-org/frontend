"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const panels = [
  {
    num: "01", eyebrow: "The Problem",
    headline: "Everyone has a project.",
    body: "Someone spent six months building something real. Someone else spent a weekend prompting ChatGPT. Right now their portfolios look identical — and that gap is costing real builders their careers.",
  },
  {
    num: "02", eyebrow: "The Session",
    headline: "45 minutes. One engineer. Your work.",
    body: "Not a quiz. Not a take-home test. A real conversation about the project you built, every decision you made, every tradeoff you chose. The ones who built it for real talk about it differently.",
  },
  {
    num: "03", eyebrow: "The Proof",
    headline: "Now there's proof.",
    body: "An Orcred Score. A verified credential backed by a senior engineer's sign-off. Something you carry into any room — a real engineer reviewed this work. It passed.",
  },
];

/* ── Card 1: large circle ring + signal dots ── */
function ImageProblem() {
  const total = 24; const signal = 13;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Bold circle ring */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="200" cy="150" r="115" fill="none" stroke="#eb4511" strokeWidth="54" />
      </svg>
      {/* Signal dots overlay */}
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 18 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width:           i === signal ? 13 : 8,
            height:          i === signal ? 13 : 8,
            borderRadius:    "50%",
            backgroundColor: i === signal ? "#0f0d0c" : "rgba(15,13,12,0.18)",
            alignSelf:  "center",
            justifySelf: "center",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Card 2: X shape + 45 ── */
function ImageSession() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Bold X */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1="55"  y1="15"  x2="345" y2="285" stroke="#eb4511" strokeWidth="80" strokeLinecap="round" />
        <line x1="345" y1="15"  x2="55"  y2="285" stroke="#eb4511" strokeWidth="80" strokeLinecap="round" />
      </svg>
      {/* 45 overlaid */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#ffffff" }}>45</div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", marginTop: 8 }}>minutes</div>
      </div>
    </div>
  );
}

/* ── Card 3: diagonal slash + 87 ── */
function ImageProof() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Bold diagonal bar */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1="-40" y1="350" x2="440" y2="-50" stroke="#eb4511" strokeWidth="140" />
      </svg>
      {/* 87/100 overlaid */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", gap: 4 }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#ffffff" }}>87</div>
        <div style={{ fontSize: 24, fontWeight: 400, color: "rgba(255,255,255,0.78)", marginBottom: 12, lineHeight: 1 }}>/100</div>
      </div>
    </div>
  );
}

/* ── Single card ── */
function PanelCard({
  panel,
  visual,
  index,
}: {
  panel: (typeof panels)[number];
  visual: React.ReactNode;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      style={{
        backgroundColor: "#ffffff",
        border:          "1px solid rgba(15,13,12,0.10)",
        overflow:        "hidden",
        cursor:          "default",
        transform:       hovered ? "translateY(-6px)" : "translateY(0px)",
        boxShadow:       hovered
          ? "0 24px 48px rgba(15,13,12,0.10), 0 4px 12px rgba(15,13,12,0.06)"
          : "0 2px 6px rgba(15,13,12,0.04)",
        transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Shape / image area */}
      <div style={{
        height:          "272px",
        position:        "relative",
        backgroundColor: "var(--bg-page)",
        borderBottom:    "1px solid rgba(15,13,12,0.07)",
      }}>
        {visual}
      </div>

      {/* Content */}
      <div style={{ padding: "22px 24px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#eb4511" }}>{panel.num}</div>
          <div style={{ width: 14, height: 1, background: "rgba(15,13,12,0.15)" }} />
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(15,13,12,0.4)" }}>
            {panel.eyebrow}
          </div>
        </div>
        <div style={{
          fontSize:      "clamp(17px, 1.6vw, 22px)",
          fontWeight:    500,
          letterSpacing: "-0.02em",
          lineHeight:    1.2,
          color:         "#0f0d0c",
          marginBottom:  10,
        }}>
          {panel.headline}
        </div>
        <div style={{
          fontSize:   "clamp(13px, 1vw, 14px)",
          fontWeight: 400,
          lineHeight: 1.8,
          color:      "rgba(15,13,12,0.55)",
        }}>
          {panel.body}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section ── */
export default function PlatformSection() {
  const visuals = [
    <ImageProblem key={0} />,
    <ImageSession key={1} />,
    <ImageProof   key={2} />,
  ];

  return (
    <section
      id="story"
      className="py-14 sm:py-16 px-6 sm:px-10 lg:px-16"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {panels.map((panel, i) => (
            <PanelCard key={i} panel={panel} visual={visuals[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
