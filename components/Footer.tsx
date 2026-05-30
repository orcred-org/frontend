"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="px-6 sm:px-10 lg:px-16 py-10 sm:py-12"
      style={{
        backgroundColor: "var(--bg-page)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Brand */}
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-3"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "20px",
            letterSpacing: "0.1em",
            color: "var(--fg-muted)",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <circle cx="6" cy="6" r="5.5" fill="#eb4511"/>
          </svg>
          ORCRED
        </button>

        {/* Links + copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
          {[
            { label: "Terms",   href: "/terms"   },
            { label: "Privacy", href: "/privacy" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
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
