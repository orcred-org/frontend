"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <main className="relative z-10 flex-1 max-w-[760px] mx-auto w-full px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">

        {/* Page title */}
        <motion.div className="mb-14" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px" style={{ backgroundColor: "#eb4511" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#eb4511" }}>
              Company
            </span>
          </div>
          <div style={{ fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#0f0d0c" }}>
            About Us
          </div>
        </motion.div>

        <div className="w-full h-px mb-12" style={{ background: "rgba(15,13,12,0.1)" }} />

      </main>
    </div>
  );
}
