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

/* ── Signal grid ── */
function SignalGrid() {
  const total = 24; const signal = 13;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width:           i === signal ? 16 : 10,
          height:          i === signal ? 16 : 10,
          borderRadius:    "50%",
          backgroundColor: i === signal ? "#eb4511" : "rgba(15,13,12,0.10)",
          boxShadow:       i === signal ? "0 0 18px 7px rgba(235,69,17,0.20)" : "none",
          alignSelf: "center", justifySelf: "center",
        }} />
      ))}
    </div>
  );
}

/* ── Clock ── */
function ClockVisual() {
  const r = 96;
  const ticks = [0, 90, 180, 270].map(deg => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x1: 120 + (r - 8)  * Math.cos(rad), y1: 120 + (r - 8)  * Math.sin(rad),
      x2: 120 + (r + 4)  * Math.cos(rad), y2: 120 + (r + 4)  * Math.sin(rad),
    };
  });
  return (
    <div style={{ position: "relative", width: 240, height: 240 }}>
      <svg viewBox="0 0 240 240" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <circle cx="120" cy="120" r={r} fill="none" stroke="rgba(15,13,12,0.07)" strokeWidth="1.5" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(15,13,12,0.18)" strokeWidth="1.5" />
        ))}
        {["0", "15", "30", "45"].map((label, i) => {
          const rad = (i * 90 - 90) * Math.PI / 180;
          return (
            <text key={i}
              x={120 + (r + 18) * Math.cos(rad)} y={120 + (r + 18) * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="central"
              style={{ fill: "rgba(15,13,12,0.26)", fontSize: "10px", letterSpacing: "0.05em" }}
            >{label}</text>
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#0f0d0c" }}>45</div>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(15,13,12,0.32)", marginTop: 6 }}>minutes</div>
      </div>
    </div>
  );
}

/* ── Score ── */
function ScoreVisual() {
  const bars = [
    { label: "Technical Depth", w: "91%" },
    { label: "Communication",   w: "84%" },
    { label: "Reproducibility", w: "88%" },
    { label: "Originality",     w: "79%" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 300 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#0f0d0c" }}>87</div>
        <div style={{ fontSize: 22, color: "#eb4511", fontWeight: 400, marginBottom: 10 }}>/100</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {bars.map(b => (
          <div key={b.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(15,13,12,0.42)" }}>{b.label}</div>
              <div style={{ fontSize: 9, color: "rgba(15,13,12,0.32)" }}>{b.w}</div>
            </div>
            <div style={{ height: 2, background: "rgba(15,13,12,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: b.w, backgroundColor: "#eb4511", opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Single card ── */
function PanelCard({
  panel, visual, index,
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
        backgroundColor:  "#ffffff",
        border:           "1px solid rgba(15,13,12,0.10)",
        overflow:         "hidden",
        cursor:           "default",
        transform:        hovered ? "translateY(-6px)" : "translateY(0px)",
        boxShadow:        hovered
          ? "0 24px 48px rgba(15,13,12,0.10), 0 4px 12px rgba(15,13,12,0.06)"
          : "0 2px 6px rgba(15,13,12,0.04)",
        transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Visual area */}
      <div style={{
        height:          "260px",
        backgroundColor: "rgba(235,69,17,0.025)",
        borderBottom:    "1px solid rgba(15,13,12,0.07)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "24px",
        overflow:        "hidden",
      }}>
        {visual}
      </div>

      {/* Content area */}
      <div style={{ padding: "22px 24px 26px" }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#eb4511" }}>{panel.num}</div>
          <div style={{ width: 14, height: 1, background: "rgba(15,13,12,0.15)" }} />
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(15,13,12,0.4)" }}>
            {panel.eyebrow}
          </div>
        </div>

        {/* Headline */}
        <div style={{
          fontSize:      "clamp(17px, 1.6vw, 22px)",
          fontWeight:    400,
          letterSpacing: "-0.02em",
          lineHeight:    1.2,
          color:         "#0f0d0c",
          marginBottom:  10,
        }}>
          {panel.headline}
        </div>

        {/* Body */}
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
  const visuals = [<SignalGrid key={0} />, <ClockVisual key={1} />, <ScoreVisual key={2} />];

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
