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

interface NavbarProps {
  onApply: () => void;
}

export default function Navbar({ onApply }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.72)"]
  );
  const blur = useTransform(scrollY, [0, 80], [0, 24]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.08]);

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
          <Link
            href="#hero-section"
            className="font-headline-md text-2xl sm:text-3xl tracking-tighter text-primary flex items-center gap-1.5 hover:text-accent-orange transition-colors"
          >
            Pruv<span className="asymmetric-dot mb-3" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.label}
                className="font-label-sm text-black/60 hover:text-black transition-colors tracking-widest text-[12px]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <motion.button
            className="hidden md:block bg-black/90 text-white px-5 py-1.5 rounded-full font-label-sm tracking-widest uppercase text-[12px] hover:bg-accent-orange transition-colors"
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
              className="block w-6 h-0.5 bg-black origin-center"
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-black origin-center"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-black origin-center"
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