'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentDashboardData {
  full_name: string;
  email: string;
  state: 'new' | 'has_idea' | 'applied' | 'scheduled' | 'completed';
  project?: {
    name: string;
    tech_stack: string;
    difficulty: number;
  };
  application?: {
    id: string;
    submitted_at: string;
    payment_at?: string;
    reviewer_assigned_at?: string;
    session_date?: string;
    score?: {
      total: number;
      technical_depth: number;
      communication: number;
      reproducibility: number;
      originality: number;
      passed: boolean;
    };
  };
}

const PROGRESS_STEPS = [
  { label: 'Submitted', key: 'submitted' },
  { label: 'Payment Confirmed', key: 'payment' },
  { label: 'Reviewer Assigned', key: 'reviewer' },
  { label: 'Review Scheduled', key: 'scheduled' },
  { label: 'Completed', key: 'completed' },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/student/dashboard', {
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
        <p style={{ color: 'var(--fg-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
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
            onClick={() => router.reload()}
            style={{
              backgroundColor: 'var(--orange)',
              color: '#ffffff',
              borderRadius: '50px',
              padding: '10px 24px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              marginTop: '24px',
              width: '100%',
            }}
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
            <p style={{ color: 'var(--fg-muted)' }}>Welcome back, {data.full_name}</p>
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
        {/* STATE 1: NEW - No Project */}
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
              <p style={{ color: 'var(--fg)', lineHeight: '1.75' }} className="mb-6">
                Not sure what to build? Let our AI help you generate a project idea tailored to your experience level.
              </p>
              <button
                style={{
                  backgroundColor: 'var(--orange)',
                  color: '#ffffff',
                  borderRadius: '50px',
                  padding: '10px 24px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Generate Project Idea
              </button>
            </div>
          </section>
        )}

        {/* STATE 2: HAS IDEA - Project Saved */}
        {data.state === 'has_idea' && data.project && (
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
                {data.project.name}
              </h3>
              <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
                {data.project.tech_stack}
              </p>
              <div className="flex gap-4">
                <button
                  style={{
                    backgroundColor: 'var(--orange)',
                    color: '#ffffff',
                    borderRadius: '50px',
                    padding: '10px 24px',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Apply for Verification
                </button>
                <button
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
                  Generate New Idea
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STATE 3: APPLIED - Progress Tracker */}
        {data.state === 'applied' && data.application && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Application Status</h2>
            </div>

            {/* Progress Tracker */}
            <div
              className="p-6 border mb-8"
              style={{
                borderColor: 'var(--border)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {PROGRESS_STEPS.map((step, index) => (
                  <div key={step.key} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        margin: '0 auto 12px',
                        borderRadius: '50px',
                        backgroundColor:
                          index === 0 ? 'var(--orange)' : index < 3 ? 'var(--orange-tint)' : 'var(--bg-alt)',
                        border: index === 3 ? '2px solid var(--orange)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: index === 0 ? '#ffffff' : 'var(--fg)',
                      }}
                    >
                      {index + 1}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: index <= 0 ? 'var(--orange)' : 'var(--fg-muted)',
                      }}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Info */}
            <div
              className="p-6 border"
              style={{
                borderColor: 'var(--border)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <h3
                style={{
                  marginBottom: '16px',
                  fontSize: 'clamp(16px, 1.8vw, 24px)',
                  fontWeight: '500',
                  color: 'var(--fg)',
                }}
              >
                Timeline
              </h3>
              <div style={{ space: '12px' }}>
                <p style={{ color: 'var(--fg-muted)', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--fg)' }}>Submitted:</strong>{' '}
                  {new Date(data.application.submitted_at).toLocaleDateString('en-IN')}
                </p>
                {data.application.payment_at && (
                  <p style={{ color: 'var(--fg-muted)', marginBottom: '8px' }}>
                    <strong style={{ color: 'var(--fg)' }}>Payment Confirmed:</strong>{' '}
                    {new Date(data.application.payment_at).toLocaleDateString('en-IN')}
                  </p>
                )}
                <p style={{ color: 'var(--fg-muted)' }}>
                  <strong style={{ color: 'var(--fg)' }}>Expected timeline:</strong> 3-5 business days for reviewer
                  assignment
                </p>
              </div>
            </div>
          </section>
        )}

        {/* STATE 4: SCHEDULED - Session Details */}
        {data.state === 'scheduled' && data.application?.session_date && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Your Review is Scheduled</h2>
            </div>

            <div
              className="p-8 border-2 mb-8"
              style={{
                borderColor: 'var(--orange)',
                borderRadius: '2px',
                backgroundColor: 'var(--orange-tint)',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--fg-muted)',
                  marginBottom: '8px',
                }}
              >
                Review scheduled for
              </p>
              <h3
                style={{
                  fontSize: 'clamp(22px, 2.8vw, 36px)',
                  fontWeight: '600',
                  color: 'var(--orange)',
                  marginBottom: '24px',
                }}
              >
                {new Date(data.application.session_date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <button
                style={{
                  backgroundColor: 'var(--orange)',
                  color: '#ffffff',
                  borderRadius: '50px',
                  padding: '10px 24px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Join Session
              </button>
            </div>

            {/* Prep Checklist */}
            <div
              className="p-6 border"
              style={{
                borderColor: 'var(--border)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <h3
                style={{
                  marginBottom: '16px',
                  fontSize: 'clamp(16px, 1.8vw, 24px)',
                  fontWeight: '500',
                  color: 'var(--fg)',
                }}
              >
                Prep Checklist
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  'Have your GitHub repository open',
                  'Have your Loom walkthrough ready to replay',
                  'Be prepared to explain every decision you made',
                  'Test your internet connection',
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}>
                    <span style={{ color: 'var(--orange)', fontWeight: '600' }}>✓</span>
                    <span style={{ color: 'var(--fg-muted)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* STATE 5: COMPLETED - Score & Credential */}
        {data.state === 'completed' && data.application?.score && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">
                {data.application.score.passed ? 'Orcred Credential' : 'Review Complete'}
              </h2>
            </div>

            {/* Score */}
            <div
              className="p-8 border-2 mb-8"
              style={{
                borderColor: 'var(--orange)',
                borderRadius: '2px',
                backgroundColor: 'var(--orange-tint)',
              }}
            >
              <h3
                style={{
                  fontSize: '64px',
                  fontWeight: '600',
                  color: 'var(--orange)',
                  lineHeight: '1',
                  marginBottom: '16px',
                }}
              >
                {data.application.score.total}
              </h3>
              <p style={{ color: 'var(--fg)', fontSize: '16px', marginBottom: '24px' }}>
                {data.application.score.passed
                  ? "Congratulations! You've earned your Orcred credential."
                  : 'Thank you for your submission. Keep improving!'}
              </p>
              {data.application.score.passed && (
                <div className="flex gap-4">
                  <button
                    style={{
                      backgroundColor: 'var(--orange)',
                      color: '#ffffff',
                      borderRadius: '50px',
                      padding: '10px 24px',
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Download Certificate
                  </button>
                  <button
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
                    Add to LinkedIn
                  </button>
                </div>
              )}
            </div>

            {/* Dimension Scores */}
            <div
              className="p-6 border"
              style={{
                borderColor: 'var(--border)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <h3
                style={{
                  marginBottom: '24px',
                  fontSize: 'clamp(16px, 1.8vw, 24px)',
                  fontWeight: '500',
                  color: 'var(--fg)',
                }}
              >
                Dimension Breakdown
              </h3>
              <div style={{ space: '16px' }}>
                {[
                  { label: 'Technical Depth', score: data.application.score.technical_depth, weight: 35 },
                  { label: 'Communication', score: data.application.score.communication, weight: 25 },
                  { label: 'Reproducibility', score: data.application.score.reproducibility, weight: 20 },
                  { label: 'Originality', score: data.application.score.originality, weight: 20 },
                ].map((dim) => (
                  <div key={dim.label} style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <p style={{ color: 'var(--fg)', fontSize: '14px', fontWeight: '500' }}>
                        {dim.label}
                      </p>
                      <p style={{ color: 'var(--orange)', fontSize: '14px', fontWeight: '600' }}>
                        {dim.score}/100 ({dim.weight}%)
                      </p>
                    </div>
                    <div
                      style={{
                        backgroundColor: 'var(--bg-alt)',
                        borderRadius: '2px',
                        height: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--orange)',
                          height: '100%',
                          width: `${dim.score}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
