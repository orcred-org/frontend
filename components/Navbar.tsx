"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

const links = [
  { label: "PLATFORM", href: "#platform" },
  { label: "PROCESS", href: "#process" },
  { label: "SCORES", href: "#scores" },
  { label: "REVIEWERS", href: "#reviewers" },
];

const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

interface NavbarProps {
  onApply: () => void;
}

export default function Navbar({ onApply }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const background = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0.55)", "rgba(255,255,255,0.72)"]
  );
  const blur = useTransform(scrollY, [0, 100], [0, 24]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.08]);

  const textColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,1)", "rgba(0,0,0,1)"]
  );
  const linkColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0.7)", "rgba(0,0,0,0.6)"]
  );
  const buttonBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0.2)", "rgba(0,0,0,0.9)"]
  );
  const buttonText = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,1)", "rgba(255,255,255,1)"]
  );
  const buttonBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0.5)", "rgba(0,0,0,0)"]
  );

  return (
    <>
      <motion.header
        className="sticky top-0 z-50"
        style={{ background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: useTransform(blur, (v) => `blur(${v}px) saturate(180%)`),
            WebkitBackdropFilter: useTransform(blur, (v) => `blur(${v}px) saturate(180%)`),
            borderBottom: "1px solid rgba(0,0,0,0)",
            borderColor: useTransform(borderOpacity, (v) => `rgba(0,0,0,${v})`),
          }}
        />

        <nav className="relative flex justify-between items-center h-[72px] px-6 sm:px-10 lg:px-margin-edge w-full max-w-container-max mx-auto">
          <Link href="#hero-section" className="flex items-center gap-1.5">
            <motion.span
              className="font-headline-md text-2xl sm:text-3xl tracking-tighter"
              style={{ color: textColor }}
            >
              Pruv
            </motion.span>
            <span className="asymmetric-dot mb-3" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link key={link.label} href={link.href}>
                <motion.span
                  className="relative font-label-sm tracking-widest text-[12px] uppercase inline-block"
                  style={{ color: linkColor }}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-[-3px] left-0 w-full h-[1px] bg-current"
                    style={{ originX: 0 }}
                    variants={underlineVariants}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          <motion.button
            className="hidden md:block px-5 py-1.5 rounded-full font-label-sm tracking-widest uppercase text-[12px] border"
            style={{
              backgroundColor: buttonBg,
              color: buttonText,
              borderColor: buttonBorder,
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onApply}
          >
            Apply as Reviewer
          </motion.button>

          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-0.5 origin-center"
              style={{ background: textColor }}
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-0.5 origin-center"
              style={{ background: textColor }}
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 origin-center"
              style={{ background: textColor }}
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col justify-center items-center gap-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  className="font-headline-md text-4xl tracking-tighter text-black/70 hover:text-accent-orange transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.button
              className="mt-6 bg-black/90 text-white px-10 py-4 rounded-full font-label-sm tracking-widest uppercase text-[12px] hover:bg-accent-orange transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.28 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setMenuOpen(false);
                onApply();
              }}
            >
              Apply as Reviewer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}