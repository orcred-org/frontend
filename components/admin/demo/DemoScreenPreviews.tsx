'use client';

import { useState, type ReactNode } from 'react';
import Credential from '@/components/orx/Credential';
import Badge from '@/components/orx/Badge';
import AdminSessionReport from '@/components/admin/AdminSessionReport';
import { SCORE_CRITERIA } from '@/lib/scoring';
import { SESSION_DURATION_MINUTES } from '@/lib/sessionAccess';
import {
  buildDemoSessionAudit,
  buildDemoSessionScore,
  DEMO_SESSION_REPORT,
} from '@/lib/demoSessionReportSample';

const FONT = 'Inter, system-ui, sans-serif';
const BORDER = '1px solid rgba(15,13,12,0.1)';
const DEMO_PROJECT = '[Demo] Campus Queue RAG Assistant';
const DEMO_STACK = 'Python · FastAPI · PostgreSQL · LangChain';
const DEMO_SCORE = 76;

const DEMO_DIMENSIONS = SCORE_CRITERIA.map((c) => ({
  label: c.label,
  score: c.key === 'technical_depth' ? 80 : c.key === 'communication' ? 75 : c.key === 'reproducibility' ? 70 : 78,
}));

export type DemoPreviewId =
  | 'session-live'
  | 'session-complete'
  | 'reviewer-flow'
  | 'reviewer-dashboard'
  | 'reviewer-score'
  | 'admin-workflow'
  | 'admin-session-report'
  | 'credential-verify';

export default function DemoScreenPreview({
  id,
  variant,
}: {
  id: DemoPreviewId;
  variant?: string;
}) {
  switch (id) {
    case 'session-live':
      return <SessionLivePreview />;
    case 'session-complete':
      return <SessionCompletePreview />;
    case 'reviewer-flow':
      return <ReviewerFlowPreview />;
    case 'reviewer-dashboard':
      return <ReviewerDashboardPreview />;
    case 'reviewer-score':
      return <ReviewerScorePreview />;
    case 'admin-workflow':
      return <AdminWorkflowPreview variant={variant} />;
    case 'admin-session-report':
      return <AdminSessionReportPreview />;
    case 'credential-verify':
      return <CredentialVerifyPreview />;
    default:
      return null;
  }
}

