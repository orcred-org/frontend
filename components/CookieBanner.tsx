'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'orcred_cookie_consent';

export type ConsentStatus = 'accepted' | 'declined' | null;

// ── GA loader ────────────────────────────────────────────────────────────────

export function loadGA(measurementId: string) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-script')) return; // already loaded

  const script1 = document.createElement('script');
  script1.id = 'ga-script';
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { anonymize_ip: true });
  `;
  document.head.appendChild(script2);
}

// ── Banner ────────────────────────────────────────────────────────────────────

export default function CookieBanner() {
  const [status, setStatus] = useState<ConsentStatus | 'loading'>('loading');
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null;
    if (stored === 'accepted' && measurementId) loadGA(measurementId);
    setStatus(stored);
  }, [measurementId]);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setStatus('accepted');
    if (measurementId) loadGA(measurementId);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setStatus('declined');
  }

  // Don't render until we've checked localStorage, and hide if already decided
  if (status !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 32px))',
        backgroundColor: '#fff',
        border: '1px solid rgba(15,13,12,0.12)',
        boxShadow: '0 8px 40px rgba(15,13,12,0.12)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
        animation: 'slideUp 0.25s ease',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <p style={{ fontSize: '13px', color: 'rgba(15,13,12,0.6)', lineHeight: 1.7, margin: 0, flexShrink: 1 }}>
        We use cookies to understand how people use Orcred and improve the experience.{' '}
        <a href="/privacy" style={{ color: '#eb4511', textDecoration: 'none', fontWeight: 500 }}>
          Privacy policy
        </a>
        .
      </p>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: '8px 16px',
            fontSize: '12px', fontWeight: 600,
            color: 'rgba(15,13,12,0.45)',
            backgroundColor: 'transparent',
            border: '1px solid rgba(15,13,12,0.12)',
            borderRadius: '50px',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '0.04em',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(15,13,12,0.3)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(15,13,12,0.7)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(15,13,12,0.12)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(15,13,12,0.45)';
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 18px',
            fontSize: '12px', fontWeight: 600,
            color: '#fff',
            backgroundColor: '#eb4511',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '0.04em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
