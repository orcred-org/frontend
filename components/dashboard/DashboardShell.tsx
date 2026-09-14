'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import DashboardFooter from './DashboardFooter';

export type DashboardNavItem = {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
};

export type DashboardHeaderProps = {
  homeHref: string;
  navItems: DashboardNavItem[];
  userName: string;
  userEmail?: string;
  userInitial?: string;
  roleLabel?: string;
  onSignOut: () => void;
  headerExtra?: ReactNode;
  mainMaxWidth?: number | 'none';
  headerPosition?: 'sticky' | 'relative';
};

export type DashboardShellProps = DashboardHeaderProps & {
  children: ReactNode;
  showFooter?: boolean;
  mainClassName?: string;
  mainStyle?: CSSProperties;
  shellStyle?: CSSProperties;
};

function OrcredMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 42 42" fill="none" aria-hidden>
      <circle cx="21" cy="21" r="20" fill="#eb4511" />
    </svg>
  );
}

export function DashboardHeader({
  homeHref,
  navItems,
  userName,
  userEmail,
  userInitial,
  roleLabel,
  onSignOut,
  headerExtra,
  mainMaxWidth = 1400,
  headerPosition = 'sticky',
}: DashboardHeaderProps) {
  const initial = (userInitial ?? userName?.[0] ?? 'U').toUpperCase();
  const widthStyle = mainMaxWidth === 'none' ? undefined : { maxWidth: mainMaxWidth };

  return (
    <header
      className="dash-header"
      style={headerPosition === 'relative' ? { position: 'relative' } : undefined}
    >
      <div className="dash-header-inner" style={widthStyle}>
        <Link href={homeHref} className="dash-mark">
          <OrcredMark />
          <span className="dash-mark-text">Orcred</span>
        </Link>

        <nav className="dash-nav dash-nav--shell" aria-label="Dashboard">
          {navItems.map((item) => {
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="dash-nav-btn"
                  data-active={item.active ? 'true' : 'false'}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                className="dash-nav-btn"
                data-active={item.active ? 'true' : 'false'}
                onClick={item.onClick}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="dash-header-user">
          {headerExtra}
          <div className="dash-header-avatar" aria-hidden>
            {initial}
          </div>
          <div className="dash-header-user-text">
            <div className="dash-header-user-name">{userName}</div>
            <div className="dash-header-user-meta">
              {roleLabel ?? userEmail ?? ''}
            </div>
          </div>
          <button type="button" className="dash-btn dash-btn--outline" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export default function DashboardShell({
  homeHref,
  navItems,
  userName,
  userEmail,
  userInitial,
  roleLabel,
  onSignOut,
  headerExtra,
  children,
  mainMaxWidth = 1400,
  showFooter = true,
  headerPosition = 'sticky',
  mainClassName,
  mainStyle,
  shellStyle,
}: DashboardShellProps) {
  const widthStyle = mainMaxWidth === 'none' ? undefined : { maxWidth: mainMaxWidth };

  return (
    <div
      className="dash"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--dash-bg, #faf7f2)',
        display: 'flex',
        flexDirection: 'column',
        ...shellStyle,
      }}
    >
      <DashboardHeader
        homeHref={homeHref}
        navItems={navItems}
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        roleLabel={roleLabel}
        onSignOut={onSignOut}
        headerExtra={headerExtra}
        mainMaxWidth={mainMaxWidth}
        headerPosition={headerPosition}
      />

      <main
        className={mainClassName ?? 'dash-main'}
        style={{ ...widthStyle, ...mainStyle }}
      >
        {children}
      </main>

      {showFooter && <DashboardFooter />}
    </div>
  );
}