function DailyVideoMock({
  participants,
  height = 280,
}: {
  participants: { name: string; color?: string }[];
  height?: number;
}) {
  const cols = participants.length > 1 ? 2 : 1;
  return (
    <div style={{ background: '#121212', borderRadius: 8, height, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, height: 'calc(100% - 44px)', gap: 2, padding: 2 }}>
        {participants.map((p) => (
          <div key={p.name} style={{ background: '#1e1e2e', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: p.color ?? '#eb4511',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 18, fontWeight: 700,
            }}>
              {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <span style={{
              position: 'absolute', bottom: 8, left: 8, fontSize: 10, fontWeight: 600,
              color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '2px 8px', borderRadius: 4,
            }}>
              {p.name}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
        background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {['🎤', '📷', '🖥', '⋯', '📞'].map((icon, i) => (
          <div key={icon} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: i === 4 ? '#e53935' : 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>
            {icon}
          </div>
        ))}
        <span style={{ position: 'absolute', right: 12, fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Daily.co</span>
      </div>
    </div>
  );
}

function SessionTimerMock({ remaining = '28:14', bothJoined = true }: { remaining?: string; bothJoined?: boolean }) {
  return (
    <div style={{ marginBottom: 12, padding: '12px 16px', background: '#fff', border: BORDER, borderRadius: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#eb4511' }}>
            Session timer · {SESSION_DURATION_MINUTES} min max
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#0f0d0c' }}>
            {remaining}
          </p>
        </div>
        {bothJoined && (
          <p style={{ margin: 0, fontSize: 11, color: '#007a4a', fontWeight: 600 }}>Both participants joined</p>
        )}
      </div>
    </div>
  );
}

function SessionLivePreview() {
  const [tab, setTab] = useState<'reviewer' | 'student' | 'admin'>('reviewer');

  const tabs = [
    { id: 'reviewer' as const, label: 'Reviewer view' },
    { id: 'student' as const, label: 'Student view' },
    { id: 'admin' as const, label: 'Admin observer' },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: '6px 12px', fontSize: 11, fontWeight: 600, borderRadius: 4, cursor: 'pointer',
              border: tab === t.id ? '1px solid #eb4511' : BORDER,
              background: tab === t.id ? 'rgba(235,69,17,0.08)' : '#fff',
              color: tab === t.id ? '#eb4511' : 'rgba(15,13,12,0.55)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'admin' && (
        <div style={{ background: '#1a1a2e', color: '#fff', padding: '8px 12px', fontSize: 11, textAlign: 'center', marginBottom: 12, borderRadius: 4 }}>
          Admin observer mode — muted, camera off. Reviewer and student are not notified.
        </div>
      )}

      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: BORDER, marginBottom: 12, borderRadius: '6px 6px 0 0' }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#eb4511' }}>Orcred live review</p>
        <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>{DEMO_PROJECT}</p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(15,13,12,0.5)' }}>Saturday, 10:00 AM IST</p>
      </div>

      <SessionTimerMock />

      {tab === 'reviewer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(200px, 0.8fr)', gap: 12, alignItems: 'start' }}>
          <div>
            <DailyVideoMock participants={[
              { name: 'Demo Reviewer', color: '#005fa3' },
              { name: 'Demo Student', color: '#eb4511' },
            ]} />
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '5px 10px', background: '#fff', border: BORDER, fontWeight: 600 }}>Session notes</span>
              <span style={{ fontSize: 11, padding: '5px 10px', background: 'rgba(235,69,17,0.1)', border: '1px solid rgba(235,69,17,0.3)', color: '#eb4511', fontWeight: 600 }}>AI copilot</span>
              <span style={{ fontSize: 11, padding: '5px 10px', background: '#fff', border: BORDER, fontWeight: 600 }}>End session</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SidebarPanel title="Submission">
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>{DEMO_PROJECT}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(15,13,12,0.5)' }}>{DEMO_STACK}</p>
              <p style={{ margin: '8px 0 0', fontSize: 11, color: '#eb4511' }}>GitHub · Loom ↗</p>
            </SidebarPanel>
            <SidebarPanel title="AI copilot">
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(15,13,12,0.55)', lineHeight: 1.5 }}>
                Suggested probe: &ldquo;Walk me through why you chose pgvector over a dedicated vector DB.&rdquo;
              </p>
            </SidebarPanel>
          </div>
        </div>
      )}

      {tab === 'student' && (
        <div style={{ maxWidth: 520 }}>
          <DailyVideoMock participants={[
            { name: 'Demo Reviewer', color: '#005fa3' },
            { name: 'Demo Student', color: '#eb4511' },
          ]} />
          <div style={{ marginTop: 12, padding: 14, background: '#fff', border: BORDER }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600 }}>Your project summary</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(15,13,12,0.6)', lineHeight: 1.55 }}>{DEMO_STACK}</p>
          </div>
        </div>
      )}

      {tab === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 320px)', gap: 12 }}>
          <DailyVideoMock participants={[
            { name: 'Demo Reviewer', color: '#005fa3' },
            { name: 'Demo Student', color: '#eb4511' },
          ]} height={260} />
          <SidebarPanel title="Submission (read-only)">
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>{DEMO_PROJECT}</p>
            <p style={{ margin: '8px 0 0', fontSize: 11, lineHeight: 1.5, color: 'rgba(15,13,12,0.55)' }}>
              Admin observes the live Daily room without joining the conversation. Session audit timeline records join times after the session.
            </p>
          </SidebarPanel>
        </div>
      )}
    </div>
  );
}

function SessionCompletePreview() {
  return (
    <div style={{ fontFamily: FONT, maxWidth: 560 }}>
      <SessionTimerMock remaining="00:00" bothJoined={false} />
      <div style={{ padding: 20, background: '#fff', border: BORDER, marginBottom: 12 }}>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#007a4a' }}>Session complete</p>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(15,13,12,0.6)', lineHeight: 1.6 }}>
          Reviewer ended the session after 25 minutes. Student confirms wrap-up and optional session feedback.
        </p>
      </div>
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 14, background: '#fff', border: BORDER }}>
        <span style={{ width: 18, height: 18, background: '#007a4a', borderRadius: 3, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>
        <span style={{ fontSize: 13, lineHeight: 1.5 }}>I confirm this session is complete and I have deleted local copies of the student&apos;s code from my machine.</span>
      </label>
    </div>
  );
}

