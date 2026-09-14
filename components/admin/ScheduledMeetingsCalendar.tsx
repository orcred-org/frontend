'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import SessionCalendarLinks from '@/components/shared/SessionCalendarLinks';
import './ScheduledMeetingsCalendar.css';

const BORDER = '1px solid rgba(15,13,12,0.1)';
const CAL_BG = '#fff1e8';
const CAL_BG_DEEP = '#ffe8d9';
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type CalendarSessionStatus =
  | 'done'
  | 'skipped'
  | 'today'
  | 'rescheduled_past'
  | 'upcoming';

export interface ScheduledSession {
  assignment_id: string;
  application_id: string;
  project_name: string;
  session_date: string;
  calendar_status: CalendarSessionStatus;
  is_ghost?: boolean;
  moved_to_date?: string | null;
  assignment_status?: string;
  workflow_stage?: string | null;
  daily_room_url?: string | null;
  student_code?: string | null;
  student_name?: string | null;
  student_email?: string | null;
  reviewer_name?: string | null;
  reviewer_email?: string | null;
}

type CalView = 'daily' | 'weekly' | 'monthly';

const STATUS_META: Record<
  CalendarSessionStatus,
  { label: string; color: string; bg: string; stickerBg: string; stickerBorder: string; emoji: string }
> = {
  done: {
    label: 'Completed',
    color: '#007a4a',
    bg: 'rgba(0,122,74,0.12)',
    stickerBg: '#ecfdf5',
    stickerBorder: '#6ee7b7',
    emoji: '✅',
  },
  skipped: {
    label: 'Skipped / no-show',
    color: '#ba1a1a',
    bg: 'rgba(186,26,26,0.1)',
    stickerBg: '#fef2f2',
    stickerBorder: '#fca5a5',
    emoji: '🚫',
  },
  today: {
    label: 'Today',
    color: '#005fa3',
    bg: 'rgba(0,95,163,0.1)',
    stickerBg: '#eff6ff',
    stickerBorder: '#93c5fd',
    emoji: '🎥',
  },
  rescheduled_past: {
    label: 'Rescheduled (was here)',
    color: '#9a6500',
    bg: 'rgba(154,101,0,0.12)',
    stickerBg: '#fffbeb',
    stickerBorder: '#fcd34d',
    emoji: '↩️',
  },
  upcoming: {
    label: 'Upcoming',
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.12)',
    stickerBg: '#f3f4f6',
    stickerBorder: '#d1d5db',
    emoji: '📅',
  },
};

const STICKER_SIZE = {
  sm: { box: 36, emoji: 22, radius: 10 },
  md: { box: 44, emoji: 26, radius: 12 },
} as const;

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Monday = 0 … Sunday = 6 */
function mondayIndex(d: Date) {
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

function startOfWeek(d: Date) {
  const x = startOfDay(d);
  x.setDate(x.getDate() - mondayIndex(x));
  return x;
}

function endOfWeek(d: Date) {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 6);
  x.setHours(23, 59, 59, 999);
  return x;
}

function isPastDay(d: Date) {
  return startOfDay(d).getTime() < startOfDay(new Date()).getTime();
}

