'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';

function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    // Supabase JS auto-exchanges the ?code= (PKCE) on client init.
    // onAuthStateChange fires once the session is ready — no manual exchange needed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe();
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
        }

        if (event === 'INITIAL_SESSION' && !session) {
          // No session and no code to exchange — auth failed
          subscription.unsubscribe();
          router.push('/dashboard/auth?error=no_session');
        }
      }
    );

    return () => subscription.unsubscribe();
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
