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

/* ─────────────────────────────────────────
   Shapes — white on solid orange card
───────────────────────────────────────── */

function ShapeProblem() {
  const total = 24; const signal = 13;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width:           i === signal ? 12 : 7,
            height:          i === signal ? 12 : 7,
            borderRadius:    "50%",
            backgroundColor: i === signal ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.22)",
            alignSelf:  "center",
            justifySelf: "center",
          }} />
        ))}
      </div>
    </div>
  );
}

function ShapeSession() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 100, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "rgba(255,255,255,0.96)" }}>45</div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: 10 }}>minutes</div>
      </div>
    </div>
  );
}

function ShapeProof() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "rgba(255,255,255,0.96)" }}>87</div>
        <div style={{ fontSize: 28, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginBottom: 15, lineHeight: 1 }}>/100</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Card + body below
───────────────────────────────────────── */

function PanelCard({
  panel,
  shape,
  index,
}: {
  panel: (typeof panels)[number];
  shape: React.ReactNode;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      {/* Card — solid colour, shape inside, title at bottom */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, delay: index * 0.1, ease }}
        style={{
          backgroundColor: "#eb4511",
          overflow:         "hidden",
          position:         "relative",
          height:           "420px",
          transform:        hovered ? "translateY(-6px)" : "translateY(0px)",
          boxShadow:        hovered
            ? "0 28px 56px rgba(235,69,17,0.28), 0 6px 16px rgba(235,69,17,0.16)"
            : "0 4px 18px rgba(235,69,17,0.16)",
          transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Shape / visual fills card */}
        {shape}

        {/* Title pinned to card bottom */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          padding: "0 24px 26px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>{panel.num}</div>
            <div style={{ width: 12, height: 1, background: "rgba(255,255,255,0.28)" }} />
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              {panel.eyebrow}
            </div>
          </div>
          <div style={{
            fontSize:      "clamp(17px, 1.7vw, 23px)",
            fontWeight:    500,
            letterSpacing: "-0.02em",
            lineHeight:    1.15,
            color:         "#ffffff",
          }}>
            {panel.headline}
          </div>
        </div>
      </motion.div>

      {/* Body text — outside the card, below */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: index * 0.1 + 0.2, ease }}
        style={{ paddingTop: "18px" }}
      >
        <div style={{
          fontSize:   "clamp(13px, 1vw, 14px)",
          fontWeight: 400,
          lineHeight: 1.8,
          color:      "rgba(15,13,12,0.55)",
        }}>
          {panel.body}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Section
───────────────────────────────────────── */

export default function PlatformSection() {
  const shapes = [
    <ShapeProblem key={0} />,
    <ShapeSession key={1} />,
    <ShapeProof   key={2} />,
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
            <PanelCard key={i} panel={panel} shape={shapes[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
