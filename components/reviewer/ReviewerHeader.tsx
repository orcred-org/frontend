'use client';

import { DashboardHeader, type DashboardNavItem } from '@/components/dashboard/DashboardShell';

export default function ReviewerHeader({
  subtitle,
  userName = 'Reviewer',
  userEmail,
  onSignOut,
  onDashboardClick,
}: {
  subtitle?: string;
  userName?: string;
  userEmail?: string;
  onSignOut: () => void;
  /** When set (e.g. in-app application view), Dashboard nav resets to the list instead of routing. */
  onDashboardClick?: () => void;
}) {
  const navItems: DashboardNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: onDashboardClick ? undefined : '/dashboard/reviewer',
      active: !onDashboardClick,
      onClick: onDashboardClick,
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/dashboard/reviewer/profile',
    },
  ];

  return (
    <>
      <DashboardHeader
        homeHref="/dashboard/reviewer"
        navItems={navItems}
        userName={userName}
        userEmail={userEmail}
        roleLabel="Reviewer"
        onSignOut={onSignOut}
        mainMaxWidth={1100}
      />
      {subtitle && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
          <p className="dash-muted" style={{ margin: '12px 0 0' }}>
            {subtitle}
          </p>
        </div>
      )}
    </>
  );
}
