'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase implicit flow puts tokens in the URL hash
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        }
      }

      // Check session and redirect to right dashboard
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/dashboard/auth?error=no_session');
        return;
      }

      // Ask backend which dashboard to go to
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
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <p style={{ color: 'var(--fg-muted)' }}>Signing you in...</p>
    </div>
  );
}
