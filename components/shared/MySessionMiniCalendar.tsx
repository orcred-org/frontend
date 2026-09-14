'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SessionCalendarLinks from '@/components/shared/SessionCalendarLinks';
import { getScheduledEndMs, getSessionJoinState } from '@/lib/sessionAccess';

const BORDER = '1px solid rgba(15,13,12,0.1)';

export type MiniCalendarSession = {
  id: string;
  sessionDate: string;
  title: string;
  sessionUrl?: string;
  calendarUid: string;
  /** Shown under title in detail panel */
  subtitle?: string;
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

function SessionCountdown({ sessionDate }: { sessionDate: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const startMs = new Date(sessionDate).getTime();
  const endMs = getScheduledEndMs(sessionDate);
  const now = Date.now();
  const untilStart = startMs - now;
  const untilEnd = endMs - now;

  void tick;

  if (Number.isNaN(startMs)) return null;

  if (now >= endMs) {
    return (
      <p style={{ margin: 0, fontSize: 12, color: 'rgba(15,13,12,0.45)' }}>
        This session has ended.
      </p>
    );
  }

  if (now >= startMs) {
    const left = formatCountdown(untilEnd);
    return (
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(0,122,74,0.1)',
          border: '1.5px solid rgba(0,122,74,0.25)',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#007a4a' }}>
          Live now
        </p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#007a4a', fontVariantNumeric: 'tabular-nums' }}>
          {left ?? '0m 0s'}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(15,13,12,0.45)' }}>remaining in session window</p>
      </div>
    );
  }

  const left = formatCountdown(untilStart);
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 10,
        background: 'rgba(235,69,17,0.08)',
        border: '1.5px solid rgba(235,69,17,0.22)',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#eb4511' }}>
        Starts in
      </p>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#eb4511', fontVariantNumeric: 'tabular-nums' }}>
        {left ?? '—'}
      </p>
    </div>
  );
}

export default function MySessionMiniCalendar({
  sessions,
  emptyMessage = 'No session scheduled yet.',
}: {
  sessions: MiniCalendarSession[];
  emptyMessage?: string;
}) {
  const nextUpcoming = useMemo(() => {
    const now = Date.now();
    const upcoming = sessions
      .filter((s) => new Date(s.sessionDate).getTime() > now - 60_000)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
    return upcoming[0] ?? sessions[0] ?? null;
  }, [sessions]);

  const initialFocus = nextUpcoming
    ? startOfDay(new Date(nextUpcoming.sessionDate))
    : startOfDay(new Date());

  const [focusMonth, setFocusMonth] = useState(() => new Date(initialFocus.getFullYear(), initialFocus.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(() =>
    nextUpcoming ? startOfDay(new Date(nextUpcoming.sessionDate)) : null,
  );

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, MiniCalendarSession[]>();
    for (const s of sessions) {
      const key = new Date(s.sessionDate).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [sessions]);

  const selectedSessions = selectedDay
    ? sessionsByDay.get(selectedDay.toDateString()) ?? []
    : [];

  const monthLabel = focusMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const firstDow = new Date(focusMonth.getFullYear(), focusMonth.getMonth(), 1).getDay();
  const totalDays = new Date(focusMonth.getFullYear(), focusMonth.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const goToday = useCallback(() => {
    const now = startOfDay(new Date());
    setFocusMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    const todaySessions = sessionsByDay.get(now.toDateString());
    if (todaySessions?.length) setSelectedDay(now);
  }, [sessionsByDay]);

  if (sessions.length === 0) {
    return (
      <div className="dash-surface" style={{ padding: '18px 20px', borderRadius: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 8px' }}>
          Your session
        </p>
        <p style={{ fontSize: 13, color: 'rgba(15,13,12,0.45)', margin: 0, lineHeight: 1.5 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mini-cal dash-surface" style={{ borderRadius: 12, overflow: 'hidden' }}>
      <style>{`
        .mini-cal .mini-cal-day--pop {
          transform: scale(1.12);
          z-index: 2;
          position: relative;
          box-shadow: 0 6px 16px rgba(235, 69, 17, 0.28);
        }
        .mini-cal .mini-cal-day-btn:hover.mini-cal-day--pop {
          transform: scale(1.16);
        }
        .mini-cal .mini-cal-day-btn:hover {
          box-shadow: 0 2px 8px rgba(15,13,12,0.08);
        }
      `}</style>

      <div style={{ padding: '14px 16px 10px', borderBottom: BORDER, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 2px' }}>
            Your session
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{monthLabel}</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            onClick={() => setFocusMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            style={{ padding: '4px 8px', border: BORDER, background: '#fff', cursor: 'pointer', fontSize: 11, borderRadius: 6 }}
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goToday}
            style={{ padding: '4px 8px', border: BORDER, background: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, borderRadius: 6, color: '#005fa3' }}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setFocusMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            style={{ padding: '4px 8px', border: BORDER, background: '#fff', cursor: 'pointer', fontSize: 11, borderRadius: 6 }}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Detail panel — above grid */}
      <div style={{ padding: '12px 16px', borderBottom: BORDER, background: 'rgba(250,247,242,0.6)', minHeight: 52 }}>
        {!selectedDay ? (
          <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>
            Tap your session date below for countdown &amp; calendar links.
          </p>
        ) : selectedSessions.length === 0 ? (
          <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>
            No session on {selectedDay.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.
          </p>
        ) : (
          selectedSessions.map((s) => {
            const join = getSessionJoinState(s.sessionDate);
            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 600, color: 'rgba(15,13,12,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {new Date(s.sessionDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {' · '}
                    {new Date(s.sessionDate).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f0d0c', letterSpacing: '-0.01em' }}>
                    {s.title.replace(/^Orcred review:\s*/i, '')}
                  </p>
                  {s.subtitle && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(15,13,12,0.45)' }}>{s.subtitle}</p>
                  )}
                </div>
                <SessionCountdown sessionDate={s.sessionDate} />
                <SessionCalendarLinks
                  title={s.title}
                  sessionDate={s.sessionDate}
                  sessionUrl={s.sessionUrl}
                  uid={s.calendarUid}
                  compact
                />
                {s.sessionUrl && join.canJoin && (
                  <Link
                    href={s.sessionUrl}
                    style={{
                      display: 'inline-block',
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#eb4511',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: 8,
                      textAlign: 'center',
                    }}
                  >
                    Join session →
                  </Link>
                )}
                {s.sessionUrl && !join.canJoin && (
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(15,13,12,0.45)', lineHeight: 1.45 }}>
                    {join.message}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Mini month grid */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 3 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: 9, fontWeight: 600, color: 'rgba(15,13,12,0.3)', textAlign: 'center' }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const date = new Date(focusMonth.getFullYear(), focusMonth.getMonth(), day);
            const daySessions = sessionsByDay.get(date.toDateString()) ?? [];
            const hasSession = daySessions.length > 0;
            const isSelected = selectedDay && sameDay(selectedDay, date);
            const isToday = sameDay(date, new Date());

            return (
              <button
                key={day}
                type="button"
                className={`mini-cal-day-btn${hasSession ? ' mini-cal-day--pop' : ''}`}
                onClick={() => setSelectedDay(startOfDay(date))}
                style={{
                  aspectRatio: '1',
                  minHeight: 36,
                  padding: 2,
                  border: isSelected
                    ? '2px solid #eb4511'
                    : hasSession
                      ? '2px solid rgba(235,69,17,0.45)'
                      : isToday
                        ? '1.5px solid rgba(0,95,163,0.4)'
                        : BORDER,
                  borderRadius: 8,
                  background: hasSession
                    ? 'linear-gradient(145deg, rgba(235,69,17,0.14) 0%, #fff 70%)'
                    : isToday
                      ? 'rgba(0,95,163,0.06)'
                      : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: hasSession || isToday ? 700 : 500,
                    color: hasSession ? '#eb4511' : isToday ? '#005fa3' : '#0f0d0c',
                    lineHeight: 1,
                  }}
                >
                  {day}
                </span>
                {hasSession && (
                  <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
                    🎥
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
