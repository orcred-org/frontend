"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <motion.div
      className="relative z-10 w-full"
      style={{
        backgroundColor: "rgba(15,13,12,0.025)",
        borderBottom:    "1px solid var(--border)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 h-[38px] flex items-center gap-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <div key={i} className="flex items-center gap-0">
              {/* Separator */}
              {i > 0 && (
                <span
                  style={{
                    fontSize:      "10px",
                    color:         "#eb4511",
                    opacity:       0.55,
                    margin:        "0 8px",
                    letterSpacing: 0,
                    fontWeight:    400,
                  }}
                >
                  ›
                </span>
              )}

              {/* Item */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.01em", color: "var(--fg-faint)", transition: "color 0.2s ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--fg-faint)")}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{
                    fontSize:      "12px",
                    fontWeight:    isLast ? 500 : 400,
                    letterSpacing: "0.01em",
                    color:         isLast ? "var(--fg-muted)" : "var(--fg-faint)",
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
