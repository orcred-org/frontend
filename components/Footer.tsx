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
        backgroundColor: "#000000",
        borderTop: "1px solid rgba(235,225,205,0.13)",
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
            color: "rgba(235,225,205,0.72)",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <div
            className="w-[11px] h-[11px] rounded-full flex-shrink-0"
            style={{
              background: "#eb4511",
              boxShadow: "0 0 8px 2px rgba(235,69,17,0.32)",
            }}
          />
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
              style={{ color: "rgba(235,225,205,0.62)" }}
            >
              {item.label}
            </Link>
          ))}

          <span
            className="font-label-sm tracking-widest text-[9px] uppercase sm:pl-4 sm:border-l"
            style={{
              color: "rgba(235,225,205,0.38)",
              borderColor: "rgba(235,225,205,0.14)",
            }}
          >
            © 2026 Orcred
          </span>
        </div>

      </div>
    </footer>
  );
}
