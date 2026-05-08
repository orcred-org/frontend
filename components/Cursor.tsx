"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.3 });
  const y = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.3 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleLeave = () => setHidden(true);
    const handleEnter = () => setHidden(false);

    const magneticEls = document.querySelectorAll("button, a, [data-magnetic]");

    const handleMagneticEnter = (e: Event) => {
      setHovered(true);
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const onMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - centerX;
        const dy = ev.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;
        if (dist < maxDist) {
          const pull = (1 - dist / maxDist) * 0.35;
          mouseX.set(ev.clientX - dx * pull);
          mouseY.set(ev.clientY - dy * pull);
        } else {
          mouseX.set(ev.clientX);
          mouseY.set(ev.clientY);
        }
      };

      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", () => {
        el.removeEventListener("mousemove", onMouseMove);
      }, { once: true });
    };

    const handleMagneticLeave = () => setHovered(false);

    magneticEls.forEach((el) => {
      el.addEventListener("mouseenter", handleMagneticEnter);
      el.addEventListener("mouseleave", handleMagneticLeave);
    });

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      magneticEls.forEach((el) => {
        el.removeEventListener("mouseenter", handleMagneticEnter);
        el.removeEventListener("mouseleave", handleMagneticLeave);
      });
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "#eb4511",
          boxShadow: "0 0 12px 4px rgba(235,69,17,0.4)",
        }}
        animate={{
          width: hovered ? 18 : 12,
          height: hovered ? 18 : 12,
          opacity: hidden ? 0 : 1,
          boxShadow: hovered
            ? "0 0 20px 8px rgba(235,69,17,0.5)"
            : "0 0 12px 4px rgba(235,69,17,0.35)",
        }}
        transition={{
          width: { duration: 0.25, ease: "easeOut" },
          height: { duration: 0.25, ease: "easeOut" },
          opacity: { duration: 0.2 },
          boxShadow: { duration: 0.25 },
        }}
      />
    </>
  );
}