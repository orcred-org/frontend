'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

const ease = [0.22, 1, 0.36, 1] as const;

interface StudentProfile {
  id: string; full_name: string; email: string;
  college: string; graduation_year: number; linkedin_url: string;
}

function Field({
  id, label, children, hint,
}: { id: string; label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '8px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#eb4511' }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: '11px', color: 'rgba(15,13,12,0.38)', marginTop: '6px', lineHeight: 1.6 }}>{hint}</p>}
    </div>
  );
}

const inputStyle = (disabled = false): React.CSSProperties => ({
  width: '100%', padding: '11px 14px',
  backgroundColor: disabled ? 'rgba(15,13,12,0.04)' : '#fff',
  border: '1.5px solid rgba(15,13,12,0.14)',
  color: disabled ? 'rgba(15,13,12,0.4)' : '#0f0d0c',
  fontSize: '14px', fontFamily: 'Inter, system-ui, sans-serif',
  outline: 'none', cursor: disabled ? 'not-allowed' : 'text',
  borderRadius: 0,
});

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [saved,    setSaved]    = useState(false);

  const [fullName,        setFullName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [college,         setCollege]         = useState('');
  const [graduationYear,  setGraduationYear]  = useState('');
  const [linkedinUrl,     setLinkedinUrl]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.student.profile() as any;
        const d: StudentProfile = res?.data ?? res;
        setFullName(d.full_name || '');
        setEmail(d.email || '');
        setCollege(d.college || '');
        setGraduationYear(d.graduation_year ? String(d.graduation_year) : '');
        setLinkedinUrl(d.linkedin_url || '');
      } catch (e: any) {
        if (e?.status === 401) router.push('/dashboard/auth');
        else setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const completion = Math.round(
    [fullName, college, graduationYear, linkedinUrl].filter(f => f?.trim()).length / 4 * 100
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.student.updateProfile({
        full_name: fullName,
        college,
        graduation_year: parseInt(graduationYear),
        linkedin_url: linkedinUrl,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '8px', height: '8px', backgroundColor: '#eb4511' }} />
        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.38)' }}>Loading</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>

      {/* ── Top nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        borderBottom: '1px solid rgba(15,13,12,0.1)',
        backgroundColor: 'rgba(250,247,242,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 42 42" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="21" cy="21" r="20" fill="#eb4511"/>
            </svg>
            <span style={{ paddingLeft: '7px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', color: '#0f0d0c', whiteSpace: 'nowrap' }}>Orcred</span>
          </Link>
          <Link href="/dashboard/student"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500, fontSize: '14px', letterSpacing: '-0.01em', color: '#4a4440', textDecoration: 'none' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0f0d0c')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#4a4440')}
          >← Dashboard</Link>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 32px 96px' }}>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Left: heading + completion ── */}
          <div className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '20px', height: '1px', backgroundColor: '#eb4511' }} />
                <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#eb4511' }}>
                  Your Profile
                </span>
              </div>
              <div style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#0f0d0c', marginBottom: '28px' }}>
                Complete your profile.
              </div>

              {/* Completion */}
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.45)' }}>Completion</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#eb4511', fontVariantNumeric: 'tabular-nums' }}>{completion}%</span>
              </div>
              <div style={{ height: '2px', backgroundColor: 'rgba(15,13,12,0.08)', overflow: 'hidden', marginBottom: '24px' }}>
                <motion.div
                  style={{ height: '100%', backgroundColor: '#eb4511' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {completion === 100 ? (
                <div style={{ padding: '18px', border: '1px solid rgba(235,69,17,0.2)', backgroundColor: 'rgba(235,69,17,0.03)' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#eb4511', marginBottom: '8px' }}>Profile complete</div>
                  <p style={{ fontSize: '12px', color: 'rgba(15,13,12,0.55)', lineHeight: 1.75, marginBottom: '16px' }}>
                    You're all set. Head back to your dashboard to apply for verification.
                  </p>
                  <Link href="/dashboard/student"
                    style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 22px', backgroundColor: '#eb4511', color: '#fff', borderRadius: '50px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.15s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'rgba(15,13,12,0.48)', lineHeight: 1.8 }}>
                  Fill in all fields to unlock your application.
                </p>
              )}
            </motion.div>
          </div>

          {/* ── Right: form ── */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
          >
            {error && (
              <div style={{ padding: '14px 18px', backgroundColor: '#ffdad6', color: '#ba1a1a', fontSize: '13px', marginBottom: '24px', borderLeft: '3px solid #ba1a1a' }}>
                {error}
              </div>
            )}
            {saved && (
              <div style={{ padding: '14px 18px', backgroundColor: 'rgba(235,69,17,0.06)', color: '#eb4511', fontSize: '13px', marginBottom: '24px', borderLeft: '3px solid #eb4511' }}>
                Profile saved.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field id="fullName" label="Full Name">
                    <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name" required style={inputStyle()}
                      onFocus={e => (e.currentTarget.style.borderColor = '#eb4511')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(15,13,12,0.14)')}
                    />
                  </Field>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Field id="email" label="Email Address" hint="Tied to your account — cannot be changed.">
                    <input id="email" type="email" value={email} disabled style={inputStyle(true)} />
                  </Field>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Field id="college" label="College / University">
                    <input id="college" type="text" value={college} onChange={e => setCollege(e.target.value)}
                      placeholder="Your college or university" required style={inputStyle()}
                      onFocus={e => (e.currentTarget.style.borderColor = '#eb4511')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(15,13,12,0.14)')}
                    />
                  </Field>
                </div>

                <div>
                  <Field id="graduation" label="Graduation Year">
                    <select id="graduation" value={graduationYear} onChange={e => setGraduationYear(e.target.value)}
                      required style={{ ...inputStyle(), cursor: 'pointer' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#eb4511')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(15,13,12,0.14)')}
                    >
                      <option value="">Select year</option>
                      {[2024,2025,2026,2027,2028,2029,2030].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Field id="linkedin" label="LinkedIn URL" hint="Required to apply for verification.">
                    <input id="linkedin" type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile" style={inputStyle()}
                      onFocus={e => (e.currentTarget.style.borderColor = '#eb4511')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(15,13,12,0.14)')}
                    />
                  </Field>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(15,13,12,0.08)', marginBottom: '24px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', padding: '10px 32px',
                    backgroundColor: '#eb4511', color: '#fff', borderRadius: '50px',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1, transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={e => !saving && (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = saving ? '0.6' : '1')}
                >
                  {saving ? 'Saving…' : 'Save Profile'}
                </button>
                {completion < 100 && (
                  <span style={{ fontSize: '11px', color: 'rgba(15,13,12,0.38)' }}>
                    {4 - [fullName,college,graduationYear,linkedinUrl].filter(f=>f?.trim()).length} field{4 - [fullName,college,graduationYear,linkedinUrl].filter(f=>f?.trim()).length !== 1 ? 's' : ''} remaining
                  </span>
                )}
              </div>
            </form>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
