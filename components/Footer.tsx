"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";

const footerLinks = [
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Terms",      href: "/terms"      },
  { label: "Privacy",    href: "/privacy"    },
  { label: "Contact",    href: "/contact"    },
];

export default function Footer() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const goHome = () => {
    router.push("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Light mode footer ── */
  if (!isDark) {
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

  /* ── Dark mode footer (original) ── */
  return (
    <footer
      className="px-6 sm:px-10 lg:px-16 py-10 sm:py-12"
      style={{
        backgroundColor: "var(--bg-page)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        <button
          type="button"
          onClick={goHome}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" fill="#eb4511"/>
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-label-sm uppercase tracking-widest text-[10px] transition-colors duration-200 hover:text-accent-orange"
              style={{ color: "var(--fg-muted)" }}
            >
              {item.label}
            </Link>
          ))}

          <span
            className="font-label-sm tracking-widest text-[9px] uppercase sm:pl-4 sm:border-l"
            style={{
              color: "var(--fg-faint)",
              borderColor: "var(--border)",
            }}
          >
            © 2026 Orcred
          </span>
        </div>

      </div>
    </footer>
  );
}
