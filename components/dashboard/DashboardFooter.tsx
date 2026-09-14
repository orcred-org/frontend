'use client';

import Link from 'next/link';

const LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

export default function DashboardFooter() {
  return (
    <footer className="dash-footer">
      <div className="dash-footer-inner">
        <div className="dash-mark" style={{ pointerEvents: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 42 42" fill="none" aria-hidden>
            <circle cx="21" cy="21" r="20" fill="#eb4511" />
          </svg>
          <span className="dash-mark-text" style={{ fontSize: 15 }}>Orcred</span>
        </div>
        <nav className="dash-footer-nav" aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="dash-footer-link">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="dash-footer-copy">© {new Date().getFullYear()} Orcred</p>
      </div>
    </footer>
  );
}