function getViewRange(focus: Date, view: CalView) {
  if (view === 'daily') {
    return { from: startOfDay(focus), to: endOfDay(focus) };
  }
  if (view === 'weekly') {
    return { from: startOfWeek(focus), to: endOfWeek(focus) };
  }
  return {
    from: new Date(focus.getFullYear(), focus.getMonth(), 1),
    to: new Date(focus.getFullYear(), focus.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

function stepFocus(focus: Date, view: CalView, dir: -1 | 1) {
  const d = new Date(focus);
  if (view === 'daily') {
    d.setDate(d.getDate() + dir);
    return d;
  }
  if (view === 'weekly') {
    d.setDate(d.getDate() + dir * 7);
    return d;
  }
  d.setMonth(d.getMonth() + dir, 1);
  return d;
}

function formatPeriodLabel(focus: Date, view: CalView) {
  if (view === 'daily') {
    return focus.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (view === 'weekly') {
    const start = startOfWeek(focus);
    const end = endOfWeek(focus);
    const sameMonth = start.getMonth() === end.getMonth();
    const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: sameMonth ? undefined : 'short',
      year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined,
    });
    const year = start.getFullYear() === end.getFullYear() ? ` ${start.getFullYear()}` : '';
    return `${startStr} – ${endStr}${year}`;
  }
  return focus.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function statusLabel(status: CalendarSessionStatus): string {
  return STATUS_META[status].label;
}

function sessionSort(a: ScheduledSession, b: ScheduledSession) {
  return new Date(a.session_date).getTime() - new Date(b.session_date).getTime();
}

function SessionSticker({
  status,
  size = 'md',
  ghost = false,
}: {
  status: CalendarSessionStatus;
  size?: keyof typeof STICKER_SIZE;
  ghost?: boolean;
}) {
  const meta = STATUS_META[status];
  const dim = STICKER_SIZE[size];
  const tilts: Record<CalendarSessionStatus, string> = {
    done: '-4deg',
    skipped: '5deg',
    today: '3deg',
    rescheduled_past: '-7deg',
    upcoming: '-3deg',
  };

  return (
    <span
      className="cal-session-sticker"
      title={statusLabel(status)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim.box,
        height: dim.box,
        borderRadius: dim.radius,
        background: meta.stickerBg,
        border: ghost ? `2px dashed ${meta.stickerBorder}` : `2.5px solid ${meta.stickerBorder}`,
        boxShadow: ghost ? 'none' : '0 2px 0 rgba(15,13,12,0.07), 0 3px 8px rgba(15,13,12,0.08)',
        fontSize: dim.emoji,
        lineHeight: 1,
        flexShrink: 0,
        transform: `rotate(${ghost ? '-6deg' : tilts[status]})`,
        opacity: ghost ? 0.72 : 1,
        userSelect: 'none',
      }}
      aria-hidden
    >
      {meta.emoji}
    </span>
  );
}

/** Compact event row with emoji + project name + time — used inside calendar cells */
function CalendarEventChip({
  session,
  dense = false,
  onClick,
}: {
  session: ScheduledSession;
  dense?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const meta = STATUS_META[session.calendar_status];
  const time = new Date(session.session_date).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const inner = (
    <>
      <span style={{ fontSize: dense ? 13 : 15, lineHeight: 1, flexShrink: 0 }} aria-hidden>
        {meta.emoji}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: dense ? 10 : 11,
          fontWeight: 600,
          color: '#0f0d0c',
          letterSpacing: '-0.01em',
        }}
      >
        {session.project_name}
      </span>
      <span
        style={{
          flexShrink: 0,
          fontSize: dense ? 9 : 10,
          fontWeight: 500,
          color: 'rgba(15,13,12,0.45)',
        }}
      >
        {time}
      </span>
    </>
  );

  const boxStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: dense ? 4 : 6,
        padding: dense ? '3px 5px' : '5px 7px',
        borderRadius: 7,
        background: meta.stickerBg,
        border: session.is_ghost
          ? `1px dashed ${meta.stickerBorder}`
          : `1.5px solid ${meta.stickerBorder}`,
        opacity: session.is_ghost ? 0.78 : 1,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    cursor: onClick ? 'pointer' : undefined,
    fontFamily: 'inherit',
    textAlign: 'left' as const,
  };

  if (onClick) {
    return (
      <button
        type="button"
        title={`${session.project_name} · ${time}`}
        onClick={onClick}
        style={{
          ...boxStyle,
          display: 'flex',
          alignItems: 'center',
          gap: dense ? 4 : 6,
          padding: dense ? '3px 5px' : '5px 7px',
          borderRadius: 7,
          background: meta.stickerBg,
          border: session.is_ghost
            ? `1px dashed ${meta.stickerBorder}`
            : `1.5px solid ${meta.stickerBorder}`,
          opacity: session.is_ghost ? 0.78 : 1,
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <div title={`${session.project_name} · ${time}`} style={{ ...boxStyle, display: 'flex', alignItems: 'center', gap: dense ? 4 : 6, padding: dense ? '3px 5px' : '5px 7px', borderRadius: 7, background: meta.stickerBg, border: session.is_ghost ? `1px dashed ${meta.stickerBorder}` : `1.5px solid ${meta.stickerBorder}`, opacity: session.is_ghost ? 0.78 : 1 }}>
      {inner}
    </div>
  );
}

function ChronologicalTimelinePanel({
  sessions,
  centerDay,
  loading,
  filterStatus,
  onOpenApplication,
  onClose,
}: {
  sessions: ScheduledSession[];
  centerDay: Date;
  loading: boolean;
  filterStatus?: CalendarSessionStatus | null;
  onOpenApplication?: (applicationId: string) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const today = startOfDay(new Date());

  const filteredSessions = useMemo(() => {
    if (!filterStatus) return sessions;
    return sessions.filter((s) => s.calendar_status === filterStatus);
  }, [sessions, filterStatus]);

  const grouped = useMemo(() => {
    const byDay = new Map<string, ScheduledSession[]>();
    for (const s of filteredSessions) {
      const key = startOfDay(new Date(s.session_date)).toDateString();
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(s);
    }
    return [...byDay.entries()].sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    );
  }, [filteredSessions]);

  useEffect(() => {
    if (loading || grouped.length === 0) return;
    const target = startOfDay(centerDay).toDateString();
    const el = dayRefs.current.get(target);
    requestAnimationFrame(() => {
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }, [centerDay, grouped, loading]);

  const filterLabel = filterStatus ? STATUS_META[filterStatus].label : 'All sessions';

  if (loading) {
    return (
      <div style={{ padding: '16px 20px', flex: 1, background: CAL_BG_DEEP }}>
        <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>Loading timeline…</p>
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: CAL_BG_DEEP }}>
        <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.45)' }}>
              Session timeline
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 600, color: '#0f0d0c' }}>{filterLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: BORDER, background: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}
          >
            Close
          </button>
        </div>
        <p style={{ padding: '8px 16px', fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>No sessions for this category.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: CAL_BG_DEEP }}>
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.45)' }}>
            Session timeline
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 600, color: '#0f0d0c' }}>{filterLabel}</p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(15,13,12,0.55)' }}>
            Past ↑ · Today in centre · Future ↓
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ border: BORDER, background: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}
        >
          Close
        </button>
      </div>
      <div
        ref={scrollRef}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 12px 16px', scrollBehavior: 'smooth' }}
      >
        {grouped.map(([dayKey, daySessions]) => {
          const dayDate = new Date(dayKey);
          const isToday = sameDay(dayDate, today);
          const isPast = isPastDay(dayDate);
          return (
            <div
              key={dayKey}
              ref={(el) => { if (el) dayRefs.current.set(dayKey, el); }}
              style={{
                marginBottom: 14,
                padding: isToday ? '10px 12px' : '4px 0',
                borderRadius: isToday ? 10 : 0,
                background: isToday ? 'rgba(255,255,255,0.75)' : 'transparent',
                border: isToday ? '2px solid rgba(235,69,17,0.35)' : 'none',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isPast ? 'rgba(15,13,12,0.35)' : isToday ? '#eb4511' : 'rgba(15,13,12,0.55)',
                }}
              >
                {dayDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                {isToday ? ' · Today' : ''}
              </p>
              {[...daySessions].sort(sessionSort).map((s) => {
                const meta = STATUS_META[s.calendar_status];
                return (
                  <div
                    key={`${s.assignment_id}-${s.session_date}-${s.is_ghost ? 'g' : 'l'}`}
                    style={{
                      padding: 10,
                      marginBottom: 6,
                      borderRadius: 8,
                      background: '#fff',
                      borderLeft: `3px solid ${meta.color}`,
                      opacity: isPast ? 0.72 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <SessionSticker status={s.calendar_status} size="sm" ghost={!!s.is_ghost} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: meta.color }}>{statusLabel(s.calendar_status)}</span>
                      <span style={{ fontSize: 11, color: 'rgba(15,13,12,0.45)', marginLeft: 'auto' }}>
                        {new Date(s.session_date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600 }}>{s.project_name}</p>
                    {!s.is_ghost && (
                      <p style={{ margin: '0 0 6px', fontSize: 11, color: 'rgba(15,13,12,0.45)' }}>
                        {s.student_name} · {s.reviewer_name}
                      </p>
                    )}
                    {onOpenApplication && !s.is_ghost && (
                      <button
                        type="button"
                        onClick={() => onOpenApplication(s.application_id)}
                        style={{ padding: '4px 8px', fontSize: 10, fontWeight: 600, border: BORDER, background: '#fff', cursor: 'pointer', borderRadius: 4 }}
                      >
                        Open application →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarLegend({
  activeStatus,
  onStatusClick,
}: {
  activeStatus: CalendarSessionStatus | null;
  onStatusClick: (status: CalendarSessionStatus) => void;
}) {
  const items: CalendarSessionStatus[] = ['done', 'skipped', 'today', 'rescheduled_past', 'upcoming'];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 10px',
        padding: '12px 20px',
        borderBottom: BORDER,
        background: CAL_BG,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(15,13,12,0.4)', alignSelf: 'center', marginRight: 4 }}>
        Timeline:
      </span>
      {items.map((status) => {
        const active = activeStatus === status;
        const meta = STATUS_META[status];
        return (
          <button
            key={status}
            type="button"
            onClick={() => onStatusClick(status)}
            title={`Show ${meta.label} sessions in timeline`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              border: active ? `2px solid ${meta.color}` : BORDER,
              background: active ? '#fff' : 'rgba(255,255,255,0.65)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: active ? `0 2px 8px ${meta.color}22` : 'none',
            }}
          >
            <SessionSticker status={status} size="sm" />
            <span style={{ fontSize: 12, color: active ? '#0f0d0c' : 'rgba(15,13,12,0.6)', fontWeight: active ? 600 : 500 }}>
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: CalView;
  onChange: (v: CalView) => void;
}) {
  const views: { id: CalView; label: string }[] = [
    { id: 'daily', label: 'Day' },
    { id: 'weekly', label: 'Week' },
    { id: 'monthly', label: 'Month' },
  ];

  return (
    <div style={{ display: 'flex', gap: 2, background: 'rgba(15,13,12,0.05)', padding: 3, borderRadius: 8 }}>
      {views.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onChange(v.id)}
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: view === v.id ? 600 : 400,
            color: view === v.id ? '#fff' : 'rgba(15,13,12,0.55)',
            background: view === v.id ? '#eb4511' : 'transparent',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

function DayDetailPanel({
  selectedDay,
  sessions,
  loading,
  onOpenApplication,
}: {
  selectedDay: Date | null;
  sessions: ScheduledSession[];
  loading: boolean;
  onOpenApplication?: (applicationId: string) => void;
}) {
  if (loading) {
    return (
      <div style={{ padding: '16px 20px', flex: 1, background: CAL_BG_DEEP }}>
        <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.4)', margin: 0 }}>Loading sessions…</p>
      </div>
    );
  }

  if (!selectedDay) {
    return (
      <div style={{ padding: '16px 20px', flex: 1, background: CAL_BG_DEEP }}>
        <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>
          Click a legend symbol for the session timeline · click a day for details.
        </p>
      </div>
    );
  }

  const dayLabel = selectedDay.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (sessions.length === 0) {
    return (
      <div style={{ padding: '16px 20px', flex: 1, background: CAL_BG_DEEP }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(15,13,12,0.4)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {dayLabel}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(15,13,12,0.45)', margin: 0 }}>No sessions on this day.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: CAL_BG_DEEP }}>
      <p style={{ padding: '16px 16px 0', fontSize: 11, fontWeight: 600, color: 'rgba(15,13,12,0.4)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
        {dayLabel} · {sessions.length} session{sessions.length === 1 ? '' : 's'}
      </p>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...sessions].sort(sessionSort).map((s) => {
          const meta = STATUS_META[s.calendar_status];
          return (
            <div
              key={`${s.assignment_id}-${s.session_date}-${s.is_ghost ? 'g' : 'l'}`}
              style={{
                padding: 14,
                border: BORDER,
                borderRadius: 10,
                background: '#fff',
                borderLeft: `4px solid ${meta.color}`,
                boxShadow: '0 1px 4px rgba(15,13,12,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <SessionSticker status={s.calendar_status} size="md" ghost={!!s.is_ghost} />
                <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>
                  {statusLabel(s.calendar_status)}
                </span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                {s.project_name}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.55)', margin: '0 0 2px' }}>
                {new Date(s.session_date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                {s.student_code && <> · {s.student_code}</>}
              </p>
              {s.is_ghost && s.moved_to_date && (
                <p style={{ fontSize: 11, color: '#9a6500', margin: '0 0 6px', fontWeight: 500 }}>
                  Moved to{' '}
                  {new Date(s.moved_to_date).toLocaleString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              )}
              {!s.is_ghost && (
                <p style={{ fontSize: 11, color: 'rgba(15,13,12,0.45)', margin: '0 0 8px' }}>
                  Student: {s.student_name} · Reviewer: {s.reviewer_name}
                </p>
              )}
              {!s.is_ghost && (s.calendar_status === 'today' || s.calendar_status === 'upcoming') && (
                <SessionCalendarLinks
                  title={`Orcred review: ${s.project_name}`}
                  sessionDate={s.session_date}
                  sessionUrl={`/dashboard/session/${s.assignment_id}?as=admin`}
                  uid={`orcred-admin-${s.assignment_id}@orcred.com`}
                  compact
                />
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {!s.is_ghost && (s.calendar_status === 'today' || s.calendar_status === 'upcoming') && (
                  <Link
                    href={`/dashboard/session/${s.assignment_id}?as=admin`}
                    style={{
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      background: '#1a1a2e',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: 4,
                    }}
                  >
                    Observe live →
                  </Link>
                )}
                {onOpenApplication && !s.is_ghost && (
                  <button
                    type="button"
                    onClick={() => onOpenApplication(s.application_id)}
                    style={{
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      background: '#fff',
                      border: BORDER,
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                  >
                    Open application →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayCellButton({
  date,
  daySessions,
  isSelected,
  isToday,
  isPast,
  onSelect,
  maxEvents,
  minHeight,
  dense,
}: {
  date: Date;
  daySessions: ScheduledSession[];
  isSelected: boolean;
  isToday: boolean;
  isPast: boolean;
  onSelect: () => void;
  maxEvents: number;
  minHeight: number;
  dense?: boolean;
}) {
  const hasTodaySession = daySessions.some((s) => s.calendar_status === 'today');
  const sorted = [...daySessions].sort(sessionSort);

  const dayLabel = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      role="group"
      aria-label={dayLabel}
      className="cal-day-btn"
      onClick={onSelect}
      style={{
        minHeight,
        padding: dense ? '6px 5px 5px' : '8px 6px 6px',
        border: isSelected
          ? '2px solid #eb4511'
          : isToday
            ? '2px solid rgba(0,95,163,0.45)'
            : isPast
              ? '1px solid rgba(15,13,12,0.06)'
              : BORDER,
        borderRadius: 8,
        background: isPast
          ? 'rgba(15,13,12,0.12)'
          : hasTodaySession
            ? 'rgba(0,95,163,0.12)'
            : isToday
              ? 'rgba(0,95,163,0.08)'
              : 'rgba(255,255,255,0.72)',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'box-shadow 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        opacity: isPast ? 0.82 : 1,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          minWidth: 22,
          height: 22,
          padding: '0 4px',
          fontSize: dense ? 11 : 12,
          fontWeight: isToday ? 700 : 600,
          color: isPast ? 'rgba(15,13,12,0.32)' : isToday ? '#005fa3' : '#0f0d0c',
          borderRadius: 6,
          background: isToday ? 'rgba(0,95,163,0.12)' : 'transparent',
        }}
      >
        {date.getDate()}
      </span>
      {sorted.length > 0 && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, width: '100%' }}>
          {sorted.slice(0, maxEvents).map((s) => (
            <CalendarEventChip
              key={`${s.assignment_id}-${s.session_date}-${s.is_ghost ? 'ghost' : 'live'}`}
              session={s}
              dense={dense}
            />
          ))}
          {sorted.length > maxEvents && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#eb4511',
                padding: '2px 4px',
                textAlign: 'center',
              }}
            >
              +{sorted.length - maxEvents} more
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export default function ScheduledMeetingsCalendar({
  onOpenApplication,
}: {
  onOpenApplication?: (applicationId: string) => void;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMode, setViewMode] = useState<CalView>('monthly');
  const [focusDate, setFocusDate] = useState(() => new Date(today));
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<Date | null>(() => new Date(today));
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<CalendarSessionStatus | null>(null);
  const [timelineCenter, setTimelineCenter] = useState<Date>(() => new Date(today));
  const [timelineSessions, setTimelineSessions] = useState<ScheduledSession[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const range = useMemo(() => getViewRange(focusDate, viewMode), [focusDate, viewMode]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.scheduledSessions({
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      }) as { data?: ScheduledSession[] };
      setSessions(res?.data ?? []);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load calendar');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    load();
  }, [load]);

  const loadTimelineSessions = useCallback(async () => {
    setTimelineLoading(true);
    try {
      const from = new Date();
      from.setMonth(from.getMonth() - 4);
      const to = new Date();
      to.setMonth(to.getMonth() + 4);
      const res = await api.admin.scheduledSessions({
        from: from.toISOString(),
        to: to.toISOString(),
      }) as { data?: ScheduledSession[] };
      setTimelineSessions(res?.data ?? []);
    } catch {
      setTimelineSessions([]);
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timelineOpen) void loadTimelineSessions();
  }, [timelineOpen, loadTimelineSessions]);

  useEffect(() => {
    if (viewMode === 'daily') {
      setSelectedDay(startOfDay(focusDate));
    }
  }, [viewMode, focusDate]);

  const openTimelineForStatus = (status: CalendarSessionStatus) => {
    setTimelineFilter(status);
    setTimelineCenter(startOfDay(new Date()));
    setTimelineOpen(true);
  };

  const selectDay = (date: Date) => {
    setTimelineOpen(false);
    setTimelineFilter(null);
    setSelectedDay(startOfDay(date));
  };

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, ScheduledSession[]>();
    for (const s of sessions) {
      const key = new Date(s.session_date).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [sessions]);

  const selectedSessions = selectedDay
    ? sessionsByDay.get(selectedDay.toDateString()) ?? []
    : [];

  const periodLabel = formatPeriodLabel(focusDate, viewMode);

  const handleViewChange = (v: CalView) => {
    setViewMode(v);
    if (v === 'daily') {
      setFocusDate(startOfDay(selectedDay ?? today));
      setSelectedDay(startOfDay(selectedDay ?? today));
    }
  };

  const goToday = () => {
    const now = startOfDay(new Date());
    setFocusDate(now);
    setSelectedDay(now);
  };

  const weekDays = useMemo(() => {
    const start = startOfWeek(focusDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [focusDate]);

  const monthCells = useMemo(() => {
    const firstDow = mondayIndex(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1));
    const totalDays = daysInMonth(focusDate);
    return [
      ...Array.from({ length: firstDow }, () => null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ] as (number | null)[];
  }, [focusDate]);

  return (
    <div className="cal-root" style={{ background: CAL_BG, border: BORDER, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: BORDER,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          background: CAL_BG,
        }}
      >
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 4px' }}>
            Review sessions
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Day · week · month views</p>
        </div>
        <ViewToggle view={viewMode} onChange={handleViewChange} />
      </div>

      {/* Navigation */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: BORDER,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          background: CAL_BG,
        }}
      >
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setFocusDate((f) => stepFocus(f, viewMode, -1))}
            style={{ padding: '6px 12px', border: BORDER, background: '#fff', cursor: 'pointer', fontSize: 12, borderRadius: 6 }}
          >
            ←
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 160, textAlign: 'center' }}>{periodLabel}</span>
          <button
            type="button"
            onClick={() => setFocusDate((f) => stepFocus(f, viewMode, 1))}
            style={{ padding: '6px 12px', border: BORDER, background: '#fff', cursor: 'pointer', fontSize: 12, borderRadius: 6 }}
          >
            →
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: '#005fa3',
            background: 'rgba(0,95,163,0.08)',
            border: '1px solid rgba(0,95,163,0.2)',
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Today
        </button>
      </div>

      <CalendarLegend
        activeStatus={timelineOpen ? timelineFilter : null}
        onStatusClick={openTimelineForStatus}
      />

      {error && (
        <p style={{ padding: '12px 20px', margin: 0, fontSize: 12, color: '#ba1a1a' }}>{error}</p>
      )}

      <div className="cal-body-row">
        <div className="cal-grid-col">
        {viewMode === 'daily' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(sessionsByDay.get(startOfDay(focusDate).toDateString()) ?? [])
              .sort(sessionSort)
              .map((s) => (
                <CalendarEventChip
                  key={`${s.assignment_id}-${s.session_date}`}
                  session={s}
                />
              ))}
            {!loading && (sessionsByDay.get(startOfDay(focusDate).toDateString()) ?? []).length === 0 && (
              <p style={{ fontSize: 13, color: 'rgba(15,13,12,0.4)', margin: 0, textAlign: 'center', padding: 24 }}>
                No sessions scheduled for this day.
              </p>
            )}
          </div>
        )}

        {viewMode === 'weekly' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {weekDays.map((d) => (
                <div
                  key={d.toISOString()}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'rgba(15,13,12,0.35)',
                    textAlign: 'center',
                    padding: '4px 0',
                  }}
                >
                  {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {weekDays.map((date) => {
                const daySessions = sessionsByDay.get(date.toDateString()) ?? [];
                return (
                  <DayCellButton
                    key={date.toISOString()}
                    date={date}
                    daySessions={daySessions}
                    isSelected={!!selectedDay && sameDay(selectedDay, date)}
                    isToday={sameDay(date, new Date())}
                    isPast={isPastDay(date)}
                    onSelect={() => selectDay(date)}
                    maxEvents={4}
                    minHeight={130}
                    dense
                  />
                );
              })}
            </div>
          </>
        )}

        {viewMode === 'monthly' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {WEEKDAY_LABELS.map((d) => (
                <div
                  key={d}
                  style={{ fontSize: 10, fontWeight: 600, color: 'rgba(15,13,12,0.35)', textAlign: 'center', padding: '4px 0' }}
                >
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {monthCells.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} />;
                const date = new Date(focusDate.getFullYear(), focusDate.getMonth(), day);
                const daySessions = sessionsByDay.get(date.toDateString()) ?? [];
                return (
                  <DayCellButton
                    key={day}
                    date={date}
                    daySessions={daySessions}
                    isSelected={!!selectedDay && sameDay(selectedDay, date)}
                    isToday={sameDay(date, new Date())}
                    isPast={isPastDay(date)}
                    onSelect={() => selectDay(date)}
                    maxEvents={2}
                    minHeight={108}
                    dense
                  />
                );
              })}
            </div>
          </>
        )}

        {!loading && !selectedDay && sessions.length > 0 && (
          <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.4)', margin: '12px 0 0', textAlign: 'center' }}>
            {sessions.length} session{sessions.length === 1 ? '' : 's'} in this period
          </p>
        )}
        </div>

        <aside className="cal-side-col" aria-label="Session details">
          {timelineOpen ? (
            <ChronologicalTimelinePanel
              sessions={timelineSessions}
              centerDay={timelineCenter}
              loading={timelineLoading}
              filterStatus={timelineFilter}
              onOpenApplication={onOpenApplication}
              onClose={() => { setTimelineOpen(false); setTimelineFilter(null); }}
            />
          ) : (
            <DayDetailPanel
              selectedDay={selectedDay}
              sessions={selectedSessions}
              loading={loading}
              onOpenApplication={onOpenApplication}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
