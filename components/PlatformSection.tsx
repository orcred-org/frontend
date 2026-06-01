"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

/* Each panel is 1/3 of the viewport height */
function Panel({ panel }: { panel: (typeof panels)[number] }) {
  return (
    <div style={{
      width:           "100%",
      height:          "100%",
      backgroundColor: "var(--bg-page)",
      borderTop:       "1px solid rgba(15,13,12,0.1)",
      display:         "flex",
      alignItems:      "center",
      padding:         "0 clamp(24px, 5vw, 64px)",
    }}>
      <div style={{ maxWidth: 640, display: "flex", alignItems: "baseline", gap: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#eb4511", flexShrink: 0 }}>
          {panel.num}
        </div>
        <div>
          <div style={{
            fontSize:      "clamp(16px, 1.8vw, 24px)",
            fontWeight:    400,
            letterSpacing: "-0.02em",
            lineHeight:    1.2,
            color:         "#0f0d0c",
            marginBottom:  10,
          }}>
            {panel.headline}
          </div>
          <div style={{
            fontSize:   "clamp(12px, 1vw, 14px)",
            fontWeight: 400,
            lineHeight: 1.8,
            color:      "rgba(15,13,12,0.52)",
          }}>
            {panel.body}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Timeline sidebar — spans full 100vh */
function TimelineSidebar({ progress }: { progress: ReturnType<typeof useTransform> }) {
  const totalPx = typeof window !== "undefined" ? window.innerHeight * 0.76 : 608;
  const fillH   = useTransform(progress, [0, 1], [0, totalPx]);
  const tipY    = useTransform(progress, [0, 1], [0, totalPx]);

  return (
    <div
      className="hidden lg:flex"
      style={{
        position:   "absolute",
        right:      "clamp(48px, 7vw, 120px)",
        top:        0,
        height:     "100%",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", height: totalPx, width: 20 }}>
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0,
          width: 3, backgroundColor: "rgba(15,13,12,0.08)",
          transform: "translateX(-50%)", borderRadius: 3,
        }} />
        <motion.div style={{
          position: "absolute", left: "50%", top: 0,
          width: 3, height: fillH,
          backgroundColor: "#eb4511",
          transform: "translateX(-50%)", borderRadius: 3,
        }} />
        <motion.div style={{
          position: "absolute", left: "50%", top: tipY,
          width: 4, height: 4, borderRadius: "50%",
          backgroundColor: "#eb4511",
          x: "-50%", y: "-50%",
          boxShadow: "0 0 6px 3px rgba(235,69,17,0.35)",
        }} />
      </div>
    </div>
  );
}

export default function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Use raw scroll progress — no spring lag, bar always in sync
  const progress = scrollYProgress;

  const panel2Y = useTransform(progress, [0.15, 0.48], ["66.67vh", "0vh"]);
  const panel3Y = useTransform(progress, [0.52, 0.85], ["33.33vh", "0vh"]);

  return (
    <section
      ref={sectionRef}
      id="story"
      style={{ height: "300vh", position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Panel 1 — top third, always visible */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "33.33vh" }}>
          <Panel panel={panels[0]} />
        </div>

        {/* Panel 2 — slides into middle third */}
        <motion.div style={{
          position: "absolute", top: "33.33vh", left: 0, right: 0, height: "33.33vh",
          y: panel2Y,
        }}>
          <Panel panel={panels[1]} />
        </motion.div>

        {/* Panel 3 — slides into bottom third */}
        <motion.div style={{
          position: "absolute", top: "66.67vh", left: 0, right: 0, height: "33.33vh",
          y: panel3Y,
        }}>
          <Panel panel={panels[2]} />
        </motion.div>

        {/* Timeline */}
        <TimelineSidebar progress={progress} />

      </div>
    </section>
  );
}
