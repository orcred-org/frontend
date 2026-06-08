'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Suspense } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('[callback] exchange error:', error.message);
          router.push('/dashboard/auth?error=invalid_code');
          return;
        }
      }

      // Get session and redirect to right dashboard
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/dashboard/auth?error=no_session');
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/me`,
          { credentials: 'include', headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        if (res.ok) {
          const { account_type } = await res.json();
          const map: Record<string, string> = {
            student: '/dashboard/student',
            reviewer: '/dashboard/reviewer',
            admin: '/dashboard/admin',
          };
          router.push(map[account_type] || '/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch {
        router.push('/dashboard');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <p style={{ color: 'var(--fg-muted)' }}>Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <p style={{ color: 'var(--fg-muted)' }}>Loading...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
