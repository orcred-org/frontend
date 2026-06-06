'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewerDashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/dashboard/auth');
          return;
        }

        const { account_type } = await res.json();
        if (account_type !== 'reviewer') {
          router.push('/dashboard');
        }
      } catch (error) {
        router.push('/dashboard/auth');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <header
        className="border-b p-6"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div className="max-w-container mx-auto">
          <h1 className="text-h1" style={{ color: 'var(--orange)' }}>
            Reviewer Dashboard
          </h1>
          <p style={{ color: 'var(--fg-muted)' }}>Coming soon</p>
        </div>
      </header>
    </div>
  );
}
