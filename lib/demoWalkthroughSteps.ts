import type { DemoPreviewId } from '@/components/admin/demo/DemoScreenPreviews';

export type DemoFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'chips'
  | 'checkbox'
  | 'info'
  | 'success'
  | 'payment';

export interface DemoWalkthroughField {
  label: string;
  value: string;
  type?: DemoFieldType;
  hint?: string;
}

export interface DemoWalkthroughStep {
  id: string;
  route: string;
  title: string;
  subtitle: string;
  persona: 'student' | 'reviewer' | 'admin' | 'public';
  fields: DemoWalkthroughField[];
  /** Rich UI mock matching the real screen (session, credential, etc.). */
  preview?: DemoPreviewId;
  previewVariant?: string;
  /** After clicking Next on this step, sync backend to this stage (if demo seeded). */
  backendStage?: string;
}

export const DEMO_WALKTHROUGH_STEPS: DemoWalkthroughStep[] = [
  {
    id: 'student-waitlist',
    route: '/join-waitlist',
    title: 'Join the waitlist',
    subtitle: 'Student · Step 1 — Early access signup (public)',
    persona: 'student',
    backendStage: 'student_registered',
    fields: [
      { label: 'Full name', value: 'Demo Student (Walkthrough)', type: 'text' },
      { label: 'Email', value: 'platform-demo-student@demo.orcred', type: 'email' },
      { label: 'Phone', value: '+91 98765 43210', type: 'tel', hint: 'WhatsApp or SMS — we may reach out about launch' },
      { label: 'What do you build?', value: 'LLMs, RAG, AI Agents', type: 'chips' },
      { label: 'Degree or background', value: 'B.Tech / BE', type: 'select' },
      { label: 'Where did you find us?', value: 'LinkedIn', type: 'select' },
      {
        label: 'Why do you want Orcred verification?',
        value:
          'I built a campus queue RAG assistant and want a live expert review to validate my architectural choices before recruiting season. Orcred gives me a defensible score, not just a certificate.',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'student-waitlist-done',
    route: '/join-waitlist',
    title: "You're on the list",
    subtitle: 'Student · Waitlist confirmation',
    persona: 'student',
    fields: [
      {
        label: 'Status',
        value: 'Confirmation email sent. Admin invites you when applications open.',
        type: 'success',
      },
    ],
  },
  {
    id: 'student-auth',
    route: '/dashboard/auth',
    title: 'Sign in with magic link',
    subtitle: 'Student · Email login (no password)',
    persona: 'student',
    fields: [
      { label: 'Email Address', value: 'platform-demo-student@demo.orcred', type: 'email' },
      {
        label: 'What happens next',
        value: 'Student clicks the link in email → lands on /dashboard/student with their profile and apply CTA.',
        type: 'info',
      },
    ],
  },
  {
    id: 'student-profile',
    route: '/dashboard/student/profile',
    title: 'Complete your profile',
    subtitle: 'Student · Profile before applying (100% unlocks apply)',
    persona: 'student',
    fields: [
      { label: 'Full Name', value: 'Demo Student (Walkthrough)', type: 'text' },
      { label: 'Email Address', value: 'platform-demo-student@demo.orcred', type: 'email' },
      { label: 'College / University', value: 'Demo Institute of Technology', type: 'text' },
      { label: 'Graduation Year', value: '2026', type: 'select' },
      { label: 'LinkedIn URL', value: 'https://linkedin.com/in/demo-student-orcred', type: 'url' },
    ],
  },
  {
    id: 'apply-personal',
    route: '/dashboard/student/apply',
    title: 'Application · Personal Details',
    subtitle: 'Student · Apply wizard step 1 of 4',
    persona: 'student',
    fields: [
      { label: 'Full Name', value: 'Demo Student (Walkthrough)', type: 'text' },
      { label: 'Email', value: 'platform-demo-student@demo.orcred', type: 'email' },
      { label: 'LinkedIn URL', value: 'https://linkedin.com/in/demo-student-orcred', type: 'url' },
      { label: 'College', value: 'Demo Institute of Technology', type: 'text' },
      { label: 'Graduation Year', value: '2026', type: 'select' },
    ],
  },
  {
    id: 'apply-project',
    route: '/dashboard/student/apply',
    title: 'Application · Project Details',
    subtitle: 'Student · Apply wizard step 2 of 4',
    persona: 'student',
    fields: [
      { label: 'Project Name', value: '[Demo] Campus Queue RAG Assistant', type: 'text' },
      { label: 'Tech Stack', value: 'Python, FastAPI, PostgreSQL, React, LangChain', type: 'chips' },
      { label: 'GitHub Repository URL', value: 'https://github.com/example/demo-campus-rag', type: 'url' },
      { label: 'Loom Walkthrough URL', value: 'https://www.loom.com/share/demo-walkthrough', type: 'url', hint: '8–12 min walkthrough of what you built' },
    ],
  },
  {
    id: 'apply-deepdive',
    route: '/dashboard/student/apply',
    title: 'Application · Deep Dive',
    subtitle: 'Student · Apply wizard step 3 of 4',
    persona: 'student',
    fields: [
      {
        label: 'Most Important Architectural Decision',
        value:
          'Demo: Used pgvector on Postgres instead of a separate vector DB so ops stay on one database. Hybrid BM25 + embeddings improved policy-number recall by 18% in evals.',
        type: 'textarea',
      },
      {
        label: "What Didn't Work",
        value:
          'Demo: Pure embedding search missed exact policy IDs. Added BM25 + reranker; latency stayed under 400ms p95 on 10k docs.',
        type: 'textarea',
      },
      {
        label: "What You'd Change",
        value:
          'Demo: Would chunk at 512 tokens from the start — started at 1024 and had to re-embed after FAQ recall dropped on long answers.',
        type: 'textarea',
      },
      {
        label: 'Something That Broke',
        value: 'Demo: OpenAI embed batch rate limits during backfill — added exponential backoff and checkpointed progress.',
        type: 'textarea',
      },
      {
        label: 'AI Tools Used',
        value: 'Demo: Copilot for unit tests only; architecture, eval design, and deployment were self-directed.',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'apply-schedule',
    route: '/dashboard/student/apply',
    title: 'Application · Schedule & Payment',
    subtitle: 'Student · Apply wizard step 4 of 4 — submit then pay on dashboard',
    persona: 'student',
    backendStage: 'application_submitted',
    fields: [
      { label: 'Timezone', value: 'Asia/Kolkata', type: 'select' },
      {
        label: 'Availability',
        value: 'Weekday evenings (6pm–9pm), Saturday morning, Saturday afternoon',
        type: 'chips',
      },
      { label: 'Other availability', value: 'Flexible after 8pm IST on weekdays', type: 'text' },
      { label: 'Built & can defend every decision', value: 'Confirmed', type: 'checkbox' },
      { label: 'Session recording consent', value: 'Confirmed', type: 'checkbox' },
      { label: 'Verification fee', value: '₹1,999 — pay on dashboard after submit (Razorpay or UTR)', type: 'payment' },
    ],
  },
  {
    id: 'student-payment',
    route: '/dashboard/student',
    title: 'Confirm payment',
    subtitle: 'Student · Dashboard payment section',
    persona: 'student',
    backendStage: 'payment_confirmed',
    fields: [
      { label: 'Amount', value: '₹1,999', type: 'payment' },
      { label: 'Method', value: 'Razorpay (live) or manual UTR entry for testing', type: 'info' },
      { label: 'Demo UTR', value: 'DEMO-UTR-2026-0001', type: 'text' },
      { label: 'Status after admin confirms', value: 'Application moves to “Needs Reviewer”', type: 'success' },
    ],
  },
  {
    id: 'reviewer-interest',
    route: '/become-a-reviewer',
    title: 'Apply to review',
    subtitle: 'Reviewer · Public interest form (founders review manually)',
    persona: 'reviewer',
    fields: [
      { label: 'Full name', value: 'Demo Reviewer (Walkthrough)', type: 'text' },
      { label: 'Email', value: 'platform-demo-reviewer@demo.orcred', type: 'email' },
      { label: 'Current role and company', value: 'Staff ML Engineer at Orcred Demo', type: 'text' },
      { label: 'LinkedIn or GitHub', value: 'https://linkedin.com/in/demo-reviewer', type: 'url' },
      { label: 'Years in AI/ML', value: '10 years', type: 'text' },
      { label: 'Specialisation', value: 'LLM systems, RAG, backend', type: 'text' },
      {
        label: 'What work do you review best?',
        value: 'End-to-end ML products with retrieval, evals, and production tradeoffs — especially where the student can defend latency vs quality choices.',
        type: 'textarea',
      },
      {
        label: 'Why do you want to review for Orcred?',
        value: 'Structured rubric, async prep, and live sessions beat unstructured coffee chats. I want to help students who actually ship.',
        type: 'textarea',
      },
      { label: 'Timezone and availability', value: 'Asia/Kolkata — weekends and weekday evenings', type: 'text' },
    ],
  },
  {
    id: 'reviewer-profile',
    route: '/dashboard/reviewer/profile',
    title: 'Reviewer profile',
    subtitle: 'Reviewer · Mandatory onboarding (blocks dashboard until complete)',
    persona: 'reviewer',
    backendStage: 'reviewer_registered',
    fields: [
      { label: 'Full name', value: 'Demo Reviewer (Walkthrough)', type: 'text' },
      { label: 'Phone', value: '+91 98765 43211', type: 'tel' },
      { label: 'Email', value: 'platform-demo-reviewer@demo.orcred', type: 'email' },
      { label: 'Current company', value: 'Orcred Demo', type: 'text' },
      { label: 'Current role', value: 'Staff ML Engineer', type: 'text' },
      { label: 'Years of experience', value: '10+', type: 'select' },
      { label: 'LinkedIn URL', value: 'https://linkedin.com/in/demo-reviewer', type: 'url' },
      { label: 'Core expertise', value: 'LLM systems, backend, hybrid search', type: 'text' },
      { label: 'Timezone', value: 'Asia/Kolkata', type: 'select' },
    ],
  },
  {
    id: 'reviewer-dashboard',
    route: '/dashboard/reviewer',
    title: 'Reviewer dashboard',
    subtitle: 'Reviewer · Assigned students and workflow',
    persona: 'reviewer',
    preview: 'reviewer-dashboard',
    fields: [],
  },
  {
    id: 'reviewer-flow',
    route: '/dashboard/reviewer',
    title: 'Review & propose session',
    subtitle: 'Reviewer · Accept → review submission → propose time',
    persona: 'reviewer',
    preview: 'reviewer-flow',
    fields: [],
  },
  {
    id: 'admin-student-profile',
    route: '/dashboard/admin',
    title: 'View student profile',
    subtitle: 'Admin · Inspect demo student before assignment',
    persona: 'admin',
    fields: [
      { label: 'Name', value: 'Demo Student (Walkthrough)', type: 'text' },
      { label: 'Email', value: 'platform-demo-student@demo.orcred', type: 'email' },
      { label: 'College', value: 'Demo Institute of Technology', type: 'text' },
      { label: 'Graduation', value: '2026', type: 'text' },
      { label: 'LinkedIn', value: 'https://linkedin.com/in/demo-student-orcred', type: 'url' },
    ],
  },
  {
    id: 'admin-reviewer-profile',
    route: '/dashboard/admin',
    title: 'View reviewer profile',
    subtitle: 'Admin · Inspect demo reviewer before assignment',
    persona: 'admin',
    fields: [
      { label: 'Name', value: 'Demo Reviewer (Walkthrough)', type: 'text' },
      { label: 'Email', value: 'platform-demo-reviewer@demo.orcred', type: 'email' },
      { label: 'Company / role', value: 'Orcred Demo · Staff ML Engineer', type: 'text' },
      { label: 'Experience', value: '10 years', type: 'text' },
      { label: 'Expertise', value: 'LLM systems, backend', type: 'text' },
    ],
  },
  {
    id: 'admin-assign',
    route: '/dashboard/admin',
    title: 'Assign reviewer',
    subtitle: 'Admin · Match demo application to demo reviewer',
    persona: 'admin',
    backendStage: 'reviewer_assigned',
    preview: 'admin-workflow',
    fields: [],
  },
  {
    id: 'admin-schedule',
    route: '/dashboard/admin',
    title: 'Approve session time',
    subtitle: 'Admin · Reviewer proposes slot → admin approves',
    persona: 'admin',
    backendStage: 'session_scheduled',
    preview: 'admin-workflow',
    previewVariant: 'schedule',
    fields: [],
  },
  {
    id: 'session-live',
    route: '/dashboard/session/[assignmentId]',
    title: 'Live review session',
    subtitle: 'Daily.co video · Switch tabs to see reviewer, student, and admin observer',
    persona: 'student',
    backendStage: 'session_live',
    preview: 'session-live',
    fields: [],
  },
  {
    id: 'session-complete',
    route: '/dashboard/session/[assignmentId]',
    title: 'Session completed',
    subtitle: 'Both parties joined · Student confirms wrap-up',
    persona: 'reviewer',
    backendStage: 'session_completed',
    preview: 'session-complete',
    fields: [],
  },
  {
    id: 'reviewer-score',
    route: '/dashboard/reviewer',
    title: 'Submit score',
    subtitle: 'Reviewer · Rubric + code deletion acknowledgment',
    persona: 'reviewer',
    backendStage: 'score_submitted',
    preview: 'reviewer-score',
    fields: [],
  },
  {
    id: 'admin-session-report',
    route: '/dashboard/admin',
    title: 'Admin session report',
    subtitle: 'Admin · Timeline, score, feedback, and Groq AI transcript summary',
    persona: 'admin',
    backendStage: 'score_submitted',
    preview: 'admin-session-report',
    fields: [
      { label: 'Demo application', value: '[Demo] Campus Queue RAG Assistant', type: 'text' },
      { label: 'Transcript source', value: 'Sample Groq output (Whisper + Llama 3.3 70B)', type: 'info' },
    ],
  },
  {
    id: 'admin-credential',
    route: '/dashboard/admin',
    title: 'Issue credential',
    subtitle: 'Admin · Review score → approve → issue ORC credential',
    persona: 'admin',
    backendStage: 'credential_issued',
    preview: 'admin-workflow',
    previewVariant: 'credential',
    fields: [
      { label: 'Credential ID', value: 'ORC-2026-DEMO', type: 'text' },
      { label: 'Verify URL', value: 'orcred.com/verify/ORC-2026-DEMO', type: 'url' },
    ],
  },
  {
    id: 'verify-public',
    route: '/verify/[credentialId]',
    title: 'Public verification',
    subtitle: 'Anyone · Real credential page layout',
    persona: 'public',
    preview: 'credential-verify',
    fields: [],
  },
];

export const BACKEND_STAGE_ORDER = [
  'idle',
  'student_registered',
  'reviewer_registered',
  'application_submitted',
  'payment_confirmed',
  'reviewer_assigned',
  'session_scheduled',
  'session_live',
  'session_completed',
  'score_submitted',
  'credential_issued',
] as const;
