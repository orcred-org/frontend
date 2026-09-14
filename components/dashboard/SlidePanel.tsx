'use client';

import { useState, type ReactNode } from 'react';

const BORDER = '1px solid var(--dash-line, rgba(16,17,20,0.09))';

export default function SlidePanel({
  eyebrow,
  title,
  children,
  loading,
  onClose,
  defaultFullscreen = false,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  loading?: boolean;
  onClose: () => void;
  defaultFullscreen?: boolean;
}) {
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);

  return (
    <>
      <div
        className="dash-panel-backdrop"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`dash-panel${fullscreen ? ' dash-panel--fullscreen' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="dash-panel-header">
          <div className="dash-panel-header-text">
            {eyebrow && <p className="dash-eyebrow">{eyebrow}</p>}
            <h2 className="dash-panel-title">{title}</h2>
          </div>
          <div className="dash-panel-actions">
            <button
              type="button"
              className="dash-icon-btn"
              title={fullscreen ? 'Exit full screen' : 'Full screen'}
              aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
              onClick={() => setFullscreen((v) => !v)}
            >
              {fullscreen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 2h4v4M6 14H2v-4M14 10v4h-4M2 6V2h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="dash-icon-btn"
              title="Close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>
        <div className="dash-panel-body" style={{ borderTop: BORDER }}>
          {loading ? (
            <p className="dash-muted" style={{ padding: '40px 24px', margin: 0 }}>Loading…</p>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
}
