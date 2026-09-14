'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';

type Props = {
  onInvited?: () => void;
  /** Shorter layout for dashboard sidebar */
  compact?: boolean;
};

export default function ReviewerInviteForm({ onInvited, compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.admin.inviteReviewer({
        email: email.trim(),
        ...(fullName.trim() ? { full_name: fullName.trim() } : {}),
      }) as { data?: { email?: string; already_reviewer?: boolean } };

      const invitedEmail = res?.data?.email ?? email.trim();
      setMessage(
        res?.data?.already_reviewer
          ? `${invitedEmail} already has reviewer access. They can sign in with a magic link.`
          : `Reviewer access granted to ${invitedEmail}. They can sign in from the login page.`,
      );
      setEmail('');
      setFullName('');
      onInvited?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not grant reviewer access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="reviewer-invite-card"
      style={{
        padding: compact ? '16px 18px' : '22px 24px',
        borderRadius: 12,
        marginBottom: compact ? 0 : 20,
        background: 'linear-gradient(135deg, rgba(235,69,17,0.06) 0%, #fff 55%)',
        border: '2px solid rgba(235,69,17,0.22)',
        boxShadow: '0 4px 20px rgba(235,69,17,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: compact ? 12 : 16 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            borderRadius: 12,
            background: '#eb4511',
            fontSize: compact ? 20 : 24,
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(235,69,17,0.35)',
          }}
        >
          ✉️
        </span>
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: '0 0 6px',
              fontSize: compact ? 16 : 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#0f0d0c',
              textTransform: 'none',
            }}
          >
            Add a reviewer
          </h2>
          <p className="dash-muted" style={{ fontSize: compact ? 12 : 13, margin: 0, lineHeight: 1.55 }}>
            Enter their email to grant reviewer access. They sign in at the normal login page and land on the reviewer dashboard.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: compact ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: compact ? 'stretch' : 'flex-end',
        }}
      >
        <label style={{ flex: '1 1 200px', minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 6,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#0f0d0c',
            }}
          >
            Reviewer email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="reviewer@company.com"
            className="dash-input"
            style={{ width: '100%', marginTop: 0, fontSize: 14 }}
          />
        </label>
        {!compact && (
          <label style={{ flex: '1 1 160px', minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#0f0d0c',
              }}
            >
              Full name (optional)
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="dash-input"
              style={{ width: '100%', marginTop: 0, fontSize: 14 }}
            />
          </label>
        )}
        <button
          type="submit"
          disabled={loading}
          className="dash-btn dash-btn--primary"
          style={{
            flex: compact ? '1 1 auto' : '0 0 auto',
            minHeight: 44,
            padding: '0 22px',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {loading ? 'Granting access…' : 'Grant reviewer access'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 14, marginBottom: 0, fontSize: 13, color: '#007a4a', fontWeight: 500 }}>{message}</p>
      )}
      {error && (
        <p style={{ marginTop: 14, marginBottom: 0, fontSize: 13, color: '#ba1a1a', fontWeight: 500 }}>{error}</p>
      )}
    </div>
  );
}
