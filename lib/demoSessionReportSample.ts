import type { SessionAuditData } from '@/components/admin/AdminSessionAudit';
import type { WorkflowScore } from '@/components/admin/AdminWorkflowSteps';

/** Sample admin session report — mirrors platform demo backend seed (Campus Queue RAG). */
export const DEMO_SESSION_REPORT = {
  recordingUrl: 'https://daily.co/demo/recording/campus-queue-rag-review',
  transcriptGeneratedAt: '2026-09-09T11:02:00.000Z',
  transcriptSummary: `Topics discussed
• RAG architecture for campus queue FAQs — pgvector on Postgres vs dedicated vector DB
• Chunking strategy (512-token windows), hybrid BM25 + embedding retrieval
• Student demoed ingest pipeline, eval set, and failure cases (rate limits, stale docs)

Student strengths
• Clear tradeoff reasoning for single-DB ops and cost at campus scale
• Honest eval methodology — held-out question set, not just vibe checks
• Recovered well when probed on re-ranking and citation accuracy

Gaps / concerns
• Load testing and latency under concurrent queries was hand-wavy
• No structured plan for document freshness / admin re-index workflow
• Security: API auth mentioned but not shown on the demo endpoint

Notable moments
• ~14 min: reviewer asked about hallucination guardrails — student cited source snippets in UI
• ~22 min: student acknowledged chunk overlap tuning was incomplete follow-up work`,
  transcript: `[00:00] Demo Reviewer: Let's start with your architecture — why Postgres pgvector instead of Pinecone or Weaviate?

[00:38] Demo Student: Campus IT wanted one database to operate. pgvector keeps vectors beside queue metadata — fewer moving parts for a student project scale.

[03:12] Demo Reviewer: Walk me through chunking. How did you pick 512 tokens?

[03:28] Demo Student: Ablation on our FAQ set — 512 beat 256 on policy-number questions without blowing context on long answers.

[07:45] Demo Reviewer: What breaks when the embedding API rate-limits during batch ingest?

[08:02] Demo Student: I added exponential backoff and a dead-letter queue for failed chunks. Re-run picks up from DLQ.

[14:10] Demo Reviewer: How do you reduce hallucinations in answers?

[14:22] Demo Student: Answers must cite retrieved chunks; UI shows sources. If similarity is below threshold we say we don't know.

[22:05] Demo Reviewer: What would you load-test first before a campus-wide pilot?

[22:18] Demo Student: Concurrent chat sessions against the FastAPI layer — I haven't run formal load tests yet, that's fair feedback.

[24:50] Demo Reviewer: Good session — I'll submit scores after you confirm wrap-up on your dashboard.`,
};

export function buildDemoSessionAudit(): SessionAuditData {
  const sessionDate = new Date('2026-09-09T04:30:00.000Z');
  const joined = new Date(sessionDate.getTime() + 2 * 60 * 1000);
  const completed = new Date(sessionDate.getTime() + 27 * 60 * 1000);
  const confirmed = new Date(completed.getTime() + 4 * 60 * 1000);
  return {
    session_date: sessionDate.toISOString(),
    accepted_at: new Date('2026-09-06T09:15:00.000Z').toISOString(),
    reviewer_joined_at: sessionDate.toISOString(),
    student_joined_at: joined.toISOString(),
    session_completed_at: completed.toISOString(),
    student_session_confirmed_at: confirmed.toISOString(),
  };
}

export function buildDemoSessionScore(): WorkflowScore {
  const submitted = new Date('2026-09-09T11:10:00.000Z').toISOString();
  return {
    total_score: 76,
    final_score: 76,
    passed: true,
    feedback_td:
      'Strong hybrid search rationale; clear eval methodology; would like more load-test evidence before campus-wide pilot.',
    submitted_at: submitted,
    code_deletion_acknowledged_at: submitted,
  };
}