function ReviewerDashboardPreview() {
  return (
    <div style={{ fontFamily: FONT }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 12px' }}>Your assigned students</p>
      <div style={{ background: '#fff', border: BORDER, padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(15,13,12,0.4)' }}>DEMO-001</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: 'rgba(0,122,74,0.12)', color: '#007a4a', borderRadius: 4 }}>Scheduled</span>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 4px' }}>{DEMO_PROJECT}</h3>
        <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.5)', margin: '0 0 12px' }}>{DEMO_STACK}</p>
        <button type="button" style={{ padding: '10px 20px', background: '#eb4511', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'default' }}>
          Open submission →
        </button>
      </div>
    </div>
  );
}

function ReviewerFlowPreview() {
  const steps = ['Accept candidate', 'Review application', 'Propose session', 'Join live session', 'Submit score'];
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <span key={s} style={{
            fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 4,
            background: i <= 2 ? 'rgba(235,69,17,0.12)' : 'rgba(15,13,12,0.06)',
            color: i <= 2 ? '#eb4511' : 'rgba(15,13,12,0.45)',
            border: i === 2 ? '1px solid rgba(235,69,17,0.35)' : '1px solid transparent',
          }}>
            {i + 1}. {s}
          </span>
        ))}
      </div>
      <div style={{ background: '#fff', border: BORDER, padding: 20 }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#005fa3' }}>Step 3 · Propose session time</p>
        <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600 }}>Pick from student availability</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Saturday 10:00 AM IST', 'Saturday 2:00 PM IST', 'Weekday 7:00 PM IST'].map((slot, i) => (
            <div key={slot} style={{
              padding: '10px 14px', border: i === 0 ? '2px solid #eb4511' : BORDER,
              background: i === 0 ? 'rgba(235,69,17,0.04)' : '#fff', fontSize: 13, fontWeight: i === 0 ? 600 : 400,
            }}>
              {slot}
            </div>
          ))}
        </div>
        <button type="button" style={{ marginTop: 16, width: '100%', padding: 12, background: '#eb4511', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'default' }}>
          Send proposal to admin
        </button>
      </div>
    </div>
  );
}

