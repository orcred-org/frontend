"use client";

/**
 * GlowCard — wraps any box in a 1px border whose colour follows the cursor.
 *
 * Technique:
 *  • Outer div has a solid dim background (the "base border colour").
 *  • A glow overlay (absolutely positioned) carries a radial-gradient that
 *    moves with the mouse. Its opacity transitions 0 → 1 on enter / 1 → 0 on leave.
 *  • The inner div has the page background, sitting 1px inset — that 1px gap
 *    IS the visible border, showing whichever layer is on top.
 *
 * No re-renders: everything is driven by direct DOM style writes so there is
 * zero React state churn on mousemove.
 */

import { useRef, useCallback } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  /** Radius of the glow hotspot in px (default 320) */
  radius?: number;
  /** Inner background colour (default page bg #010204) */
  bg?: string;
}

export default function GlowCard({
  children,
  className = "",
  radius = 320,
  bg = "#010204",
}: GlowCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const wrap = wrapRef.current;
      const glow = glowRef.current;
      if (!wrap || !glow) return;
      const { left, top } = wrap.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      glow.style.background = `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgba(235,69,17,0.82) 0%, rgba(235,69,17,0.22) 35%, transparent 65%)`;
      glow.style.opacity = "1";
    },
    [radius]
  );

  const onMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative ${className}`}
      style={{
        padding: "1px",
        background: "rgba(235,225,205,0.10)", // dim base border
      }}
    >
      {/* Glow overlay — radial gradient follows cursor */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Content — sits over the 1px border gap */}
      <div className="relative" style={{ background: bg }}>
        {children}
      </div>
    </div>
  );
}
