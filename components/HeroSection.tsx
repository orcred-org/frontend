"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 25, damping: 30, mass: 2 };

  const mouseX = useSpring(rawX, springConfig);
  const mouseY = useSpring(rawY, springConfig);

  // Background — very subtle drift
  const bgX = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], [-5, 5]);

  // Subtitle — barely moves
  const subtitleX = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);
  const subtitleY = useTransform(mouseY, [-0.5, 0.5], [-2, 2]);
  const subtitleRotateX = useTransform(mouseY, [-0.5, 0.5], [1.5, -1.5]);
  const subtitleRotateY = useTransform(mouseX, [-0.5, 0.5], [-1.5, 1.5]);

  // Title — smallest movement, gentlest tilt
  const titleX = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);
  const titleY = useTransform(mouseY, [-0.5, 0.5], [-1.5, 1.5]);
  const titleRotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const titleRotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);

  // Badge — barely perceptible
  const badgeRotateX = useTransform(mouseY, [-0.5, 0.5], [1, -1]);
  const badgeRotateY = useTransform(mouseX, [-0.5, 0.5], [-1, 1]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rawX.set(nx);
      rawY.set(ny);
    };

    const handleMouseLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rawX, rawY]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
  };

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="min-h-[100vh] flex flex-col justify-center items-center relative px-6 sm:px-10 lg:px-margin-edge overflow-hidden"
      style={{ backgroundColor: "#0d0200" }}
    >
      {/* Background stripe layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          x: bgX,
          y: bgY,
          opacity: 0.72,
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 50% 15%, rgba(235,69,17,0.55) 0%, transparent 65%),repeating-linear-gradient(90deg,#050100 0px,#050100 2px,#7a1a04 2px,#b02e0c 14px,#eb4511 32px,#d04010 52px,#6b1605 64px,#050100 70px)",
          scale: 1.06,
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, rgba(5,1,0,0.75) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div
          variants={fadeIn}
          style={{
            rotateX: badgeRotateX,
            rotateY: badgeRotateY,
            transformPerspective: 1200,
          }}
        >
          <div className="inline-block border border-accent-orange/50 text-accent-orange px-4 sm:px-6 py-1.5 rounded-full font-label-sm mb-8 sm:mb-12 tracking-[0.2em] uppercase text-[10px] sm:text-[11px]">
            Now in Early Access
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          variants={fadeIn}
          style={{
            x: titleX,
            y: titleY,
            rotateX: titleRotateX,
            rotateY: titleRotateY,
            transformPerspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          <h1 className="font-display-2xl text-white text-3d-lg-enhanced text-center uppercase mb-6 sm:mb-8 leading-[0.85] text-[80px] sm:text-[120px] md:text-[160px] lg:text-display-2xl">
            Prove
            <br />
            it.
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          variants={fadeIn}
          style={{
            x: subtitleX,
            y: subtitleY,
            rotateX: subtitleRotateX,
            rotateY: subtitleRotateY,
            transformPerspective: 1200,
          }}
        >
          <p className="font-body-lg text-white/65 max-w-xl sm:max-w-2xl lg:max-w-3xl text-center mb-10 sm:mb-16 leading-relaxed text-base sm:text-lg lg:text-body-lg px-4">
            Get your AI/ML project reviewed by a senior engineer.
            <br className="hidden sm:block" />
            Walk away with a credential that actually means something.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center w-full sm:w-auto px-4"
        >
          <motion.button
            className="w-full sm:w-auto bg-black/90 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-label-sm uppercase tracking-widest text-[11px] sm:text-[12px] hover:bg-accent-orange transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Join the waitlist
          </motion.button>
          <motion.a
            className="font-label-sm text-white/80 hover:text-accent-orange transition-colors uppercase tracking-widest border-b border-transparent hover:border-accent-orange text-[11px] sm:text-[12px]"
            href="#"
            whileHover={{ x: 4 }}
          >
            Apply as a reviewer →
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}