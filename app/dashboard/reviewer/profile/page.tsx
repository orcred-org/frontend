'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useRequireReviewer } from '@/lib/useRequireReviewer';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { validateLinkedinUrl } from '@/lib/validators';
import { TIMEZONES } from '@/lib/form-constants';

const inputClass = 'dash-input';

export default function ReviewerProfilePage() {
  const router = useRouter();
  const { ready, signOut } = useRequireReviewer({ skipOnboarding: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [yearsExperience, setYearsExperience] = useState('5');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [expertise, setExpertise] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const res = await api.reviewer.profile() as { data?: Record<string, unknown> };
        const d = res?.data ?? {};
        setFullName(String(d.full_name ?? ''));
        setPhone(String(d.phone ?? ''));
        setEmail(String(d.email ?? ''));
        setCurrentCompany(String(d.current_company ?? ''));
        setCurrentRole(String(d.current_role ?? ''));
        setYearsExperience(d.years_experience != null ? String(d.years_experience) : '5');
        setLinkedinUrl(String(d.linkedin_url ?? ''));
        setExpertise(String(d.expertise ?? ''));
        setTimezone(String(d.timezone ?? 'Asia/Kolkata'));
        setOnboardingComplete(!!d.reviewer_onboarding_complete);
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) router.push('/dashboard/auth');
        else setError(e instanceof ApiError ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const linkedinErr = validateLinkedinUrl(linkedinUrl);
    if (linkedinErr) { setError(linkedinErr); return; }
    setSaving(true);
    setError('');
    try {
      await api.reviewer.updateProfile({
        full_name: fullName,
        phone: phone.trim(),
        current_company: currentCompany,
        current_role: currentRole,
        years_experience: parseInt(yearsExperience, 10),
        linkedin_url: linkedinUrl,
        expertise: expertise.trim() || undefined,
        timezone: timezone.trim() || undefined,
      });
      setSaved(true);
      setOnboardingComplete(true);
      setTimeout(() => router.push('/dashboard/reviewer'), 800);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!ready || loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  }

  return (
    <DashboardShell
      homeHref="/dashboard/reviewer"
      navItems={[
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard/reviewer' },
        { id: 'profile', label: 'Profile', href: '/dashboard/reviewer/profile', active: true },
      ]}
      userName={fullName || 'Reviewer'}
      userEmail={email}
      roleLabel="Reviewer"
      onSignOut={signOut}
      mainMaxWidth={480}
    >
        <h1 className="dash-page-title" style={{ margin: '0 0 8px' }}>Reviewer profile</h1>
        <p className="dash-muted" style={{ marginBottom: 24, lineHeight: 1.6 }}>
          Two minutes. We only need what matters for matching you with the right submissions.
        </p>
        {error && <p style={{ color: '#ba1a1a', marginBottom: 16 }}>{error}</p>}
        {saved && <p style={{ color: '#007a4a', marginBottom: 16 }}>Saved — you&apos;re ready to review.</p>}
        {!onboardingComplete && (
          <p style={{ fontSize: 12, padding: 12, background: 'rgba(235,69,17,0.08)', marginBottom: 16, color: '#eb4511' }}>
            Complete this once before your first assignment.
          </p>
        )}
        <form onSubmit={handleSave} className="dash-surface" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24 }}>
          <label>Full name<input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required /></label>
          <label>
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="9876543210 or +91 98765 43210"
              className={inputClass}
            />
          </label>
          <label>Email<input className={inputClass} value={email} disabled style={{ opacity: 0.6 }} /></label>
          <label>Current company<input className={inputClass} value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} required placeholder="e.g. Acme AI" /></label>
          <label>Current role<input className={inputClass} value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} required placeholder="e.g. Staff ML Engineer" /></label>
          <label>
            Years of experience
            <select className={inputClass} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)}>
              {[5, 6, 7, 8, 9, 10, 12, 15, 20].map((y) => (
                <option key={y} value={y}>{y}+ years</option>
              ))}
            </select>
          </label>
          <label>LinkedIn URL<input className={inputClass} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} required placeholder="https://linkedin.com/in/…" /></label>
          <label>
            Core expertise <span className="dash-muted" style={{ fontWeight: 400 }}>(optional, one line)</span>
            <input className={inputClass} value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="e.g. LLM systems, backend infra" />
          </label>
          <label>
            Timezone
            <input className={inputClass} list="tz-list" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            <datalist id="tz-list">{TIMEZONES.map((tz) => <option key={tz} value={tz} />)}</datalist>
          </label>
          <button type="submit" disabled={saving} className="dash-btn dash-btn--primary" style={{ marginTop: 8 }}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
    </DashboardShell>
  );
}
