'use client';

import { useState } from 'react';

interface Application {
  id: string;
  student_name: string;
  project_name: string;
  status: string;
  submitted_date: string;
  payment_status: string;
  reviewer?: string;
  score?: number;
}

const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    student_name: 'Student One',
    project_name: 'Real-time Collaborative Editor',
    status: 'awaiting_reviewer',
    submitted_date: '2026-06-01',
    payment_status: 'confirmed',
  },
  {
    id: '2',
    student_name: 'Student Two',
    project_name: 'ML Resume Scorer',
    status: 'scheduled',
    submitted_date: '2026-06-02',
    payment_status: 'confirmed',
    reviewer: 'Reviewer Name',
  },
  {
    id: '3',
    student_name: 'Student Three',
    project_name: 'Cache System',
    status: 'completed',
    submitted_date: '2026-06-03',
    payment_status: 'confirmed',
    reviewer: 'Reviewer Name',
    score: 75,
  },
];

const MOCK_ANALYTICS = {
  total_applications: 45,
  pass_rate: 42,
  avg_score: 68,
  this_month_revenue: 89955,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'reviewers'>('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredApps =
    filterStatus === 'all'
      ? MOCK_APPLICATIONS
      : MOCK_APPLICATIONS.filter((app) => app.status === filterStatus);

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
          <h1 className="text-h1 mb-2" style={{ color: 'var(--orange)' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--fg-muted)' }}>
            Platform management & analytics
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div
        style={{
          borderBottom: '1px solid',
          borderColor: 'var(--border)',
          backgroundColor: 'var(--bg-card)',
          padding: '0 24px',
        }}
      >
        <div className="max-w-container mx-auto flex gap-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'applications', label: 'Applications' },
            { key: 'reviewers', label: 'Reviewers' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '16px 0',
                borderBottom: activeTab === tab.key ? '2px solid var(--orange)' : 'none',
                color: activeTab === tab.key ? 'var(--orange)' : 'var(--fg-muted)',
                fontSize: '14px',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-container mx-auto p-6 lg:p-10">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Analytics</h2>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { label: 'Total Applications', value: MOCK_ANALYTICS.total_applications, unit: '' },
                { label: 'Pass Rate', value: MOCK_ANALYTICS.pass_rate, unit: '%' },
                { label: 'Average Score', value: MOCK_ANALYTICS.avg_score, unit: '/100' },
                { label: 'Revenue (This Month)', value: `₹${MOCK_ANALYTICS.this_month_revenue}`, unit: '' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 border"
                  style={{
                    borderColor: 'var(--border)',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <p style={{ color: 'var(--fg-muted)', fontSize: '12px', marginBottom: '8px' }}>
                    {stat.label}
                  </p>
                  <h3
                    style={{
                      fontSize: '36px',
                      fontWeight: '600',
                      color: 'var(--orange)',
                      lineHeight: '1',
                    }}
                  >
                    {stat.value}
                    <span style={{ fontSize: '18px', marginLeft: '4px' }}>
                      {stat.unit}
                    </span>
                  </h3>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                  className="w-3 h-3"
                />
                <h3
                  style={{
                    fontSize: 'clamp(16px, 1.8vw, 24px)',
                    fontWeight: '500',
                    color: 'var(--fg)',
                  }}
                >
                  Recent Applications
                </h3>
              </div>

              <div className="space-y-4">
                {MOCK_APPLICATIONS.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-6 border"
                    style={{
                      borderColor: 'var(--border)',
                      borderRadius: '2px',
                      backgroundColor: 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h4 style={{ color: 'var(--fg)', fontWeight: '500' }}>
                        {app.student_name}
                      </h4>
                      <span
                        style={{
                          backgroundColor: 'var(--orange-tint)',
                          color: 'var(--orange)',
                          padding: '4px 8px',
                          borderRadius: '2px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--fg-muted)', fontSize: '12px' }}>
                      {app.project_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Applications</h2>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Status</option>
                <option value="awaiting_reviewer">Awaiting Reviewer</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Applications Table */}
            <div
              style={{
                border: '1px solid',
                borderColor: 'var(--border)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderBottom: '1px solid',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {['Student', 'Project', 'Status', 'Submitted', 'Payment', 'Score'].map(
                      (header) => (
                        <th
                          key={header}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--fg)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      style={{
                        borderBottom: '1px solid',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: 'var(--fg)' }}>
                        {app.student_name}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--fg)' }}>
                        {app.project_name}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            backgroundColor: 'var(--orange-tint)',
                            color: 'var(--orange)',
                            padding: '4px 8px',
                            borderRadius: '2px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--fg-muted)', fontSize: '12px' }}>
                        {new Date(app.submitted_date).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--fg)' }}>
                        {app.payment_status === 'confirmed' ? '✓' : '✗'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--fg)' }}>
                        {app.score ? `${app.score}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWERS TAB */}
        {activeTab === 'reviewers' && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                className="w-3 h-3"
              />
              <h2 className="text-h2">Reviewer Management</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  name: 'Reviewer One',
                  sessions: 12,
                  avg_score: 68,
                  rate: '42%',
                },
                {
                  name: 'Reviewer Two',
                  sessions: 8,
                  avg_score: 71,
                  rate: '50%',
                },
                {
                  name: 'Reviewer Three',
                  sessions: 5,
                  avg_score: 65,
                  rate: '40%',
                },
              ].map((reviewer, i) => (
                <div
                  key={i}
                  className="p-6 border"
                  style={{
                    borderColor: 'var(--border)',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ color: 'var(--fg)', fontWeight: '500' }}>
                      {reviewer.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--orange)',
                          border: '1px solid var(--orange)',
                          borderRadius: '50px',
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Message
                      </button>
                      <button
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--fg-muted)',
                          border: '1px solid var(--border)',
                          borderRadius: '50px',
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Suspend
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div>
                      <p style={{ color: 'var(--fg-muted)', fontSize: '12px', marginBottom: '4px' }}>
                        Sessions
                      </p>
                      <p style={{ color: 'var(--fg)', fontWeight: '600' }}>
                        {reviewer.sessions}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--fg-muted)', fontSize: '12px', marginBottom: '4px' }}>
                        Avg Score
                      </p>
                      <p style={{ color: 'var(--fg)', fontWeight: '600' }}>
                        {reviewer.avg_score}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--fg-muted)', fontSize: '12px', marginBottom: '4px' }}>
                        Pass Rate
                      </p>
                      <p style={{ color: 'var(--fg)', fontWeight: '600' }}>
                        {reviewer.rate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
