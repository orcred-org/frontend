"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const panels = [
  {
    num: "01",
    headline: "Everyone has a project.",
    body: "Someone spent six months building something real. Someone else spent a weekend prompting ChatGPT. Right now their portfolios look identical — and that gap is costing real builders their careers.",
  },
  {
    num: "02",
    headline: "45 minutes. One engineer. Your work.",
    body: "Not a quiz. Not a take-home test. A real conversation about the project you built, every decision you made, every tradeoff you chose. The ones who built it for real talk about it differently.",
  },
  {
    num: "03",
    headline: "Now there's proof.",
    body: "An Orcred Score. A verified credential backed by a senior engineer's sign-off. Something you carry into any room — a real engineer reviewed this work. It passed.",
  },
];

/* ── Visual 1: signal grid ── */
function SignalGrid() {
  const total = 24; const signal = 13;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === signal ? 10 : 7,
            height: i === signal ? 10 : 7,
            borderRadius: "50%",
            backgroundColor: i === signal ? "#eb4511" : "rgba(15,13,12,0.15)",
            boxShadow: i === signal ? "0 0 10px 3px rgba(235,69,17,0.3)" : "none",
            alignSelf: "center", justifySelf: "center",
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(15,13,12,0.35)" }}>
        1 signal in 24
      </div>
    </div>
  );
}

/* ── Visual 2: clock arc ── */
function ClockVisual() {
  const r = 72; const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 180, height: 180 }}>
        <svg viewBox="0 0 180 180" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(15,13,12,0.08)" strokeWidth="1.5" />
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return <line key={i}
              x1={90 + (r - 6) * Math.cos(rad)} y1={90 + (r - 6) * Math.sin(rad)}
              x2={90 + (r + 3) * Math.cos(rad)} y2={90 + (r + 3) * Math.sin(rad)}
              stroke="rgba(15,13,12,0.2)" strokeWidth="1" />;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, color: "#0f0d0c" }}>45</div>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(15,13,12,0.35)", marginTop: 4 }}>min</div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(15,13,12,0.35)" }}>
        One session
      </div>
    </div>
  );
}

/* ── Visual 3: score bars ── */
function ScoreVisual() {
  const bars = [
    { label: "Tech Depth",   w: "91%" },
    { label: "Communication",w: "84%" },
    { label: "Reproducibility", w: "88%" },
    { label: "Originality",  w: "79%" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 220 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#0f0d0c" }}>87</div>
        <div style={{ fontSize: 18, color: "#eb4511", fontWeight: 400, marginBottom: 6 }}>/100</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {bars.map((b) => (
          <div key={b.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(15,13,12,0.4)" }}>{b.label}</div>
              <div style={{ fontSize: 8, color: "rgba(15,13,12,0.3)" }}>{b.w}</div>
            </div>
            <div style={{ height: 2, background: "rgba(15,13,12,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: b.w, backgroundColor: "#eb4511", opacity: 0.65 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Panel with visual ── */
function Panel({ panel, visual }: { panel: (typeof panels)[number]; visual: React.ReactNode }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      backgroundColor: "var(--bg-page)",
      borderTop: "1px solid rgba(15,13,12,0.1)",
      display: "flex", alignItems: "center",
      padding: "0 clamp(24px, 5vw, 64px)",
      gap: "clamp(32px, 6vw, 80px)",
    }}>
      {/* Text */}
      <div style={{ flex: "0 0 auto", maxWidth: 480, display: "flex", alignItems: "baseline", gap: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#eb4511", flexShrink: 0 }}>{panel.num}</div>
        <div>
          <div style={{ fontSize: "clamp(16px, 1.8vw, 24px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#0f0d0c", marginBottom: 10 }}>
            {panel.headline}
          </div>
          <div style={{ fontSize: "clamp(12px, 1vw, 14px)", fontWeight: 400, lineHeight: 1.8, color: "rgba(15,13,12,0.52)" }}>
            {panel.body}
          </div>
        </div>
      </div>

      {/* Visual */}
      <div className="hidden lg:flex" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {visual}
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

export default function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = scrollYProgress;

  const panel2Y = useTransform(progress, [0.15, 0.48], ["66.67vh", "0vh"]);
  const panel3Y = useTransform(progress, [0.52, 0.85], ["33.33vh", "0vh"]);


  return (
    <section ref={sectionRef} id="story" style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Panel 1 — text + visual together */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "33.33vh" }}>
          <Panel panel={panels[0]} visual={<SignalGrid />} />
        </div>

        {/* Panel 2 */}
        <motion.div style={{ position: "absolute", top: "33.33vh", left: 0, right: 0, height: "33.33vh", y: panel2Y }}>
          <Panel panel={panels[1]} visual={<ClockVisual />} />
        </motion.div>

        {/* Panel 3 */}
        <motion.div style={{ position: "absolute", top: "66.67vh", left: 0, right: 0, height: "33.33vh", y: panel3Y }}>
          <Panel panel={panels[2]} visual={<ScoreVisual />} />
        </motion.div>

        {/* Timeline */}
        <TimelineSidebar progress={progress} />

      </div>
    </section>
  );
}
