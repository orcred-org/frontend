'use client';

import { useState } from 'react';
import AdminSessionAudit, { type SessionAuditData } from '@/components/admin/AdminSessionAudit';
import type { WorkflowScore } from '@/components/admin/AdminWorkflowSteps';

interface AdminSessionReportProps {
  assignment: SessionAuditData | null;
  score: WorkflowScore | null;
  scoreSubmittedAt?: string | null;
  recordingUrl?: string | null;
  transcriptSummary?: string | null;
  transcript?: string | null;
  transcriptGeneratedAt?: string | null;
  studentFeedback?: {
    audio?: number | null;
    video?: number | null;
    notes?: string | null;
  };
  onGenerateTranscript?: () => Promise<void>;
  generatingTranscript?: boolean;
}

export default function AdminSessionReport({
  assignment,
  score,
  scoreSubmittedAt,
  recordingUrl,
  transcriptSummary,
  transcript,
  transcriptGeneratedAt,
  studentFeedback,
  onGenerateTranscript,
  generatingTranscript,
}: AdminSessionReportProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(15,13,12,0.4)',
        margin: '0 0 12px',
      }}>
        Admin session report
      </p>

      <AdminSessionAudit
        assignment={assignment}
        scoreSubmittedAt={scoreSubmittedAt}
        codeDeletionAcknowledgedAt={score?.code_deletion_acknowledged_at}
      />

      {score && (
        <div style={{ marginTop: 14, padding: 12, border: '1px solid rgba(15,13,12,0.1)', background: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 600, margin: '0 0 6px', color: 'rgba(15,13,12,0.45)' }}>Reviewer score</p>
          <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: score.passed ? '#007a4a' : '#ba1a1a' }}>
            {score.final_score ?? score.total_score}/100 {score.passed ? '(PASS)' : '(FAIL)'}
          </p>
          {score.feedback_td && (
            <p style={{ fontSize: 12, margin: 0, lineHeight: 1.55, color: 'rgba(15,13,12,0.65)', whiteSpace: 'pre-wrap' }}>
              {score.feedback_td}
            </p>
          )}
        </div>
      )}

      {studentFeedback && (studentFeedback.audio != null || studentFeedback.video != null || studentFeedback.notes) && (
        <div style={{ marginTop: 12, padding: 12, border: '1px solid rgba(15,13,12,0.1)', background: 'rgba(15,13,12,0.02)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, margin: '0 0 6px', color: 'rgba(15,13,12,0.45)' }}>Student session feedback</p>
          {studentFeedback.audio != null && <p style={{ fontSize: 12, margin: '0 0 4px' }}>Audio: {studentFeedback.audio}/5</p>}
          {studentFeedback.video != null && <p style={{ fontSize: 12, margin: '0 0 4px' }}>Video: {studentFeedback.video}/5</p>}
          {studentFeedback.notes && (
            <p style={{ fontSize: 12, margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{studentFeedback.notes}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: 12, padding: 12, border: '1px solid rgba(15,13,12,0.1)', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 600, margin: 0, color: 'rgba(15,13,12,0.45)' }}>AI transcript summary</p>
          {recordingUrl && onGenerateTranscript && !transcriptSummary && (
            <button
              type="button"
              disabled={generatingTranscript}
              onClick={() => void onGenerateTranscript()}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '5px 10px',
                border: '1px solid rgba(15,13,12,0.2)',
                background: '#fff',
                cursor: generatingTranscript ? 'wait' : 'pointer',
              }}
            >
              {generatingTranscript ? 'Generating…' : 'Generate from recording'}
            </button>
          )}
        </div>
        {transcriptSummary ? (
          <>
            <p style={{ fontSize: 12, margin: '0 0 8px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{transcriptSummary}</p>
            {transcriptGeneratedAt && (
              <p style={{ fontSize: 10, color: 'rgba(15,13,12,0.4)', margin: '0 0 8px' }}>
                Generated {new Date(transcriptGeneratedAt).toLocaleString('en-IN')}
              </p>
            )}
            {transcript && (
              <>
                <button
                  type="button"
                  onClick={() => setShowTranscript((v) => !v)}
                  style={{ fontSize: 11, fontWeight: 600, border: 'none', background: 'transparent', color: '#eb4511', cursor: 'pointer', padding: 0 }}
                >
                  {showTranscript ? 'Hide full transcript' : 'Show full transcript'}
                </button>
                {showTranscript && (
                  <pre style={{
                    marginTop: 8,
                    fontSize: 11,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 240,
                    overflowY: 'auto',
                    padding: 10,
                    background: 'rgba(15,13,12,0.03)',
                    border: '1px solid rgba(15,13,12,0.08)',
                  }}>
                    {transcript}
                  </pre>
                )}
              </>
            )}
          </>
        ) : recordingUrl ? (
          <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>
            Recording available — generate an admin-only transcript summary when ready.
          </p>
        ) : (
          <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', margin: 0 }}>
            Transcript will appear after the session recording is ready.
          </p>
        )}
        {recordingUrl && (
          <a href={recordingUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 10, fontSize: 12, color: '#eb4511', fontWeight: 600 }}>
            View recording →
          </a>
        )}
      </div>
    </div>
  );
}
