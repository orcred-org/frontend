'use client';

import { googleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

interface SessionCalendarLinksProps {
  title: string;
  sessionDate: string;
  sessionUrl?: string;
  uid: string;
  compact?: boolean;
}

export default function SessionCalendarLinks({
  title,
  sessionDate,
  sessionUrl,
  uid,
  compact,
}: SessionCalendarLinksProps) {
  const fullSessionUrl = sessionUrl
    ? (sessionUrl.startsWith('http') ? sessionUrl : `${window.location.origin}${sessionUrl}`)
    : undefined;

  const gcal = googleCalendarUrl(title, sessionDate, {
    details: fullSessionUrl
      ? `Orcred live review session.\n\nJoin page: ${fullSessionUrl}`
      : 'Orcred live review session.',
    location: fullSessionUrl,
  });

  if (!gcal) return null;

  const btnStyle: React.CSSProperties = compact
    ? {
        padding: '5px 10px',
        fontSize: 11,
        fontWeight: 600,
        border: '1px solid rgba(15,13,12,0.15)',
        background: '#fff',
        cursor: 'pointer',
        color: '#0f0d0c',
        textDecoration: 'none',
      }
    : {
        padding: '8px 14px',
        fontSize: 12,
        fontWeight: 600,
        border: '1px solid rgba(15,13,12,0.15)',
        background: '#fff',
        cursor: 'pointer',
        color: '#0f0d0c',
        textDecoration: 'none',
      };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: compact ? 8 : 12 }}>
      <a href={gcal} target="_blank" rel="noopener noreferrer" style={btnStyle}>
        Add to Google Calendar
      </a>
      <button
        type="button"
        style={btnStyle}
        onClick={() =>
          downloadIcsFile({
            uid,
            title,
            startIso: sessionDate,
            url: fullSessionUrl,
            description: 'Orcred live technical review session.',
            filename: 'orcred-session.ics',
          })
        }
      >
        Download .ics
      </button>
    </div>
  );
}
