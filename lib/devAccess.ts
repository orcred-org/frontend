/**
 * @deprecated Use `@/lib/roles` — dev full-access bypass removed for production security.
 */
export { allowsDashboardRole, type AccountType } from './roles';

/** Always false — dev role switching removed. */
export function isDevFullAccess(_email: string | undefined | null): boolean {
  return false;
}
