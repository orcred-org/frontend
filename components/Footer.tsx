"use client";

import Link from "next/link";

const footerLinks = [
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Terms",      href: "/terms"      },
  { label: "Privacy",    href: "/privacy"    },
  { label: "Contact",    href: "/contact"    },
];

export default function Footer() {
  return (
    <footer
      className="px-6 sm:px-10 lg:px-16 py-6"
      style={{
        backgroundColor: "var(--bg-page)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Copyright */}
        <span
          className="font-label-sm tracking-widest text-[9px] uppercase"
          style={{ color: "var(--fg-faint)" }}
        >
          © 2026 Orcred. All rights reserved.
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-label-sm uppercase tracking-widest text-[9px] transition-colors duration-200"
              style={{ color: "var(--fg-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}
