import { isAdminOnlyAuth } from '@/lib/platformGates';

export type AccountType = 'student' | 'reviewer' | 'admin';

export const DASHBOARD_BY_ROLE: Record<AccountType, string> = {
  student: '/dashboard/student',
  reviewer: '/dashboard/reviewer',
  admin: '/dashboard/admin',
};

export function dashboardPathForRole(accountType: string | undefined): string {
  if (accountType && accountType in DASHBOARD_BY_ROLE) {
    return DASHBOARD_BY_ROLE[accountType as AccountType];
  }
  return '/dashboard/auth';
}

/** Strict dashboard access — each role may only reach its own routes. */
export function allowsDashboardRole(
  me: { account_type: string } | null,
  required: AccountType,
): boolean {
  if (!me) return false;
  if (isAdminOnlyAuth()) {
    if (required === 'admin') return me.account_type === 'admin';
    if (required === 'reviewer') return me.account_type === 'reviewer';
    return false;
  }
  return me.account_type === required;
}
