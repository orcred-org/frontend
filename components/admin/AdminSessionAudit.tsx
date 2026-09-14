'use client';

function fmt(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function fmtOffset(minutes: number | null | undefined): string {
  if (minutes == null) return '—';
  if (minutes <= 0) return 'On time';
  return `${minutes} min late`;
}

export interface SessionAuditData {
  session_date?: string | null;
  reviewer_joined_at?: string | null;
  student_joined_at?: string | null;
  session_completed_at?: string | null;
  student_session_confirmed_at?: string | null;
  reviewer_early_end_reason?: string | null;
  student_early_end_reason?: string | null;
  reviewer_noshow_admin_notified_at?: string | null;
  student_noshow_admin_notified_at?: string | null;
  reviewer_nudge_count?: number | null;
  student_nudge_count?: number | null;
  last_reviewer_nudge_at?: string | null;
  last_student_nudge_at?: string | null;
  accepted_at?: string | null;
}

interface TimelineEvent {
  at: string;
  label: string;
  detail: string;
  tone?: 'warn' | 'info';
}

interface AdminSessionAuditProps {
  assignment: SessionAuditData | null;
  scoreSubmittedAt?: string | null;
  codeDeletionAcknowledgedAt?: string | null;
  scheduledDurationMin?: number;
}

export default function AdminSessionAudit({
  assignment,
  scoreSubmittedAt,
  codeDeletionAcknowledgedAt,
  scheduledDurationMin = 40,
}: AdminSessionAuditProps) {
  if (!assignment?.session_date) return null;

  const scheduledStart = new Date(assignment.session_date);
  const scheduledEnd = new Date(scheduledStart.getTime() + scheduledDurationMin * 60 * 1000);

  let actualMinutes: number | null = null;
  if (assignment.session_completed_at) {
    const endMs = new Date(assignment.session_completed_at).getTime();
    const bothMs =
      assignment.reviewer_joined_at && assignment.student_joined_at
        ? Math.max(
            new Date(assignment.reviewer_joined_at).getTime(),
            new Date(assignment.student_joined_at).getTime(),
          )
        : scheduledStart.getTime();
    actualMinutes = Math.max(0, Math.round((endMs - bothMs) / 60_000));
  }

  const reviewerLate =
    assignment.reviewer_joined_at && assignment.session_date
      ? Math.round(
          (new Date(assignment.reviewer_joined_at).getTime() - scheduledStart.getTime()) / 60_000,
        )
      : null;
  const studentLate =
    assignment.student_joined_at && assignment.session_date
      ? Math.round(
          (new Date(assignment.student_joined_at).getTime() - scheduledStart.getTime()) / 60_000,
        )
      : null;

  const endedEarly =
    assignment.session_completed_at
    && new Date(assignment.session_completed_at).getTime() < scheduledEnd.getTime() - 5 * 60 * 1000;

  const events: TimelineEvent[] = [];

  if (assignment.accepted_at) {
    events.push({ at: assignment.accepted_at, label: 'Schedule approved', detail: fmt(assignment.accepted_at) });
  }
  events.push({
    at: assignment.session_date,
    label: 'Scheduled start',
    detail: fmt(assignment.session_date),
  });
  events.push({
    at: scheduledEnd.toISOString(),
    label: 'Scheduled end (hard stop)',
    detail: fmt(scheduledEnd.toISOString()),
  });

  if (assignment.last_student_nudge_at) {
    events.push({
      at: assignment.last_student_nudge_at,
      label: 'Student nudged reviewer',
      detail: `${fmt(assignment.last_student_nudge_at)} (${assignment.student_nudge_count ?? 0} total)`,
      tone: 'info',
    });
  }
  if (assignment.last_reviewer_nudge_at) {
    events.push({
      at: assignment.last_reviewer_nudge_at,
      label: 'Reviewer nudged student',
      detail: `${fmt(assignment.last_reviewer_nudge_at)} (${assignment.reviewer_nudge_count ?? 0} total)`,
      tone: 'info',
    });
  }
  if (assignment.student_noshow_admin_notified_at) {
    events.push({
      at: assignment.student_noshow_admin_notified_at,
      label: 'No-show alert — student',
      detail: fmt(assignment.student_noshow_admin_notified_at),
      tone: 'warn',
    });
  }
  if (assignment.reviewer_noshow_admin_notified_at) {
    events.push({
      at: assignment.reviewer_noshow_admin_notified_at,
      label: 'No-show alert — reviewer',
      detail: fmt(assignment.reviewer_noshow_admin_notified_at),
      tone: 'warn',
    });
  }

  if (assignment.student_joined_at) {
    events.push({
      at: assignment.student_joined_at,
      label: 'Student joined',
      detail: `${fmt(assignment.student_joined_at)} (${fmtOffset(studentLate)})`,
    });
  } else if (assignment.session_completed_at || assignment.reviewer_joined_at) {
    events.push({
      at: assignment.session_date,
      label: 'Student joined',
      detail: 'Did not join',
      tone: 'warn',
    });
  }

  if (assignment.reviewer_joined_at) {
    events.push({
      at: assignment.reviewer_joined_at,
      label: 'Reviewer joined',
      detail: `${fmt(assignment.reviewer_joined_at)} (${fmtOffset(reviewerLate)})`,
    });
  } else if (assignment.session_completed_at || assignment.student_joined_at) {
    events.push({
      at: assignment.session_date,
      label: 'Reviewer joined',
      detail: 'Did not join',
      tone: 'warn',
    });
  }

  if (assignment.session_completed_at) {
    events.push({
      at: assignment.session_completed_at,
      label: 'Session ended (reviewer)',
      detail: fmt(assignment.session_completed_at),
    });
  }
  if (assignment.student_session_confirmed_at) {
    events.push({
      at: assignment.student_session_confirmed_at,
      label: 'Student confirmed session',
      detail: fmt(assignment.student_session_confirmed_at),
    });
  }
  if (scoreSubmittedAt) {
    events.push({ at: scoreSubmittedAt, label: 'Score submitted', detail: fmt(scoreSubmittedAt) });
  }
  if (codeDeletionAcknowledgedAt) {
    events.push({
      at: codeDeletionAcknowledgedAt,
      label: 'Code deletion confirmed',
      detail: fmt(codeDeletionAcknowledgedAt),
    });
  }

  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <div style={{ marginBottom: 16, padding: 14, border: '1px solid rgba(15,13,12,0.1)', background: 'rgba(0,95,163,0.03)' }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#005fa3', margin: '0 0 12px' }}>
        Session timeline
      </p>
      {endedEarly && (
        <p style={{ fontSize: 12, color: '#9a6500', margin: '0 0 10px', fontWeight: 600 }}>
          Ended before the {scheduledDurationMin}-minute window
        </p>
      )}
      {actualMinutes != null && (
        <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.55)', margin: '0 0 12px' }}>
          Overlap duration: <strong>{actualMinutes} min</strong>
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.map((ev, i) => (
          <div
            key={`${ev.label}-${ev.at}-${i}`}
            style={{
              display: 'flex',
              gap: 12,
              padding: '8px 0',
              borderBottom: i < events.length - 1 ? '1px solid rgba(15,13,12,0.06)' : 'none',
            }}
          >
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              marginTop: 5,
              flexShrink: 0,
              background: ev.tone === 'warn' ? '#9a6500' : ev.tone === 'info' ? '#005fa3' : 'rgba(15,13,12,0.25)',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                color: ev.tone === 'warn' ? '#9a6500' : '#0f0d0c',
              }}>
                {ev.label}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(15,13,12,0.6)' }}>{ev.detail}</p>
            </div>
          </div>
        ))}
      </div>
      {assignment.reviewer_early_end_reason && (
        <div style={{ marginTop: 12, padding: 10, background: '#fff', border: '1px solid rgba(15,13,12,0.08)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>Reviewer — why session ended early</p>
          <p style={{ fontSize: 12, margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{assignment.reviewer_early_end_reason}</p>
        </div>
      )}
      {assignment.student_early_end_reason && (
        <div style={{ marginTop: 10, padding: 10, background: '#fff', border: '1px solid rgba(15,13,12,0.08)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, margin: '0 0 4px' }}>Student — why session ended early</p>
          <p style={{ fontSize: 12, margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{assignment.student_early_end_reason}</p>
        </div>
      )}
    </div>
  );
}
