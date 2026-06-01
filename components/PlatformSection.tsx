"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const panels = [
  { num: "01", eyebrow: "The Problem",  headline: "Everyone has\na project."       },
  { num: "02", eyebrow: "The Session",  headline: "45 minutes.\nOne engineer."     },
  { num: "03", eyebrow: "The Proof",    headline: "Now there's\nproof."            },
];

/* ── Large signal grid ── */
function SignalGrid() {
  const total = 24; const signal = 13;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 22 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width:        i === signal ? 18 : 11,
          height:       i === signal ? 18 : 11,
          borderRadius: "50%",
          backgroundColor: i === signal ? "#eb4511" : "rgba(15,13,12,0.11)",
          boxShadow:    i === signal ? "0 0 22px 8px rgba(235,69,17,0.22)" : "none",
          alignSelf: "center", justifySelf: "center",
        }} />
      ))}
    </div>
  );
}

/* ── Large clock ── */
function ClockVisual() {
  const r = 128;
  const ticks = [0, 90, 180, 270].map(deg => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x1: 160 + (r - 10) * Math.cos(rad), y1: 160 + (r - 10) * Math.sin(rad),
      x2: 160 + (r + 5)  * Math.cos(rad), y2: 160 + (r + 5)  * Math.sin(rad),
    };
  });
  return (
    <div style={{ position: "relative", width: 320, height: 320 }}>
      <svg viewBox="0 0 320 320" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <circle cx="160" cy="160" r={r} fill="none" stroke="rgba(15,13,12,0.07)" strokeWidth="1.5" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(15,13,12,0.18)" strokeWidth="1.5" />
        ))}
        {["0", "15", "30", "45"].map((label, i) => {
          const rad = (i * 90 - 90) * Math.PI / 180;
          return (
            <text key={i}
              x={160 + (r + 22) * Math.cos(rad)} y={160 + (r + 22) * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="central"
              style={{ fill: "rgba(15,13,12,0.28)", fontSize: "11px", letterSpacing: "0.05em" }}
            >{label}</text>
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#0f0d0c" }}>45</div>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(15,13,12,0.32)", marginTop: 8 }}>minutes</div>
      </div>
    </div>
  );
}

/* ── Large score ── */
function ScoreVisual() {
  const bars = [
    { label: "Technical Depth",   w: "91%" },
    { label: "Communication",     w: "84%" },
    { label: "Reproducibility",   w: "88%" },
    { label: "Originality",       w: "79%" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: 340 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#0f0d0c" }}>87</div>
        <div style={{ fontSize: 30, color: "#eb4511", fontWeight: 400, marginBottom: 14 }}>/100</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bars.map(b => (
          <div key={b.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(15,13,12,0.42)" }}>{b.label}</div>
              <div style={{ fontSize: 9, color: "rgba(15,13,12,0.32)" }}>{b.w}</div>
            </div>
            <div style={{ height: 2.5, background: "rgba(15,13,12,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: b.w, backgroundColor: "#eb4511", opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Full-viewport panel ── */
function FullPanel({ panel, visual }: { panel: (typeof panels)[number]; visual: React.ReactNode }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      backgroundColor: "var(--bg-page)",
      display: "flex", flexDirection: "column",
      padding: "clamp(60px, 8vh, 88px) clamp(24px, 5vw, 80px)",
    }}>
      {/* Eyebrow — top */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#eb4511" }}>{panel.num}</div>
        <div style={{ width: 18, height: 1, background: "rgba(15,13,12,0.15)" }} />
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(15,13,12,0.4)" }}>
          {panel.eyebrow}
        </div>
      </div>

      {/* Visual — centered, takes all available space */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visual}
      </div>

      {/* Headline — bottom */}
      <div style={{
        fontSize: "clamp(34px, 4.2vw, 58px)",
        fontWeight: 400,
        letterSpacing: "-0.025em",
        lineHeight: 1.1,
        color: "#0f0d0c",
      }}>
        {panel.headline.split("\n").map((line, i) => (
          <span key={i}>{line}{i === 0 && <br />}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Timeline ── */
function TimelineSidebar({ progress }: { progress: MotionValue<number> }) {
  const fillH = useTransform(progress, [0, 1], ["0vh", "76vh"]);
  const tipY  = useTransform(progress, [0, 1], ["0vh", "76vh"]);
  return (
    <div className="hidden lg:flex" style={{ position: "absolute", right: "clamp(32px, 5vw, 80px)", top: 0, height: "100%", alignItems: "center" }}>
      <div style={{ position: "relative", height: "76vh", width: 20 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, backgroundColor: "rgba(15,13,12,0.08)", transform: "translateX(-50%)", borderRadius: 3 }} />
        <motion.div style={{ position: "absolute", left: "50%", top: 0, width: 3, height: fillH, backgroundColor: "#eb4511", transform: "translateX(-50%)", borderRadius: 3 }} />
        <motion.div style={{ position: "absolute", left: "50%", top: tipY, width: 4, height: 4, borderRadius: "50%", backgroundColor: "#eb4511", x: "-50%", y: "-50%", boxShadow: "0 0 6px 3px rgba(235,69,17,0.35)" }} />
      </div>
    </div>
  );
}

/* ── Main ── */
export default function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = scrollYProgress;

  // Panel 1 exits upward
  const panel1Y = useTransform(progress, [0.28, 0.46], ["0vh", "-100vh"]);
  // Panel 2 enters from below, exits upward
  const panel2Y = useTransform(progress, [0.28, 0.46, 0.6, 0.78], ["100vh", "0vh", "0vh", "-100vh"]);
  // Panel 3 enters from below
  const panel3Y = useTransform(progress, [0.6, 0.78], ["100vh", "0vh"]);

  return (
    <section ref={sectionRef} id="story" style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        <motion.div style={{ position: "absolute", inset: 0, y: panel1Y }}>
          <FullPanel panel={panels[0]} visual={<SignalGrid />} />
        </motion.div>

        <motion.div style={{ position: "absolute", inset: 0, y: panel2Y }}>
          <FullPanel panel={panels[1]} visual={<ClockVisual />} />
        </motion.div>

        <motion.div style={{ position: "absolute", inset: 0, y: panel3Y }}>
          <FullPanel panel={panels[2]} visual={<ScoreVisual />} />
        </motion.div>

        <TimelineSidebar progress={progress} />

      </div>
    </section>
  );
}
