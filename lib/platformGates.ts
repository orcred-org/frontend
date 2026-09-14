/** When true (default), only admin and invited reviewer accounts may sign in. */
export function isAdminOnlyAuth(): boolean {
  return process.env.NEXT_PUBLIC_ADMIN_ONLY_AUTH !== 'false';
}

/** Whether this account type may complete magic-link sign-in. */
export function canSignInWithRole(accountType: string | null | undefined): boolean {
  if (!accountType) return false;
  if (isAdminOnlyAuth()) {
    return accountType === 'admin' || accountType === 'reviewer';
  }
  return accountType === 'student' || accountType === 'reviewer' || accountType === 'admin';
}

/** When true, students can submit verification applications from the dashboard. */
export function isStudentApplyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_STUDENT_APPLY_ENABLED === 'true';
}

export const WAITLIST_PATH = '/join-waitlist';
