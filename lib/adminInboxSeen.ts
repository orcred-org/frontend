export type AdminInboxKey =
  | 'payment_to_confirm'
  | 'new_applications'
  | 'waitlist_pending'
  | 'needs_reviewer'
  | 'sessions_today'
  | 'session_proposals'
  | 'credentials_to_issue';

export type AdminInboxCounts = Record<AdminInboxKey, number>;

const STORAGE_KEY = 'orcred_admin_inbox_baseline';

export function readInboxBaseline(): Partial<AdminInboxCounts> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<AdminInboxCounts>) : {};
  } catch {
    return {};
  }
}

export function writeInboxBaseline(baseline: Partial<AdminInboxCounts>) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(baseline));
}

/** Snapshot current counts at first load this login — badges only show growth after that. */
export function ensureInboxBaseline(inbox: AdminInboxCounts): Partial<AdminInboxCounts> {
  const existing = readInboxBaseline();
  if (Object.keys(existing).length > 0) return existing;
  writeInboxBaseline({ ...inbox });
  return { ...inbox };
}

export function inboxBadgeCount(
  key: AdminInboxKey,
  current: number,
  baseline: Partial<AdminInboxCounts>,
): number {
  const seen = baseline[key] ?? 0;
  return Math.max(0, current - seen);
}

export function dismissInboxCategory(
  key: AdminInboxKey,
  current: number,
  baseline: Partial<AdminInboxCounts>,
): Partial<AdminInboxCounts> {
  const next = { ...baseline, [key]: current };
  writeInboxBaseline(next);
  return next;
}

export function dismissSessionInbox(
  inbox: AdminInboxCounts,
  baseline: Partial<AdminInboxCounts>,
): Partial<AdminInboxCounts> {
  let next = { ...baseline };
  next = dismissInboxCategory('sessions_today', inbox.sessions_today, next);
  next = dismissInboxCategory('session_proposals', inbox.session_proposals, next);
  return next;
}

export function clearInboxBaseline() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
