"use client";

const items = [
  "VERIFIED",
  "EARNED",
  "ONE SESSION",
  "45 MINUTES",
  "REAL SIGNAL",
  "SENIOR ENGINEER",
  "THE STANDARD",
  "NOT A QUIZ",
  "YOUR WORK",
  "A CONVERSATION",
  "87 POINTS",
  "PASSES OR FAILS",
];

export default function MarqueeTicker() {
  return (
    <div
      className="overflow-hidden py-[11px] relative"
      style={{
        backgroundColor: "var(--bg-page)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left + Right fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to right, #010204, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to left, #010204, transparent)",
        }}
      />

      {/* Marquee row */}
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 mx-5 font-label-sm uppercase tracking-[0.45em] text-[9px]"
          >
            <span style={{ color: "var(--border-strong)" }}>{item}</span>
            <span style={{ color: "rgba(235,69,17,0.32)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
