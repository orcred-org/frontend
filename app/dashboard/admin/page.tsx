'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useRequireAuth } from '@/lib/useRequireAuth';
import UserProfilePanel from '@/components/admin/UserProfilePanel';
import ReviewerAssignPanel from '@/components/admin/ReviewerAssignPanel';
import AssignConfirmModal from '@/components/admin/AssignConfirmModal';
import AdminWorkflowSteps from '@/components/admin/AdminWorkflowSteps';
import AdminSubmissionDetail from '@/components/admin/AdminSubmissionDetail';
import ScheduledMeetingsCalendar from '@/components/admin/ScheduledMeetingsCalendar';
import WaitlistPanel from '@/components/admin/WaitlistPanel';
import PlatformDemoPanel from '@/components/admin/PlatformDemoPanel';
import AccountSettingsPanel from '@/components/settings/AccountSettingsPanel';
import DashStatCard from '@/components/dashboard/DashStatCard';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ReviewerInviteForm from '@/components/admin/ReviewerInviteForm';
import {
  ensureInboxBaseline,
  readInboxBaseline,
  inboxBadgeCount,
  dismissInboxCategory,
  dismissSessionInbox,
  clearInboxBaseline,
  type AdminInboxCounts,
  type AdminInboxKey,
} from '@/lib/adminInboxSeen';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Analytics {
  applications: { total: number; this_month: number; last_month: number };
  scores:        { average: number; pass_rate_all_time: number };
  credentials:   { total: number; linkedin_conversion_pct: number };
  revenue:       { all_time: number; this_month: number };
  waitlist?:     { total: number; pending: number; this_month: number };
  inbox?: {
    payment_to_confirm: number;
    new_applications: number;
    waitlist_pending: number;
    needs_reviewer: number;
    sessions_today: number;
    session_proposals: number;
    credentials_to_issue: number;
  };
}

interface Application {
  id:           string;
  user_id?:     string;
  project_name: string;
  tech_stack:   string;
  status:       string;
  submitted_at: string;
  payment_at:   string | null;
  utr_number:   string | null;
  users:        { id?: string; full_name: string; email: string } | null;
  reviewer_assignments: Array<{
    reviewer_id?: string;
    session_date: string | null;
    status:       string;
    workflow_stage?: string;
    reviewers:    { full_name: string } | null;
  }>;
  scores: Array<{ total_score: number; final_score: number | null; passed: boolean }>;
}

interface Reviewer {
  id:                 string;
  full_name:          string;
  email:              string;
  linkedin_url:       string | null;
  sessions_completed: number;
  average_score:      number | null;
  pass_rate:          number | null;
}

interface AppDetail {
  id: string;
  project_name: string;
  tech_stack: string;
  status: string;
  submitted_at: string;
  payment_at: string | null;
  github_url: string;
  loom_url: string;
  build_decision_1: string;
  build_decision_2: string;
  build_decision_3: string;
  what_broke: string;
  ai_tools_used: string;
  recording_url?: string | null;
  session_transcript?: string | null;
  session_transcript_summary?: string | null;
  session_transcript_generated_at?: string | null;
  users: { id?: string; full_name: string; email: string } | null;
  scores: Array<{ total_score: number; final_score: number | null; passed: boolean; admin_review_status?: string; feedback_td?: string; submitted_at?: string }> | { total_score: number; final_score: number | null; passed: boolean; admin_review_status?: string; feedback_td?: string; submitted_at?: string } | null;
  credentials: { credential_id: string; credential_url: string; issued_at: string } | Array<{ credential_id: string; credential_url: string; issued_at: string }> | null;
  reviewer_assignments?: Array<{
    id: string;
    workflow_stage?: string;
    proposed_session_at?: string | null;
    proposed_session_notes?: string | null;
    student_code?: string | null;
    session_date?: string | null;
    session_proposal_submitted_at?: string | null;
    admin_session_reminder_count?: number | null;
    status?: string;
    accepted_at?: string | null;
    session_completed_at?: string | null;
    student_session_confirmed_at?: string | null;
    student_feedback_audio?: number | null;
    student_feedback_video?: number | null;
    student_feedback_notes?: string | null;
    reviewer_joined_at?: string | null;
    student_joined_at?: string | null;
    reviewer_early_end_reason?: string | null;
    student_early_end_reason?: string | null;
    reviewers?: { id?: string; full_name: string; email: string } | null;
    reviewer_tasks?: Array<{
      id: string;
      task_key: string;
      title: string;
      status: string;
      notes?: string | null;
      completed_at?: string | null;
      sort_order?: number;
      unlocked?: boolean;
      is_custom?: boolean;
    }> | null;
  }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtRevenue(paise: number) {
  const r = paise / 100;
  if (r >= 100000) return `₹${(r / 100000).toFixed(1)}L`;
  if (r >= 1000)   return `₹${(r / 1000).toFixed(1)}K`;
  return `₹${r === 0 ? '0' : r.toLocaleString('en-IN')}`;
}

function statusMeta(status: string): { bg: string; color: string; label: string } {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    submitted:         { bg: 'rgba(235,69,17,0.1)',  color: '#eb4511', label: 'Submitted' },
    payment_pending:   { bg: 'rgba(235,69,17,0.1)',  color: '#eb4511', label: 'Payment Pending' },
    payment_confirmed: { bg: 'rgba(184,121,0,0.12)', color: '#9a6500', label: 'Needs Reviewer' },
    reviewer_assigned:   { bg: 'rgba(0,122,74,0.1)',   color: '#007a4a', label: 'Reviewer Assigned' },
    awaiting_reviewer: { bg: 'rgba(184,121,0,0.12)', color: '#9a6500', label: 'Awaiting Reviewer' },
    scheduled:         { bg: 'rgba(0,122,74,0.1)',   color: '#007a4a', label: 'Scheduled' },
    completed:         { bg: 'rgba(0,95,163,0.1)',   color: '#005fa3', label: 'Completed' },
    cancelled:         { bg: 'rgba(15,13,12,0.07)',  color: '#6b6460', label: 'Cancelled' },
  };
  return map[status] ?? { bg: 'rgba(15,13,12,0.07)', color: '#6b6460', label: status.replace(/_/g, ' ') };
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const FONT = 'Inter, system-ui, sans-serif';
const BG   = '#faf7f2';
const BORDER = '1px solid rgba(15,13,12,0.1)';
const APP_PAGE_SIZE = 10;

// ── Component ─────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'applications' | 'waitlist' | 'reviewers' | 'demo' | 'settings';

export default function AdminDashboard() {
  const { ready, signOut: authSignOut } = useRequireAuth();
  const signOut = async () => {
    clearInboxBaseline();
    await authSignOut();
  };
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>('dashboard');
  const [analytics,    setAnalytics]    = useState<Analytics | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appTotal,     setAppTotal]     = useState(0);
  const [reviewers,    setReviewers]    = useState<Reviewer[]>([]);
  const [apiError,     setApiError]     = useState('');

