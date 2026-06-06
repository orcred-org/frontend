'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentDashboardState {
  name: string;
  email: string;
  state: 'new' | 'has_idea' | 'applied' | 'scheduled' | 'completed';
  projectName?: string;
  projectTechStack?: string;
  applicationStatus?: string;
  score?: number;
  passed?: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/v1/student/dashboard', {
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/dashboard/auth');
          } else {
            setError('Failed to load dashboard');
          }
          return;
        }

        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <p style={{ color: 'var(--fg-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div
          className="max-w-md p-8"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '2px',
            border: '1px solid',
            borderColor: 'var(--border)',
          }}
        >
          <h2 className="text-h2 mb-4" style={{ color: 'var(--fg)' }}>
            Error
          </h2>
          <p style={{ color: 'var(--fg-muted)' }}>{error || 'Unable to load dashboard'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary mt-6 w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <header
        className="border-b p-6"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div className="max-w-container mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-h1 mb-2" style={{ color: 'var(--orange)' }}>
              Orcred
            </h1>
            <p style={{ color: 'var(--fg-muted)' }}>Welcome back, {data.name}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/student/profile')}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--fg)',
              borderRadius: '50px',
              padding: '10px 24px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid var(--fg)',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Edit Profile
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-container mx-auto p-6 lg:p-10">
        {data.state === 'new' && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Start Your Verification</h2>
            </div>
            <div
              className="p-8 border-2"
              style={{
                borderColor: 'var(--orange)',
                borderRadius: '2px',
                backgroundColor: 'var(--orange-tint)',
              }}
            >
              <h3 className="text-h3 mb-3" style={{ color: 'var(--orange)' }}>
                Generate Your Project Idea
              </h3>
              <p style={{ color: 'var(--fg)' }} className="mb-6">
                Not sure what to build? Let our AI help you generate a project idea tailored to your experience level.
              </p>
              <button className="btn-primary">Generate Project Idea</button>
            </div>
          </section>
        )}

        {data.state === 'has_idea' && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Your Project</h2>
            </div>
            <div
              className="p-6 border"
              style={{
                borderColor: 'var(--border)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <h3 className="text-h3 mb-2" style={{ color: 'var(--fg)' }}>
                {data.projectName}
              </h3>
              <p style={{ color: 'var(--fg-muted)' }} className="mb-6">
                {data.projectTechStack}
              </p>
              <div className="flex gap-4">
                <button className="btn-primary">Apply for Verification</button>
                <button className="btn-secondary">Generate New Idea</button>
              </div>
            </div>
          </section>
        )}

        {(data.state === 'applied' || data.state === 'scheduled' || data.state === 'completed') && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Application Status</h2>
            </div>
            <div
              className="p-6 border"
              style={{
                borderColor: 'var(--border)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <p style={{ color: 'var(--fg-muted)' }}>Status: {data.applicationStatus}</p>
            </div>
          </section>
        )}

        {data.state === 'completed' && data.passed && (
          <section className="mt-8">
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Orcred Credential</h2>
            </div>
            <div
              className="p-8 border-2"
              style={{
                borderColor: 'var(--orange)',
                borderRadius: '2px',
                backgroundColor: 'var(--orange-tint)',
              }}
            >
              <h3 className="text-5xl font-bold mb-4" style={{ color: 'var(--orange)' }}>
                {data.score}
              </h3>
              <p style={{ color: 'var(--fg)' }} className="mb-6">
                Congratulations! You've earned your Orcred credential.
              </p>
              <div className="flex gap-4">
                <button className="btn-primary">Download Certificate</button>
                <button className="btn-secondary">Add to LinkedIn</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