function ReviewerScorePreview() {
  return (
    <div style={{ fontFamily: FONT, maxWidth: 480 }}>
      <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>Submit score · {DEMO_PROJECT}</p>
      {DEMO_DIMENSIONS.map((d) => (
        <div key={d.label} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{d.score}</span>
          </div>
          <div style={{ height: 6, background: 'rgba(15,13,12,0.08)', borderRadius: 3 }}>
            <div style={{ width: `${d.score}%`, height: '100%', background: '#eb4511', borderRadius: 3 }} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 12px', color: '#007a4a' }}>{DEMO_SCORE} / 100 — Pass</p>
      <div style={{ padding: 12, background: '#fff', border: BORDER, fontSize: 12, lineHeight: 1.55, marginBottom: 12 }}>
        Strong hybrid search rationale; clear eval methodology; would like more load-test evidence.
      </div>
      <label style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'flex-start' }}>
        <span style={{ width: 18, height: 18, background: '#007a4a', borderRadius: 3, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</span>
        I have deleted all local copies of the student&apos;s code
      </label>
    </div>
  );
}

function AdminSessionReportPreview() {
  const assignment = buildDemoSessionAudit();
  const score = buildDemoSessionScore();
  return (
    <div style={{ fontFamily: FONT, maxWidth: 640 }}>
      <div style={{ marginBottom: 14, padding: '12px 14px', border: BORDER, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#eb4511', color: '#fff',
          }}>
            5
          </span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Live session wrap-up</span>
        </div>
        <p style={{ margin: '0 0 12px', paddingLeft: 32, fontSize: 12, color: '#007a4a', fontWeight: 600 }}>
          Student marked complete — {new Date(assignment.student_session_confirmed_at!).toLocaleString('en-IN')}
        </p>
        <div style={{ paddingLeft: 32 }}>
          <AdminSessionReport
            assignment={assignment}
            score={score}
            scoreSubmittedAt={score.submitted_at}
            recordingUrl={DEMO_SESSION_REPORT.recordingUrl}
            transcriptSummary={DEMO_SESSION_REPORT.transcriptSummary}
            transcript={DEMO_SESSION_REPORT.transcript}
            transcriptGeneratedAt={DEMO_SESSION_REPORT.transcriptGeneratedAt}
            studentFeedback={{
              audio: 4,
              video: 5,
              notes: 'Demo walkthrough: reviewer was thorough on eval methodology and chunking tradeoffs.',
            }}
          />
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: 'rgba(15,13,12,0.45)', lineHeight: 1.5 }}>
        Same component as the real admin application view — sample transcript seeded on the demo application when the walkthrough reaches this step.
      </p>
    </div>
  );
}

function AdminWorkflowPreview({ variant }: { variant?: string }) {
  const activeStep = variant === 'schedule' ? 4 : variant === 'credential' ? 6 : 3;
  const steps = ['Payment', 'Assign reviewer', 'Reviewer progress', 'Approve session', 'Session wrap-up', 'Score review'];
  return (
    <div style={{ fontFamily: FONT }}>
      {steps.map((title, i) => {
        const num = i + 1;
        const done = num < activeStep;
        const active = num === activeStep;
        return (
          <div key={title} style={{
            marginBottom: 10, padding: '12px 14px', border: active ? '1px solid rgba(235,69,17,0.35)' : BORDER,
            background: done ? 'rgba(0,122,74,0.04)' : active ? '#fff' : 'rgba(15,13,12,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#007a4a' : active ? '#eb4511' : 'rgba(15,13,12,0.1)',
                color: done || active ? '#fff' : 'rgba(15,13,12,0.4)',
              }}>
                {done ? '✓' : num}
              </span>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{title}</span>
            </div>
            {active && variant === 'schedule' && (
              <div style={{ marginTop: 12, paddingLeft: 32 }}>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(15,13,12,0.6)' }}>Proposed: Saturday 10:00 AM IST</p>
                <button type="button" style={{ padding: '8px 16px', background: '#007a4a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'default' }}>
                  Approve & email both parties
                </button>
              </div>
            )}
            {active && variant === 'credential' && (
              <div style={{ marginTop: 12, paddingLeft: 32 }}>
                <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#007a4a' }}>76 / 100 — Pass</p>
                <button type="button" style={{ padding: '8px 16px', background: '#007a4a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'default', marginRight: 8 }}>
                  Approve & notify student
                </button>
                <button type="button" style={{ padding: '8px 16px', background: '#005fa3', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'default' }}>
                  Issue credential
                </button>
              </div>
            )}
            {active && variant !== 'schedule' && variant !== 'credential' && (
              <div style={{ marginTop: 12, paddingLeft: 32 }}>
                <p style={{ margin: '0 0 8px', fontSize: 12 }}>Demo Reviewer → Demo Student</p>
                <button type="button" style={{ padding: '8px 16px', background: '#eb4511', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'default' }}>
                  Confirm assignment
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CredentialVerifyPreview() {
  return (
    <div className="orx" style={{ fontFamily: FONT, background: 'var(--bg, #faf7f2)', padding: '8px 0', margin: '-8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: BORDER }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink, #0f0d0c)' }}>Orcred</span>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)' }}>Verified credential</span>
      </div>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 6px' }}>Orcred verified engineer</p>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px', letterSpacing: '-0.02em' }}>Demo Student (Walkthrough)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(200px, 0.9fr)', gap: 16, alignItems: 'start' }}>
        <div style={{ transform: 'scale(0.92)', transformOrigin: 'top left' }}>
          <Credential
            project={DEMO_PROJECT.replace('[Demo] ', '')}
            stack={DEMO_STACK.replace(/ · /g, ', ')}
            totalScore={DEMO_SCORE}
            dimensions={DEMO_DIMENSIONS}
            passed
            id="ORC-2026-DEMO"
            caption={false}
            brandVariant="icon"
          />
        </div>
        <div style={{ background: '#fff', border: BORDER, padding: 16, borderRadius: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 12px' }}>Share</p>
          <button type="button" style={{ width: '100%', padding: '10px 14px', marginBottom: 8, background: '#0a66c2', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'default' }}>
            Share on LinkedIn
          </button>
          <button type="button" style={{ width: '100%', padding: '10px 14px', background: '#fff', border: BORDER, fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'default' }}>
            Copy verify link
          </button>
          <div style={{ marginTop: 16 }}>
            <Badge project="Campus Queue RAG" stack="Python · LangChain" id="ORC-2026-DEMO" caption={false} width={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: '#fff', border: BORDER, padding: 12, borderRadius: 6 }}>
      <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)' }}>{title}</p>
      {children}
    </div>
  );
}