  const [loadingA,    setLoadingA]    = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingR,    setLoadingR]    = useState(true);

  const [tableTab, setTableTab] = useState<'all' | 'payment_confirmed' | 'scheduled' | 'completed'>('all');
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [generatingTranscript, setGeneratingTranscript] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [appDetail, setAppDetail] = useState<AppDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [scoreInput, setScoreInput] = useState(75);
  const [scoreFeedback, setScoreFeedback] = useState('Manual admin review — payment bypassed for local testing.');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);
  const [assignPanelApp, setAssignPanelApp] = useState<Application | null>(null);
  const [pendingAssign, setPendingAssign] = useState<{
    appId: string;
    reviewerId: string;
    studentName: string;
    projectName: string;
    reviewerName: string;
  } | null>(null);
  const [inboxBaseline, setInboxBaseline] = useState<Partial<AdminInboxCounts>>(() => readInboxBaseline());

  // Fetch analytics
  useEffect(() => {
    if (!ready) return;
    (async () => {
      setLoadingA(true);
      try {
        const res = await api.admin.analytics() as any;
        setAnalytics(res?.data ?? res);
        setApiError('');
      } catch (e) {
        if (e instanceof ApiError) setApiError(e.message);
      }
      finally { setLoadingA(false); }
    })();
  }, [ready]);

  useEffect(() => {
    if (analytics?.inbox) {
      setInboxBaseline(ensureInboxBaseline(analytics.inbox as AdminInboxCounts));
    }
  }, [analytics?.inbox]);

  const dismissInbox = (key: AdminInboxKey) => {
    if (!analytics?.inbox) return;
    const counts = analytics.inbox as AdminInboxCounts;
    setInboxBaseline((prev) => dismissInboxCategory(key, counts[key], prev));
  };

  const dismissSessionsInbox = () => {
    if (!analytics?.inbox) return;
    setInboxBaseline((prev) => dismissSessionInbox(analytics.inbox as AdminInboxCounts, prev));
  };

  // Fetch applications
  const fetchApps = useCallback(async () => {
    if (!ready) return;
    setLoadingApps(true);
    try {
      const p: Record<string, string> = { page: String(page) };
      if (tableTab !== 'all') p.status = tableTab;
      if (search) p.search = search;
      const res = await api.admin.applications(new URLSearchParams(p).toString()) as any;
      setApplications(res?.data ?? []);
      setAppTotal(res?.total ?? 0);
      setApiError('');
    } catch (e) {
      if (e instanceof ApiError) setApiError(e.message);
    }
    finally { setLoadingApps(false); }
  }, [ready, tableTab, search, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const loadAppDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await api.admin.application(id) as { data?: AppDetail };
      setAppDetail(res?.data ?? null);
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Failed to load application');
      setAppDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const openApp = (id: string) => {
    setSelectedAppId(id);
    loadAppDetail(id);
  };

  const closeApp = () => {
    setSelectedAppId(null);
    setAppDetail(null);
  };

  const refreshDetail = async () => {
    if (selectedAppId) await loadAppDetail(selectedAppId);
    await fetchApps();
  };

  const fetchReviewers = useCallback(async () => {
    setLoadingR(true);
    try {
      const res = await api.admin.reviewers() as any;
      setReviewers(res?.data ?? []);
      setApiError('');
    } catch (e) {
      if (e instanceof ApiError) setApiError(e.message);
    } finally {
      setLoadingR(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    void fetchReviewers();
  }, [ready, fetchReviewers]);

  const handleConfirmPayment = async (appId: string) => {
    setActionLoading(appId);
    try {
      await api.admin.confirmPayment(appId);
      await refreshDetail();
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Confirm payment failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitScore = async (appId: string) => {
    setActionLoading(appId);
    try {
      const res = await api.admin.submitScore({
        application_id: appId,
        total_score: scoreInput,
        feedback: scoreFeedback,
      }) as { data?: { passed?: boolean; credential?: { credentialId: string; credentialUrl: string } } };
      await refreshDetail();
      setApiError('');
      alert('Manual score saved. Review and issue credential when ready.');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Score submission failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssign = async () => {
    if (!pendingAssign) return;
    const { appId, reviewerId } = pendingAssign;
    setActionLoading(appId);
    try {
      await api.admin.assign({ application_id: appId, reviewer_id: reviewerId });
      setPendingAssign(null);
      await refreshDetail();
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Assign failed');
    } finally {
      setActionLoading(null);
    }
  };

  const openAssignPanel = (app: Application) => {
    setAssignPanelApp(app);
  };

  const openAssignConfirm = (app: Application, reviewerId: string) => {
    const reviewer = reviewers.find((r) => r.id === reviewerId);
    setAssignPanelApp(null);
    setPendingAssign({
      appId: app.id,
      reviewerId,
      studentName: app.users?.full_name ?? 'Student',
      projectName: app.project_name,
      reviewerName: reviewer?.full_name ?? 'Reviewer',
    });
  };

  const handleIssueCredential = async (appId: string, overrideFailed = false) => {
    setActionLoading(appId);
    try {
      const res = await api.admin.issueCredential(appId, { override_failed: overrideFailed }) as { data?: { credential?: { credentialId: string; credentialUrl: string } } };
      await refreshDetail();
      setApiError('');
      const cred = res?.data?.credential;
      if (cred) alert(`Credential issued: ${cred.credentialId}\n${cred.credentialUrl}`);
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Credential issue failed');
    } finally {
      setActionLoading(null);
    }
  };

  const loadUserProfile = useCallback(async (userId: string) => {
    setUserProfileLoading(true);
    try {
      const res = await api.admin.userProfile(userId) as { data?: Record<string, unknown> };
      setUserProfile(res?.data ?? null);
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Failed to load profile');
      setUserProfile(null);
    } finally {
      setUserProfileLoading(false);
    }
  }, []);

  const openUserProfile = (userId: string) => {
    setSelectedUserId(userId);
    loadUserProfile(userId);
  };

  const openApplicationsFiltered = useCallback((
    tab: 'all' | 'payment_confirmed' | 'scheduled' | 'completed',
  ) => {
    setView('applications');
    setTableTab(tab);
    setPage(1);
  }, []);

  const closeUserProfile = () => {
    setSelectedUserId(null);
    setUserProfile(null);
  };

  useEffect(() => {
    if (!ready) return;
    if (searchParams.get('view') === 'demo') setView('demo');
  }, [ready, searchParams]);

  const handleApproveSession = async (assignmentId: string) => {
    setActionLoading(selectedAppId);
    try {
      await api.admin.approveSession(assignmentId);
      await refreshDetail();
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Approve session failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSessionReminder = async (assignmentId: string) => {
    setActionLoading(selectedAppId);
    try {
      await api.admin.sessionReminder(assignmentId);
      await refreshDetail();
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Send reminder failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRescheduleSession = async (assignmentId: string, newSessionAt: string, note?: string) => {
    const label = new Date(newSessionAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    if (!confirm(`Reschedule session to ${label}?\n\nStudent and reviewer will be emailed immediately.`)) return;
    setActionLoading(selectedAppId);
    try {
      await api.admin.rescheduleSession({
        assignment_id: assignmentId,
        new_session_at: newSessionAt,
        note,
      });
      await refreshDetail();
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Reschedule failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewScore = async (appId: string, action: 'approve' | 'request_revision' | 'under_review') => {
    if (!confirm(`Confirm: ${action.replace(/_/g, ' ')}?`)) return;
    setActionLoading(appId);
    try {
      await api.admin.reviewScore({ application_id: appId, action });
      await refreshDetail();
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Score review failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateTranscript = async (appId: string) => {
    setGeneratingTranscript(true);
    try {
      await api.admin.generateTranscript(appId);
      await refreshDetail();
      setApiError('');
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Transcript generation failed');
    } finally {
      setGeneratingTranscript(false);
    }
  };

  const handleResetStep = async (appId: string, step: 'payment' | 'assignment' | 'score' | 'credential' | 'full') => {
    const labels: Record<string, string> = {
      payment: 'undo payment confirmation',
      assignment: 'remove reviewer assignment',
      score: 'delete score (allows re-scoring)',
      credential: 'revoke issued credential',
      full: 'FULL RESET — rewind entire journey to submitted',
    };
    if (!confirm(`Reset this application?\n\nAction: ${labels[step]}\n\nThis cannot be undone.`)) return;
    setActionLoading(appId);
    try {
      await api.admin.resetApplication(appId, step);
      await refreshDetail();
      await fetchApps();
      setApiError('');
      alert(`Reset complete: ${labels[step]}`);
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : 'Reset failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Derived counts (inbox from analytics is authoritative for action badges)
  const inbox = analytics?.inbox;
  const awaitingCount = inbox?.needs_reviewer ?? applications.filter(a => a.status === 'payment_confirmed' || a.status === 'reviewer_assigned').length;
  const scheduled = applications.filter(a => a.status === 'scheduled').length;
  const badgePayment = inbox ? inboxBadgeCount('payment_to_confirm', inbox.payment_to_confirm, inboxBaseline) : 0;
  const badgeNewApps = inbox ? inboxBadgeCount('new_applications', inbox.new_applications, inboxBaseline) : 0;
  const badgeWaitlist = inbox ? inboxBadgeCount('waitlist_pending', inbox.waitlist_pending, inboxBaseline) : 0;
  const badgeReviewer = inbox ? inboxBadgeCount('needs_reviewer', inbox.needs_reviewer, inboxBaseline) : 0;
  const badgeSessions = inbox
    ? inboxBadgeCount('sessions_today', inbox.sessions_today, inboxBaseline)
      + inboxBadgeCount('session_proposals', inbox.session_proposals, inboxBaseline)
    : 0;
  const badgeCredentials = inbox ? inboxBadgeCount('credentials_to_issue', inbox.credentials_to_issue, inboxBaseline) : 0;

  useEffect(() => {
    if (view !== 'demo') return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [view]);

  if (!ready) return null;

  const demoShell = view === 'demo';

  const adminNav = (['dashboard', 'applications', 'waitlist', 'reviewers', 'demo', 'settings'] as View[]).map((v) => ({
    id: v,
    label: v === 'waitlist' ? 'Waitlist' : v === 'demo' ? 'Demo' : v.charAt(0).toUpperCase() + v.slice(1),
    active: view === v,
    onClick: () => setView(v),
  }));

  return (
    <DashboardShell
      homeHref="/dashboard/admin"
      navItems={adminNav}
      userName="Admin"
      roleLabel="Manager"
      userInitial="A"
      onSignOut={signOut}
      showFooter={!demoShell}
      headerPosition={demoShell ? 'relative' : 'sticky'}
      mainMaxWidth={demoShell ? 'none' : 1400}
      mainClassName={`admin-main${view === 'demo' ? ' admin-main--demo' : ''}`}
      mainStyle={demoShell ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } : undefined}
      shellStyle={{
        fontFamily: FONT,
        height: demoShell ? '100vh' : undefined,
        overflow: demoShell ? 'hidden' : 'hidden auto',
        width: '100%',
        maxWidth: '100vw',
      }}
      headerExtra={(
        <button
          type="button"
          onClick={() => setView('demo')}
          className="admin-nav-preview"
          style={{
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: view === 'demo' ? '#fff' : 'rgba(15,13,12,0.55)',
            background: view === 'demo' ? '#eb4511' : 'transparent',
            border: '1px solid rgba(15,13,12,0.12)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          Platform demo
        </button>
      )}
    >
      <style>{`
        .admin-main { max-width: 1400px; margin: 0 auto; padding: 36px clamp(16px, 4vw, 40px) 80px; width: 100%; box-sizing: border-box; }
        .admin-header-inner { max-width: 1400px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px); height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0; }
        .admin-stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .admin-dash-stack { display: flex; flex-direction: column; gap: 16px; width: 100%; min-width: 0; }
        .admin-dash-bottom { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; width: 100%; min-width: 0; }
        .admin-cal-section .cal-root { margin-bottom: 0 !important; border: none !important; box-shadow: none !important; background: #fff1e8 !important; }
        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
        @media (max-width: 900px) {
          .admin-dash-bottom { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .admin-nav-preview { display: none !important; }
        }
        @media (max-width: 820px) {
          .admin-app-full-grid { grid-template-columns: 1fr !important; }
        }
        .admin-main--demo {
          max-width: none !important;
          margin: 0 !important;
          padding: 8px clamp(8px, 1.5vw, 16px) 8px !important;
          flex: 1 1 auto;
          min-height: 0 !important;
          height: auto;
          max-height: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .admin-header-inner--demo {
          max-width: none !important;
        }
      `}</style>

        {/* Page title */}
        {view !== 'demo' && (
          <h1 className="dash-page-title">
            {view === 'waitlist' ? 'Waitlist' : view.charAt(0).toUpperCase() + view.slice(1)}
          </h1>
        )}

        {apiError && view !== 'demo' && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)', fontSize: '13px', color: '#ba1a1a' }}>
            {apiError}
          </div>
        )}

        {/* ── Platform demo ── */}
        {view === 'demo' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
            <PlatformDemoPanel />
          </div>
        )}

        {/* ── Waitlist ── */}
        {view === 'waitlist' && <WaitlistPanel />}

        {/* ── Settings ── */}
        {view === 'settings' && <AccountSettingsPanel embedded />}

        {/* ── Reviewers full view ── */}
        {view === 'reviewers' && (
          <div>
            <ReviewerInviteForm onInvited={() => void fetchReviewers()} />
            {loadingR ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                {[1,2,3].map(i => <div key={i} style={{ height: '140px', backgroundColor: 'rgba(15,13,12,0.04)', border: BORDER }} />)}
              </div>
            ) : reviewers.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', fontSize: '14px', color: 'rgba(15,13,12,0.45)', backgroundColor: '#fff', border: BORDER, borderRadius: 12 }}>
                <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#0f0d0c' }}>No reviewers yet</p>
                <p style={{ margin: 0 }}>Use the form above to add someone by email.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                {reviewers.map(r => <ReviewerCard key={r.id} reviewer={r} onViewProfile={() => openUserProfile(r.id)} />)}
              </div>
            )}
          </div>
        )}

        {/* ── Dashboard + Applications views ── */}
        {(view === 'dashboard' || view === 'applications') && <>

        {/* ── Stat cards (incl. revenue) ───────────────────────────── */}
        {view === 'dashboard' && <div className="admin-stat-row">
          {loadingA ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: '110px', backgroundColor: 'rgba(15,13,12,0.04)', border: BORDER, borderRadius: 12 }} />
            ))
          ) : analytics ? (
            <>
              <DashStatCard
                icon="💰"
                label="Revenue"
                value={fmtRevenue(analytics.revenue.all_time)}
                sub={`${fmtRevenue(analytics.revenue.this_month)} this month · ${analytics.scores.average}/100 avg score`}
                accent="#0d9488"
                badge={badgePayment || undefined}
                badgeHint={badgePayment ? `${badgePayment} new payment${badgePayment === 1 ? '' : 's'} to confirm` : undefined}
                urgent={badgePayment > 0}
                onClick={() => { dismissInbox('payment_to_confirm'); openApplicationsFiltered('all'); }}
              />
              <DashStatCard
                icon="📋"
                label="Total Applications"
                value={analytics.applications.total}
                sub={`${analytics.applications.this_month} this month · view all`}
                accent="#eb4511"
                badge={badgeNewApps || undefined}
                badgeHint={badgeNewApps ? `${badgeNewApps} new since you logged in` : undefined}
                urgent={badgeNewApps > 0}
                onClick={() => { dismissInbox('new_applications'); openApplicationsFiltered('all'); }}
              />
              <DashStatCard
                icon="📝"
                label="Waitlist Signups"
                value={analytics.waitlist?.total ?? 0}
                sub={`${analytics.waitlist?.pending ?? 0} pending · open waitlist`}
                accent="#7c3aed"
                badge={badgeWaitlist || undefined}
                badgeHint={badgeWaitlist ? `${badgeWaitlist} new waitlist signup${badgeWaitlist === 1 ? '' : 's'}` : undefined}
                urgent={badgeWaitlist > 0}
                onClick={() => { dismissInbox('waitlist_pending'); setView('waitlist'); }}
              />
              <DashStatCard
                icon="⏳"
                label="Awaiting Reviewer"
                value={awaitingCount}
                sub="Need assignment · filter list"
                accent="#9a6500"
                badge={badgeReviewer || undefined}
                badgeHint={badgeReviewer ? `${badgeReviewer} new — assign reviewer${badgeReviewer === 1 ? '' : 's'}` : undefined}
                urgent={badgeReviewer > 0}
                onClick={() => { dismissInbox('needs_reviewer'); openApplicationsFiltered('payment_confirmed'); }}
              />
              <DashStatCard
                icon="📅"
                label="Sessions Scheduled"
                value={scheduled}
                sub="Upcoming reviews · filter list"
                accent="#007a4a"
                badge={badgeSessions || undefined}
                badgeHint={
                  badgeSessions > 0
                    ? `${badgeSessions} new session update${badgeSessions === 1 ? '' : 's'} since login`
                    : undefined
                }
                urgent={badgeSessions > 0 && (inbox?.sessions_today ?? 0) > 0}
                onClick={() => { dismissSessionsInbox(); openApplicationsFiltered('scheduled'); }}
              />
              <DashStatCard
                icon="🎓"
                label="Credentials Issued"
                value={analytics.credentials.total}
                sub={`${analytics.scores.pass_rate_all_time}% pass rate · completed`}
                accent="#005fa3"
                badge={badgeCredentials || undefined}
                badgeHint={badgeCredentials ? `${badgeCredentials} new ready to issue` : undefined}
                urgent={badgeCredentials > 0}
                onClick={() => { dismissInbox('credentials_to_issue'); openApplicationsFiltered('completed'); }}
              />
            </>
          ) : null}
        </div>}

        {/* ── Applications table → calendar → reviewers ── */}
        <div className="admin-dash-stack">

          <div className="dash-surface" style={{ backgroundColor: '#fff', minWidth: 0, borderRadius: 12 }}>

            {/* Table header */}
            <div style={{ padding: '18px 20px 0', borderBottom: BORDER }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f0d0c', letterSpacing: '-0.01em' }}>
                  Applications
                  {appTotal > 0 && <span style={{ marginLeft: '6px', fontSize: '13px', fontWeight: 400, color: 'rgba(15,13,12,0.38)' }}>{appTotal}</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} />
                </div>
              </div>

              {/* Tab filters */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {([
                  { key: 'all',               label: 'All' },
                  { key: 'payment_confirmed', label: 'Needs Reviewer' },
                  { key: 'scheduled',         label: 'Scheduled' },
                  { key: 'completed',         label: 'Completed' },
                ] as const).map(t => (
                  <button
                    key={t.key}
                    onClick={() => { setTableTab(t.key); setPage(1); }}
                    style={{
                      padding: '7px 14px',
                      fontSize: '12px', fontWeight: tableTab === t.key ? 600 : 400,
                      color: tableTab === t.key ? '#fff' : 'rgba(15,13,12,0.5)',
                      backgroundColor: tableTab === t.key ? '#eb4511' : 'transparent',
                      border: tableTab === t.key ? 'none' : '1px solid rgba(15,13,12,0.12)',
                      borderRadius: '4px',
                      cursor: 'pointer', fontFamily: FONT,
                      marginBottom: '0',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table — horizontal scroll on narrow viewports */}
            <div className="admin-table-wrap">
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(15,13,12,0.07)' }}>
                    {['Student', 'Project', 'Submitted', 'Payment', 'Reviewer', 'Score', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'rgba(15,13,12,0.38)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', backgroundColor: 'rgba(250,247,242,0.6)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingApps ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(15,13,12,0.05)' }}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} style={{ padding: '14px 16px' }}>
                            <div style={{ height: '12px', width: j === 0 ? '100px' : j === 1 ? '140px' : '60px', backgroundColor: 'rgba(15,13,12,0.06)', borderRadius: '2px' }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '52px', textAlign: 'center', fontSize: '14px', color: 'rgba(15,13,12,0.35)' }}>
                        No applications found.
                      </td>
                    </tr>
                  ) : applications.map(app => (
                    <AppRow
                      key={app.id}
                      app={app}
                      loading={actionLoading === app.id}
                      selected={selectedAppId === app.id}
                      onOpen={() => openApp(app.id)}
                      onConfirmPayment={() => handleConfirmPayment(app.id)}
                      onOpenAssignPanel={() => openAssignPanel(app)}
                      onViewProfile={() => {
                        const uid = app.user_id ?? app.users?.id;
                        if (uid) openUserProfile(uid);
                      }}
                      onViewReviewerProfile={(reviewerId) => openUserProfile(reviewerId)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {appTotal > APP_PAGE_SIZE && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(15,13,12,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'rgba(15,13,12,0.4)' }}>
                  Page {page} of {Math.ceil(appTotal / APP_PAGE_SIZE)}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <PageBtn label="← Prev" disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                  <PageBtn label="Next →" disabled={page * APP_PAGE_SIZE >= appTotal} onClick={() => setPage(p => p + 1)} />
                </div>
              </div>
            )}

          </div>

          {view === 'dashboard' && (
            <div
              className="admin-cal-section"
              style={{
                marginTop: 16,
                marginBottom: 16,
                padding: '4px',
                borderRadius: 14,
                background: '#ffe8d9',
                border: '1px solid rgba(235, 69, 17, 0.18)',
              }}
            >
              <ScheduledMeetingsCalendar onOpenApplication={(id) => openApp(id)} />
            </div>
          )}

          {view === 'dashboard' && (
            <div className="admin-dash-bottom">
            <div className="dash-surface" style={{ backgroundColor: '#fff', borderRadius: 12, minWidth: 0, gridColumn: '1 / -1' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(15,13,12,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f0d0c', letterSpacing: '-0.01em' }}>Reviewers</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {reviewers.length > 0 && (
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(15,13,12,0.06)', color: 'rgba(15,13,12,0.5)', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>
                      {reviewers.length} active
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setView('reviewers')}
                    style={{
                      padding: '6px 12px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#eb4511',
                      background: 'rgba(235,69,17,0.08)',
                      border: '1px solid rgba(235,69,17,0.25)',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    + Add reviewer
                  </button>
                </div>
              </div>

              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(15,13,12,0.07)' }}>
                <ReviewerInviteForm compact onInvited={() => void fetchReviewers()} />
              </div>

              {loadingR ? (
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(15,13,12,0.06)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: '10px', width: '100px', backgroundColor: 'rgba(15,13,12,0.06)', borderRadius: '2px', marginBottom: '6px' }} />
                        <div style={{ height: '8px', width: '70px', backgroundColor: 'rgba(15,13,12,0.04)', borderRadius: '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviewers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'rgba(15,13,12,0.45)' }}>
                  No reviewers listed yet — grant access with the form above.
                </div>
              ) : (
                <div>
                  {reviewers.map((r, i) => (
                    <ReviewerRow key={r.id} reviewer={r} last={i === reviewers.length - 1} onViewProfile={() => openUserProfile(r.id)} />
                  ))}
                </div>
              )}
            </div>

          </div>
          )}
        </div>

        </>}

        {selectedAppId && (
          <ApplicationPanel
            detail={appDetail}
            loading={detailLoading}
            actionLoading={actionLoading === selectedAppId}
            generatingTranscript={generatingTranscript}
            scoreInput={scoreInput}
            scoreFeedback={scoreFeedback}
            onScoreInputChange={setScoreInput}
            onScoreFeedbackChange={setScoreFeedback}
            onClose={closeApp}
            onConfirmPayment={() => handleConfirmPayment(selectedAppId)}
            onSubmitScore={() => handleSubmitScore(selectedAppId)}
            onIssueCredential={(overrideFailed) => handleIssueCredential(selectedAppId, overrideFailed)}
            onResetStep={(step) => handleResetStep(selectedAppId, step)}
            onViewProfile={() => {
              const uid = appDetail?.users?.id;
              if (uid) openUserProfile(uid);
            }}
            onApproveSession={handleApproveSession}
            onRescheduleSession={handleRescheduleSession}
            onSessionReminder={handleSessionReminder}
            onReviewScore={handleReviewScore}
            onGenerateTranscript={() => handleGenerateTranscript(selectedAppId)}
          />
        )}

        {selectedUserId && (
          <UserProfilePanel
            data={userProfile as Parameters<typeof UserProfilePanel>[0]['data']}
            loading={userProfileLoading}
            onClose={closeUserProfile}
          />
        )}

        {assignPanelApp && (
          <ReviewerAssignPanel
            studentName={assignPanelApp.users?.full_name ?? 'Student'}
            projectName={assignPanelApp.project_name}
            techStack={assignPanelApp.tech_stack}
            reviewers={reviewers}
            loading={actionLoading === assignPanelApp.id}
            onClose={() => setAssignPanelApp(null)}
            onViewProfile={openUserProfile}
            onAssign={(reviewerId) => openAssignConfirm(assignPanelApp, reviewerId)}
          />
        )}

        {pendingAssign && (
          <AssignConfirmModal
            studentName={pendingAssign.studentName}
            projectName={pendingAssign.projectName}
            reviewerName={pendingAssign.reviewerName}
            loading={actionLoading === pendingAssign.appId}
            onConfirm={handleAssign}
            onCancel={() => setPendingAssign(null)}
          />
        )}
    </DashboardShell>
  );
}

// ── ReviewerCard (full view) ──────────────────────────────────────────────────

function ReviewerCard({ reviewer: r, onViewProfile }: { reviewer: Reviewer; onViewProfile: () => void }) {
  const [hov, setHov] = useState(false);
  const initials = r.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      onClick={onViewProfile}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#fff',
        border: `1px solid ${hov ? 'rgba(235,69,17,0.3)' : 'rgba(15,13,12,0.1)'}`,
        padding: '24px',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: hov ? '0 4px 20px rgba(235,69,17,0.07)' : 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(15,13,12,0.07)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(235,69,17,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#eb4511' }}>{initials}</span>
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f0d0c', letterSpacing: '-0.01em' }}>{r.full_name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(15,13,12,0.45)', marginTop: '2px' }}>{r.email}</div>
          {r.linkedin_url && (
            <a href={r.linkedin_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '11px', color: '#eb4511', textDecoration: 'none', fontWeight: 500 }}>
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Sessions',  value: r.sessions_completed, unit: '' },
          { label: 'Avg score', value: r.average_score !== null ? r.average_score : '—', unit: r.average_score !== null ? '/100' : '' },
          { label: 'Pass rate', value: r.pass_rate     !== null ? r.pass_rate     : '—', unit: r.pass_rate     !== null ? '%'    : '' },
        ].map(s => (
          <div key={s.label}>
            <p style={{ fontSize: '11px', color: 'rgba(15,13,12,0.4)', marginBottom: '4px', fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: '26px', fontWeight: 300, letterSpacing: '-0.03em', color: '#0f0d0c', lineHeight: 1, margin: 0 }}>
              {s.value}<span style={{ fontSize: '11px', color: 'rgba(15,13,12,0.38)', marginLeft: '1px' }}>{s.unit}</span>
            </p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'rgba(15,13,12,0.35)', marginTop: 14, marginBottom: 0 }}>Click to view full profile →</p>
    </div>
  );
}

// ── AppRow ────────────────────────────────────────────────────────────────────

function AppRow({ app, loading, selected, onOpen, onConfirmPayment, onOpenAssignPanel, onViewProfile, onViewReviewerProfile }: {
  app: Application;
  loading: boolean;
  selected: boolean;
  onOpen: () => void;
  onConfirmPayment: () => void;
  onOpenAssignPanel: () => void;
  onViewProfile: () => void;
  onViewReviewerProfile: (reviewerId: string) => void;
}) {
  const [hov, setHov] = useState(false);
  const badge  = statusMeta(app.status);
  const score  = app.scores?.[0];
  const assign = app.reviewer_assignments?.[0];
  const needsPayment = !app.payment_at && (app.status === 'submitted' || app.status === 'payment_pending');
  return (
    <tr
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: '1px solid rgba(15,13,12,0.05)',
        backgroundColor: selected ? 'rgba(235,69,17,0.06)' : hov ? '#faf7f2' : '#fff',
        transition: 'background-color 0.12s',
        cursor: 'pointer',
      }}
    >
      <td style={{ padding: '13px 16px' }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onViewProfile}
          style={{ fontSize: '13px', fontWeight: 500, color: '#0f0d0c', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          {app.users?.full_name || '—'}
        </button>
        <div style={{ fontSize: '11px', color: 'rgba(15,13,12,0.38)', marginTop: '1px' }}>{app.users?.email}</div>
      </td>
      <td style={{ padding: '13px 16px', fontSize: '13px', color: 'rgba(15,13,12,0.7)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {app.project_name}
      </td>
      <td style={{ padding: '13px 16px', fontSize: '12px', color: 'rgba(15,13,12,0.45)', whiteSpace: 'nowrap' }}>
        {new Date(app.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
      </td>
      <td style={{ padding: '13px 16px' }}>
        {app.payment_at
          ? <span style={{ fontSize: '12px', fontWeight: 600, color: '#007a4a' }}>Paid ✓</span>
          : app.utr_number
            ? <span style={{ fontSize: '12px', fontWeight: 500, color: '#9a6500' }}>Pending</span>
            : <span style={{ fontSize: '13px', color: 'rgba(15,13,12,0.25)' }}>—</span>}
      </td>
      <td style={{ padding: '13px 16px', fontSize: '12px', color: 'rgba(15,13,12,0.55)', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
        {assign?.reviewers?.full_name ? (
          <button
            type="button"
            onClick={() => {
              const rid = assign.reviewer_id;
              if (rid) onViewReviewerProfile(rid);
            }}
            style={{ fontSize: 12, color: '#0f0d0c', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(15,13,12,0.25)' }}
          >
            {assign.reviewers.full_name}
          </button>
        ) : (
          <span style={{ color: 'rgba(15,13,12,0.25)' }}>Unassigned</span>
        )}
      </td>
      <td style={{ padding: '13px 16px' }}>
        {score
          ? <span style={{ fontSize: '13px', fontWeight: 700, color: score.passed ? '#007a4a' : '#ba1a1a' }}>
              {score.final_score ?? score.total_score}
              <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(15,13,12,0.3)', marginLeft: '1px' }}>/100</span>
            </span>
          : <span style={{ color: 'rgba(15,13,12,0.25)', fontSize: '13px' }}>—</span>}
      </td>
      <td style={{ padding: '13px 16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', backgroundColor: badge.bg, color: badge.color, borderRadius: '4px', whiteSpace: 'nowrap' }}>
          {badge.label}
        </span>
        {assign?.workflow_stage === 'session_proposed' && (
          <span style={{ display: 'block', marginTop: 4, fontSize: 10, fontWeight: 600, color: '#9a6500' }}>
            Schedule pending approval
          </span>
        )}
      </td>
      <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
        {needsPayment && (
          <button disabled={loading} onClick={onConfirmPayment} style={{ fontSize: 11, padding: '4px 8px', background: '#eb4511', color: '#fff', border: 'none', cursor: 'pointer', marginRight: 4 }}>
            Mark paid
          </button>
        )}
        {app.status === 'payment_confirmed' && !assign && (
          <button
            disabled={loading}
            onClick={onOpenAssignPanel}
            style={{ fontSize: 11, padding: '4px 10px', background: '#007a4a', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 14 }}
          >
            Assign reviewer
          </button>
        )}
        {score?.passed && (
          <span style={{ fontSize: 11, color: '#007a4a', fontWeight: 600 }}>Passed</span>
        )}
        <span style={{ fontSize: 11, color: 'rgba(15,13,12,0.35)', marginLeft: 6 }}>Open →</span>
      </td>
    </tr>
  );
}

// ── ReviewerRow ───────────────────────────────────────────────────────────────

function ReviewerRow({ reviewer: r, last, onViewProfile }: { reviewer: Reviewer; last: boolean; onViewProfile: () => void }) {
  const [hov, setHov] = useState(false);
  const initials = r.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      onClick={onViewProfile}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '13px 20px',
        borderBottom: last ? 'none' : '1px solid rgba(15,13,12,0.06)',
        backgroundColor: hov ? '#faf7f2' : '#fff',
        transition: 'background-color 0.12s',
        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
      }}
    >
      <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(235,69,17,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#eb4511' }}>{initials}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f0d0c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.full_name}</div>
        <div style={{ fontSize: '11px', color: 'rgba(15,13,12,0.4)', marginTop: '1px' }}>
          {r.sessions_completed} sessions · {r.pass_rate !== null ? `${r.pass_rate}% pass` : 'No sessions'}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f0d0c', letterSpacing: '-0.02em' }}>
          {r.average_score !== null ? r.average_score : '—'}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(15,13,12,0.35)' }}>avg score</div>
      </div>
    </div>
  );
}

// ── Application detail panel (manual workflow) ───────────────────────────────

function firstScore(scores: AppDetail['scores']) {
  if (!scores) return null;
  return Array.isArray(scores) ? scores[0] : scores;
}

function firstCred(creds: AppDetail['credentials']) {
  if (!creds) return null;
  return Array.isArray(creds) ? creds[0] : creds;
}

function ApplicationPanel({
  detail, loading, actionLoading, generatingTranscript, scoreInput, scoreFeedback,
  onScoreInputChange, onScoreFeedbackChange,
  onClose, onConfirmPayment, onSubmitScore, onIssueCredential, onResetStep, onViewProfile,
  onApproveSession, onRescheduleSession, onSessionReminder, onReviewScore, onGenerateTranscript,
}: {
  detail: AppDetail | null;
  loading: boolean;
  actionLoading: boolean;
  generatingTranscript?: boolean;
  scoreInput: number;
  scoreFeedback: string;
  onScoreInputChange: (n: number) => void;
  onScoreFeedbackChange: (s: string) => void;
  onClose: () => void;
  onConfirmPayment: () => void;
  onSubmitScore: () => void;
  onIssueCredential: (overrideFailed: boolean) => void;
  onResetStep: (step: 'payment' | 'assignment' | 'score' | 'credential' | 'full') => void;
  onViewProfile: () => void;
  onApproveSession: (assignmentId: string) => void;
  onRescheduleSession: (assignmentId: string, newSessionAt: string, note?: string) => void;
  onSessionReminder: (assignmentId: string) => void;
  onReviewScore: (appId: string, action: 'approve' | 'request_revision' | 'under_review') => void;
  onGenerateTranscript?: () => Promise<void>;
}) {
  const score = detail ? firstScore(detail.scores) : null;
  const cred = detail ? firstCred(detail.credentials) : null;
  const assignment = detail?.reviewer_assignments
    ? (Array.isArray(detail.reviewer_assignments) ? detail.reviewer_assignments[0] : detail.reviewer_assignments)
    : null;
  const [confirmReviewed, setConfirmReviewed] = useState(false);
  const [overrideFailed, setOverrideFailed] = useState(false);
  const paymentDone = !!detail?.payment_at || detail?.status === 'payment_confirmed' || ['scheduled', 'reviewer_assigned', 'completed'].includes(detail?.status ?? '');
  const scoreDone = !!score;
  const credDone = !!cred;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,13,12,0.45)', zIndex: 100 }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(960px, 94vw)',
        maxHeight: '92vh',
        background: '#fff',
        zIndex: 101,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: BORDER,
        boxShadow: '0 24px 64px rgba(15,13,12,0.18)',
        borderRadius: 8,
      }}>
        <div style={{ padding: '18px 24px', borderBottom: BORDER, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: '#fff' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#eb4511', marginBottom: 4 }}>Full application view</p>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{detail?.project_name ?? 'Loading…'}</h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer', color: 'rgba(15,13,12,0.4)', lineHeight: 1 }} aria-label="Close">×</button>
        </div>

        {loading || !detail ? (
          <div style={{ padding: 40, color: 'rgba(15,13,12,0.4)' }}>Loading…</div>
        ) : (
          <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'rgba(15,13,12,0.55)', margin: 0 }}>
                {detail.users?.full_name} · {detail.users?.email}
              </p>
              <button
                type="button"
                onClick={onViewProfile}
                style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, border: '1px solid rgba(15,13,12,0.2)', background: '#fff', cursor: 'pointer' }}
              >
                Student profile →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}
              className="admin-app-full-grid"
            >
              <AdminSubmissionDetail
                project_name={detail.project_name}
                tech_stack={detail.tech_stack}
                github_url={detail.github_url}
                loom_url={detail.loom_url}
                build_decision_1={detail.build_decision_1}
                build_decision_2={detail.build_decision_2}
                build_decision_3={detail.build_decision_3}
                what_broke={detail.what_broke}
                ai_tools_used={detail.ai_tools_used}
                submitted_at={detail.submitted_at}
                fullPage
              />

              <AdminWorkflowSteps
                detailStatus={detail.status}
                paymentDone={paymentDone}
                assignment={assignment}
                projectName={detail.project_name}
                recordingUrl={detail.recording_url ?? null}
                scoreSubmittedAt={score?.submitted_at ?? null}
                score={score}
                credentialIssued={credDone}
                actionLoading={actionLoading}
                scoreInput={scoreInput}
                scoreFeedback={scoreFeedback}
                onScoreInputChange={onScoreInputChange}
                onScoreFeedbackChange={onScoreFeedbackChange}
                onConfirmPayment={onConfirmPayment}
                onApproveSession={onApproveSession}
                onRescheduleSession={onRescheduleSession}
                onSessionReminder={onSessionReminder}
                onReviewScore={(action) => onReviewScore(detail.id, action)}
                onSubmitManualScore={onSubmitScore}
                onIssueCredential={onIssueCredential}
                confirmReviewed={confirmReviewed}
                overrideFailed={overrideFailed}
                onConfirmReviewedChange={setConfirmReviewed}
                onOverrideFailedChange={setOverrideFailed}
                transcriptSummary={detail.session_transcript_summary}
                transcript={detail.session_transcript}
                transcriptGeneratedAt={detail.session_transcript_generated_at}
                onGenerateTranscript={onGenerateTranscript}
                generatingTranscript={generatingTranscript}
              />
            </div>

            {credDone && cred && (
              <div style={{ marginBottom: 16, padding: 14, border: BORDER, background: 'rgba(0,95,163,0.04)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#005fa3', margin: '0 0 6px' }}>Credential issued</p>
                <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>{cred.credential_id}</p>
                <a href={cred.credential_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#eb4511', wordBreak: 'break-all' }}>{cred.credential_url}</a>
              </div>
            )}

            <div style={{ marginTop: 24, padding: 16, border: '1px solid rgba(186,26,26,0.25)', background: 'rgba(186,26,26,0.03)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ba1a1a', marginBottom: 12 }}>
                Reset journey
              </p>
              <p style={{ fontSize: 12, color: 'rgba(15,13,12,0.5)', marginBottom: 12, lineHeight: 1.6 }}>
                Undo specific steps to re-test the workflow. Destructive — requires confirmation.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {paymentDone && (
                  <button disabled={actionLoading} onClick={() => onResetStep('payment')} style={{ fontSize: 11, padding: '6px 10px', border: '1px solid rgba(15,13,12,0.2)', background: '#fff', cursor: 'pointer' }}>
                    Undo payment
                  </button>
                )}
                <button disabled={actionLoading} onClick={() => onResetStep('assignment')} style={{ fontSize: 11, padding: '6px 10px', border: '1px solid rgba(15,13,12,0.2)', background: '#fff', cursor: 'pointer' }}>
                  Remove assignment
                </button>
                {scoreDone && (
                  <button disabled={actionLoading} onClick={() => onResetStep('score')} style={{ fontSize: 11, padding: '6px 10px', border: '1px solid rgba(15,13,12,0.2)', background: '#fff', cursor: 'pointer' }}>
                    Delete score
                  </button>
                )}
                {credDone && (
                  <button disabled={actionLoading} onClick={() => onResetStep('credential')} style={{ fontSize: 11, padding: '6px 10px', border: '1px solid rgba(15,13,12,0.2)', background: '#fff', cursor: 'pointer' }}>
                    Revoke credential
                  </button>
                )}
                <button disabled={actionLoading} onClick={() => onResetStep('full')} style={{ fontSize: 11, padding: '6px 10px', border: '1px solid #ba1a1a', background: '#ba1a1a', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  Full reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Small utils ───────────────────────────────────────────────────────────────

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: '10px', opacity: 0.35 }}>
        <circle cx="6.5" cy="6.5" r="5" stroke="#0f0d0c" strokeWidth="1.5"/>
        <path d="M10 10L14 14" stroke="#0f0d0c" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <input
        placeholder="Search project…"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          paddingLeft: '30px', paddingRight: '10px', paddingTop: '7px', paddingBottom: '7px',
          border: `1px solid ${focused ? '#eb4511' : 'rgba(15,13,12,0.14)'}`,
          backgroundColor: '#faf7f2', fontSize: '12px', color: '#0f0d0c',
          fontFamily: FONT, outline: 'none', borderRadius: '4px', width: '180px',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}

function PageBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '6px 14px', border: '1px solid rgba(15,13,12,0.14)',
        backgroundColor: hov && !disabled ? '#faf7f2' : '#fff',
        fontSize: '12px', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, fontFamily: FONT,
        borderRadius: '4px', transition: 'background-color 0.15s', color: '#0f0d0c',
      }}
    >
      {label}
    </button>
  );
}
