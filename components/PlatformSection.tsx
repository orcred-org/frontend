"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

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

/* ── Full-viewport panel content ── */
function PanelContent({
  panel,
  showLabel,
}: {
  panel: (typeof panels)[number];
  showLabel?: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(24px, 5vw, 64px)",
      }}
    >
      <div style={{ maxWidth: 640 }}>

        {showLabel && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(15,13,12,0.35)" }}>
              The Standard
            </div>
            <div style={{ flex: 1, height: 1, background: "rgba(15,13,12,0.1)", maxWidth: 120 }} />
          </div>
        )}

        {/* Chapter marker */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#eb4511" }}>{panel.num}</div>
          <div style={{ width: 24, height: 1, background: "rgba(15,13,12,0.15)" }} />
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(15,13,12,0.45)" }}>
            {panel.chapter}
          </div>
        </div>

        {/* Headline */}
        <div style={{
          fontSize:      "clamp(22px, 2.8vw, 38px)",
          fontWeight:    400,
          letterSpacing: "-0.02em",
          lineHeight:    1.15,
          color:         "#0f0d0c",
          marginBottom:  20,
        }}>
          {panel.headline}
        </div>

        {/* Body */}
        <div style={{
          fontSize:   "clamp(13px, 1.1vw, 15px)",
          fontWeight: 400,
          lineHeight: 1.85,
          color:      "rgba(15,13,12,0.55)",
          maxWidth:   480,
        }}>
          {panel.body}
        </div>
      </div>
    </div>
  );
}

/* ── Timeline sidebar ── */
function TimelineSidebar({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const totalPx = typeof window !== "undefined" ? window.innerHeight * 0.76 : 608;
  const fillH = useTransform(progress, [0, 1], [0, totalPx]);
  const tipY  = useTransform(progress, [0, 1], [0, totalPx]);

  return (
    <div
      style={{
        position: "absolute",
        right:    "clamp(48px, 7vw, 120px)",
        top:      0,
        height:   "100%",
        display:  "flex",
        alignItems: "center",
      }}
      className="hidden lg:flex"
    >
      <div style={{ position: "relative", height: totalPx, width: 20 }}>
        {/* Track */}
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

        {/* Glowing tip */}
        <motion.div style={{
          position:        "absolute",
          left:            "50%",
          top:             tipY,
          width:           10,
          height:          10,
          borderRadius:    "50%",
          backgroundColor: "#eb4511",
          x:               "-50%",
          y:               "-50%",
          boxShadow:       "0 0 14px 5px rgba(235,69,17,0.55), 0 0 4px 2px rgba(235,69,17,0.9)",
        }} />
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });

  // Panel 1 slides out upward: progress 0.25 → 0.45
  const panel1Y = useTransform(progress, [0.25, 0.48], ["0vh", "-100vh"]);

  // Panel 2 slides in from below then out upward
  const panel2Y = useTransform(
    progress,
    [0.25, 0.48, 0.62, 0.85],
    ["100vh", "0vh", "0vh", "-100vh"]
  );

  // Panel 3 slides in from below
  const panel3Y = useTransform(progress, [0.62, 0.85], ["100vh", "0vh"]);

  return (
    <section
      ref={sectionRef}
      id="story"
      style={{ height: "300vh", position: "relative" }}
    >
      {/* Sticky viewport container */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Panel 1 */}
        <motion.div style={{ position: "absolute", inset: 0, y: panel1Y }}>
          <PanelContent panel={panels[0]} showLabel />
        </motion.div>

        {/* Panel 2 */}
        <motion.div style={{ position: "absolute", inset: 0, y: panel2Y }}>
          <PanelContent panel={panels[1]} />
        </motion.div>

        {/* Panel 3 */}
        <motion.div style={{ position: "absolute", inset: 0, y: panel3Y }}>
          <PanelContent panel={panels[2]} />
        </motion.div>

        {/* Timeline — sits on top of all panels */}
        <TimelineSidebar progress={progress} />

      </div>
    </section>
  );
}
