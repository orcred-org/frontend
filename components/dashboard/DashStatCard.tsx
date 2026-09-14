'use client';

import { useState } from 'react';

export default function DashStatCard({
  icon,
  label,
  value,
  sub,
  accent = '#eb4511',
  onClick,
  badge,
  badgeHint,
  urgent,
}: {
  icon: string;
  label: string;
  value: number | string;
  sub: string;
  accent?: string;
  onClick?: () => void;
  /** Unread-style count — highlights card when &gt; 0 */
  badge?: number;
  badgeHint?: string;
  urgent?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const interactive = !!onClick;
  const hasBadge = badge != null && badge > 0;
  const badgeText = badge != null && badge > 99 ? '99+' : String(badge ?? '');

  return (
    <button
      type="button"
      className={`dash-stat-card${hasBadge ? ' dash-stat-card--inbox' : ''}${urgent && hasBadge ? ' dash-stat-card--urgent' : ''}`}
      onClick={onClick}
      disabled={!interactive}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={hasBadge ? `${label}, ${badge} to handle` : label}
      style={{
        borderColor: hasBadge
          ? accent
          : hov && interactive
            ? accent
            : undefined,
        boxShadow: hasBadge
          ? `0 0 0 1px ${accent}33, 0 4px 16px ${accent}20`
          : hov && interactive
            ? `0 4px 20px ${accent}18`
            : undefined,
        background: hasBadge ? `linear-gradient(145deg, ${accent}0c 0%, #fff 55%)` : undefined,
        cursor: interactive ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {hasBadge && (
        <span
          className="dash-stat-badge"
          title={badgeHint ?? `${badge} need attention`}
          style={{ backgroundColor: urgent ? '#ba1a1a' : accent }}
        >
          {badgeText}
        </span>
      )}

      <div className="dash-stat-card-top">
        <span className="dash-stat-icon" aria-hidden>{icon}</span>
        {interactive && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="dash-stat-arrow" aria-hidden>
            <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <p className="dash-stat-label">{label}</p>
      <p className="dash-stat-value">{value}</p>
      <p className="dash-stat-sub">{hasBadge ? (badgeHint ?? sub) : sub}</p>
    </button>
  );
}
