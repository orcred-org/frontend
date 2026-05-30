"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    href:  "/who-we-are",
    title: "About Us",
    desc:  "Two founders, a clear problem, and a standard that doesn't bend. Learn what Orcred is and why we built it.",
    cta:   "Learn more",
    // Two engineers collaborating at a laptop — Unsplash (free to use)
    img:   "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=420&fit=crop&auto=format&q=80",
    alt:   "Two people collaborating at a laptop",
  },
  {
    href:  "/contact",
    title: "Contact Us",
    desc:  "Questions about verification, the process, or pricing. Reach us directly — every message is read by a founder.",
    cta:   "Get in touch",
    // Clean minimal desk/workspace — Unsplash
    img:   "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=420&fit=crop&auto=format&q=80",
    alt:   "Minimal office workspace",
  },
  {
    href:  "/contact",
    title: "Become a Reviewer",
    desc:  "Senior engineer with 5+ years in AI/ML? Five founding reviewer spots remain. Join us and help set the standard.",
    cta:   "Apply",
    // Code review / engineer at screen — Unsplash
    img:   "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=420&fit=crop&auto=format&q=80",
    alt:   "Engineer reviewing code on screen",
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
              key={card.title}
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
                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "160px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Dark overlay — lightens on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                    style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
                  />
                </div>

                {/* Card body */}
                <div
                  className="flex-1 flex flex-col pt-4 pb-2"
                  style={{
                    borderLeft:  "1px solid var(--border)",
                    paddingLeft: "16px",
                  }}
                >
                  {/* Title */}
                  <div
                    style={{
                      fontWeight:    600,
                      fontSize:      "clamp(14px, 1.2vw, 16px)",
                      letterSpacing: "-0.01em",
                      lineHeight:    1.2,
                      color:         "#0f0d0c",
                      marginBottom:  "6px",
                    }}
                  >
                    {card.title}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize:     "12px",
                      fontWeight:   400,
                      lineHeight:   1.7,
                      color:        "rgba(15,13,12,0.55)",
                      marginBottom: "12px",
                      flex:         1,
                    }}
                  >
                    {card.desc}
                  </div>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-1.5 font-label-sm uppercase tracking-[0.15em] text-[10px]"
                    style={{ color: "#eb4511", fontWeight: 500 }}
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
