const SESSION_DURATION_MIN = 40;

function formatGoogleDate(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

export function googleCalendarUrl(
  title: string,
  startIso: string,
  opts?: { durationMin?: number; details?: string; location?: string },
): string | null {
  if (!startIso) return null;
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;
  const durationMin = opts?.durationMin ?? SESSION_DURATION_MIN;
  const end = new Date(start.getTime() + durationMin * 60_000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
  });
  if (opts?.details) params.set('details', opts.details);
  if (opts?.location) params.set('location', opts.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(opts: {
  uid: string;
  title: string;
  startIso: string;
  durationMin?: number;
  description?: string;
  url?: string;
  filename?: string;
}): void {
  const start = new Date(opts.startIso);
  const durationMin = opts.durationMin ?? SESSION_DURATION_MIN;
  const end = new Date(start.getTime() + durationMin * 60_000);
  const stamp = formatGoogleDate(new Date());
  const desc = [opts.description, opts.url ? `Join: ${opts.url}` : null].filter(Boolean).join('\\n');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Orcred//Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatGoogleDate(start)}`,
    `DTEND:${formatGoogleDate(end)}`,
    `SUMMARY:${opts.title.replace(/[,;\\]/g, '')}`,
    desc ? `DESCRIPTION:${desc.replace(/\n/g, '\\n')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = opts.filename ?? 'orcred-session.ics';
  a.click();
  URL.revokeObjectURL(href);
}
