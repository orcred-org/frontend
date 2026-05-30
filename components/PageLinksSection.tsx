"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    href:  "/who-we-are",
    label: "About Us",
    title: "About Us",
    desc:  "Two founders, a clear problem, and a standard that doesn't bend. Learn what Orcred is and why we built it.",
    cta:   "Learn more",
    // placeholder bg — swap inner div for an <img> when you have a photo
    bg:    "#0f0d0c",
    watermark: "ABOUT",
  },
  {
    href:  "/contact",
    label: "Contact Us",
    title: "Contact Us",
    desc:  "Questions about verification, the process, or pricing. Reach us directly — every message is read by a founder.",
    cta:   "Get in touch",
    bg:    "#1a1512",
    watermark: "CONTACT",
  },
  {
    href:  "/contact",
    label: "Become a Reviewer",
    title: "Become a Reviewer",
    desc:  "Senior engineer with 5+ years in AI/ML? Five founding reviewer spots remain. Join us and help set the standard from day one.",
    cta:   "Apply",
    bg:    "#0f0d0c",
    watermark: "REVIEW",
  },
];

export default function PageLinksSection() {
  return (
    <section
      className="px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Divider */}
        <div className="w-full h-px mb-12 sm:mb-16" style={{ background: "var(--border)" }} />

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.href + card.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
            >
              <Link
                href={card.href}
                className="group flex flex-col h-full"
                style={{ textDecoration: "none" }}
              >
                {/* Image block — replace with <img> / next/image when ready */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    backgroundColor: card.bg,
                    height: "200px",
                  }}
                >
                  {/* Watermark */}
                  <div
                    className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                    style={{
                      fontWeight:    700,
                      fontSize:      "clamp(48px, 8vw, 80px)",
                      letterSpacing: "-0.04em",
                      color:         "rgba(255,255,255,0.06)",
                      userSelect:    "none",
                    }}
                  >
                    {card.watermark}
                  </div>
                  {/* Orange circle mark */}
                  <div
                    className="absolute bottom-4 right-4"
                    style={{
                      width:           "28px",
                      height:          "28px",
                      borderRadius:    "50%",
                      backgroundColor: "#eb4511",
                      opacity:         0.7,
                    }}
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      backgroundColor: "#eb4511",
                      opacity:         0,
                    }}
                  />
                </div>

                {/* Card body */}
                <div
                  className="flex-1 flex flex-col pt-5 pb-2"
                  style={{ borderLeft: "1px solid var(--border)", paddingLeft: "20px", marginTop: "0px" }}
                >
                  {/* Title */}
                  <div
                    style={{
                      fontWeight:    600,
                      fontSize:      "clamp(18px, 1.8vw, 22px)",
                      letterSpacing: "-0.015em",
                      lineHeight:    1.2,
                      color:         "#0f0d0c",
                      marginBottom:  "10px",
                    }}
                  >
                    {card.title}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize:   "clamp(13px, 1.1vw, 14px)",
                      fontWeight: 400,
                      lineHeight: 1.8,
                      color:      "rgba(15,13,12,0.6)",
                      marginBottom: "16px",
                      flex: 1,
                    }}
                  >
                    {card.desc}
                  </div>

                  {/* CTA link */}
                  <div
                    className="flex items-center gap-2 font-label-sm uppercase tracking-[0.18em] text-[11px] transition-colors duration-200"
                    style={{ color: "#eb4511", fontWeight: 600 }}
                  >
                    {card.cta}
                    <span style={{ letterSpacing: 0 }}>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
