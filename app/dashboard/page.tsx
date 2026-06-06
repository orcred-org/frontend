'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardHome() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect to role-specific dashboard
    // For now, redirect to auth page if not logged in
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

        if (account_type === 'student') {
          router.push('/dashboard/student');
        } else if (account_type === 'reviewer') {
          router.push('/dashboard/reviewer');
        } else if (account_type === 'admin') {
          router.push('/dashboard/admin');
        }
      } catch (error) {
        router.push('/dashboard/auth');
      }
    };

    checkAuth();
  }, [router]);

  return null;
}
