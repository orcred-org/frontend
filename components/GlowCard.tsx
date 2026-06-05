"use client";

/**
 * GlowCard — thick glowing border that follows the cursor.
 *
 * Layers (back → front):
 *  1. Outer wrapper  — 2px padding, dim cream base (the "off" border colour)
 *  2. Haze layer     — same gradient, blurred 6px → soft light bleeding inward
 *  3. Sharp layer    — same gradient, no blur    → crisp bright edge on the border
 *  4. Inner content  — solid page bg, covers everything except the 2px gap
 *
 * No re-renders — all updates go direct to DOM via style writes.
 */

import { useRef, useCallback } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  /** Hotspot radius in px — larger = reacts from further away (default 520) */
  radius?: number;
  /** Inner background (default #010204) */
  bg?: string;
}

export default function GlowCard({
  children,
  className = "",
  radius = 520,
  bg = "var(--bg-page)",
}: GlowCardProps) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const sharpRef = useRef<HTMLDivElement>(null);
  const hazeRef  = useRef<HTMLDivElement>(null);

  const buildGradient = useCallback(
    (x: number, y: number) =>
      [
        `radial-gradient(circle ${radius}px at ${x}px ${y}px,`,
        `  rgba(255,95,30,1.0)   0%,`,   // hot white-orange core
        `  rgba(235,69,17,0.92)  6%,`,   // full brand orange
        `  var(--orange-faint) 18%,`,   // mid spread
        `  rgba(235,69,17,0.22) 42%,`,   // tail
        `  transparent           68%`,
        `)`,
      ].join(" "),
    [radius]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const wrap  = wrapRef.current;
      const sharp = sharpRef.current;
      const haze  = hazeRef.current;
      if (!wrap || !sharp || !haze) return;
      const { left, top } = wrap.getBoundingClientRect();
      const g = buildGradient(e.clientX - left, e.clientY - top);
      sharp.style.background = g;
      haze.style.background  = g;
      sharp.style.opacity = "1";
      haze.style.opacity  = "1";
    },
    [buildGradient]
  );

  const onMouseLeave = useCallback(() => {
    if (sharpRef.current) sharpRef.current.style.opacity = "0";
    if (hazeRef.current)  hazeRef.current.style.opacity  = "0";
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative ${className}`}
      style={{
        padding: "1.5px",                        // 1.5px border
        background: "var(--border)",   // dim base
      }}
    >
      {/* Haze — blurred copy of gradient, gives the "light bleeding inward" glow */}
      <div
        ref={hazeRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0, transition: "opacity 0.12s ease", filter: "blur(6px)" }}
      />

      {/* Sharp — crisp gradient, colours the 2px border precisely */}
      <div
        ref={sharpRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0, transition: "opacity 0.12s ease" }}
      />

      {/* Content */}
      <div className="relative" style={{ background: bg }}>
        {children}
      </div>
    </div>
  );
}
