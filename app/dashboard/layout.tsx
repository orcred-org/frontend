import { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard - Orcred',
  description: 'Orcred platform dashboard',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dash min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      {children}
    </div>
  );
}
