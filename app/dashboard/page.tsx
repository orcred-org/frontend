'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardHome() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.auth.me() as { account_type: string };
        const { account_type } = data;

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
