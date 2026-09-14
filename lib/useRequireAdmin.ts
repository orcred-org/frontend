'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeSession } from './authSession';
import { supabase } from './supabase';
import { api, ApiError } from './api';
import { allowsDashboardRole } from './roles';

export function useRequireAdmin() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const session = await getSafeSession({ refresh: true });
        if (cancelled) return;

        if (!session) {
          router.replace('/dashboard/auth?from=admin');
          return;
        }

        try {
          const profile = await api.auth.me() as { account_type?: string; email?: string };
          if (!allowsDashboardRole(
            profile.account_type ? { account_type: profile.account_type } : null,
            'admin',
          )) {
            const role = profile.account_type ?? 'unknown';
            const email = profile.email ?? session.user.email ?? 'your account';
            setDenied(
              `Signed in as ${email} (${role}). Admin access required.`,
            );
            return;
          }
          setReady(true);
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : 'Could not load profile';
          setDenied(`${msg} (${session.user.email}).`);
        }
      } catch {
        if (!cancelled) router.replace('/dashboard/auth?from=admin');
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/dashboard/auth');
  };

  return { ready, denied, signOut };
}
