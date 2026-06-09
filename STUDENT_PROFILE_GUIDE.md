# Student Profile Page - Build Guide

## Overview

**Route:** `/dashboard/student/profile`

**What it does:**
- Show student's profile information
- Let them edit: Full name, College, Graduation year, LinkedIn URL
- Show completion percentage (must be 100% to apply)
- Save changes to backend

**Fields:**
- **Full Name** (editable, required)
- **Email** (read-only, tied to auth)
- **College Name** (editable, required)
- **Graduation Year** (dropdown, required)
- **LinkedIn URL** (editable, optional but required for application)
- **Completion %** (read-only, calculated)

---

## Design System Constraints

- **Colors:** Use CSS variables (--bg-page, --orange, etc.)
- **No dark mode:** Ever
- **Buttons:** Orange pill shape (50px border-radius)
- **Cards:** Sharp 2px border only
- **Typography:** Inter font, use clamp() for sizing
- **Spacing:** 8px base unit (px-6, py-8, etc.)

---

## Project Structure

Create these files:

```
app/dashboard/student/
├── page.tsx                    (main dashboard home)
├── profile/
│   └── page.tsx               (profile form - NEW)
└── layout.tsx                 (optional, student-specific layout)
```

---

## Step 1: Create Profile Page

**File:** `/Users/pragathii/frontend/app/dashboard/student/profile/page.tsx`

**Template:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  college: string;
  graduation_year: number;
  linkedin_url: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.student.profile();
        setProfile(data);
        setFullName(data.full_name || '');
        setEmail(data.email);
        setCollege(data.college || '');
        setGraduationYear(String(data.graduation_year) || '');
        setLinkedinUrl(data.linkedin_url || '');
      } catch (err: any) {
        if (err.status === 401) {
          router.push('/dashboard/auth');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Calculate completion percentage
  const calculateCompletion = (): number => {
    const fields = [fullName, college, graduationYear, linkedinUrl];
    const filled = fields.filter(f => f && f.trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.student.updateProfile({
        full_name: fullName,
        college,
        graduation_year: parseInt(graduationYear),
        linkedin_url: linkedinUrl,
      });

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <p style={{ color: 'var(--fg-muted)' }}>Loading profile...</p>
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
        <div className="max-w-container mx-auto">
          <button
            onClick={() => router.back()}
            style={{ color: 'var(--fg-muted)' }}
            className="mb-4 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-h1 mb-2" style={{ color: 'var(--fg)' }}>
            Your Profile
          </h1>
          <p style={{ color: 'var(--fg-muted)' }}>
            Complete your profile to apply for verification
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-container mx-auto p-6 lg:p-10">
        <div className="max-w-2xl">
          {/* Completion Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label style={{ color: 'var(--fg)', fontSize: '14px', fontWeight: '500' }}>
                Profile Completion
              </label>
              <span style={{ color: 'var(--orange)', fontSize: '14px', fontWeight: '600' }}>
                {completion}%
              </span>
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-alt)',
                borderRadius: '2px',
                height: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--orange)',
                  height: '100%',
                  width: `${completion}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            {completion < 100 && (
              <p style={{ color: 'var(--fg-faint)', fontSize: '12px', marginTop: '8px' }}>
                Complete all fields to apply for verification
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-4 mb-6"
              style={{
                backgroundColor: '#ffdad6',
                borderRadius: '2px',
                color: '#ba1a1a',
              }}
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              className="p-4 mb-6"
              style={{
                backgroundColor: 'var(--orange-tint)',
                borderRadius: '2px',
                color: 'var(--orange)',
              }}
            >
              {success}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-label mb-2"
                style={{ color: 'var(--orange)' }}
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label
                htmlFor="email"
                className="block text-label mb-2"
                style={{ color: 'var(--orange)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3"
                style={{
                  backgroundColor: 'var(--bg-alt)',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-muted)',
                  cursor: 'not-allowed',
                }}
              />
              <p style={{ color: 'var(--fg-faint)', fontSize: '12px', marginTop: '6px' }}>
                Your email is tied to your account and cannot be changed
              </p>
            </div>

            {/* College */}
            <div>
              <label
                htmlFor="college"
                className="block text-label mb-2"
                style={{ color: 'var(--orange)' }}
              >
                College Name
              </label>
              <input
                id="college"
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Your college or university"
                required
                className="w-full px-4 py-3"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label
                htmlFor="graduation"
                className="block text-label mb-2"
                style={{ color: 'var(--orange)' }}
              >
                Graduation Year
              </label>
              <select
                id="graduation"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                required
                className="w-full px-4 py-3"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select graduation year</option>
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label
                htmlFor="linkedin"
                className="block text-label mb-2"
                style={{ color: 'var(--orange)' }}
              >
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              />
              <p style={{ color: 'var(--fg-faint)', fontSize: '12px', marginTop: '6px' }}>
                Required to apply for verification
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving || completion < 100}
                className="w-full btn-primary"
                style={{
                  opacity: saving ? 0.6 : completion < 100 ? 0.5 : 1,
                  cursor: completion < 100 ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {completion < 100 && (
                <p style={{ color: 'var(--fg-faint)', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>
                  Complete all fields to save
                </p>
              )}
            </div>
          </form>

          {/* Application CTA */}
          {completion === 100 && (
            <div
              className="mt-8 p-6 border-2"
              style={{
                borderColor: 'var(--orange)',
                borderRadius: '2px',
                backgroundColor: 'var(--orange-tint)',
              }}
            >
              <h3 className="text-h3 mb-2" style={{ color: 'var(--orange)' }}>
                Profile Complete!
              </h3>
              <p style={{ color: 'var(--fg)' }} className="mb-4">
                You're ready to apply for verification. Generate a project idea or apply with your own.
              </p>
              <button
                onClick={() => router.push('/dashboard/student')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
```

---

## Step 2: Update Student Dashboard Home

Add link to profile page in `/Users/pragathii/frontend/app/dashboard/student/page.tsx`:

```typescript
// In the header section, add profile link:
<header className="border-b p-6" style={{ ... }}>
  <div className="max-w-container mx-auto flex justify-between items-start">
    <div>
      <h1>Orcred</h1>
      <p>Welcome back, {data.name}</p>
    </div>
    <button
      onClick={() => router.push('/dashboard/student/profile')}
      className="btn-secondary"
    >
      Edit Profile
    </button>
  </div>
</header>
```

---

## Step 3: Backend API Endpoints

The profile endpoints should already exist:
- `GET /api/v1/student/profile` — fetch profile
- `PUT /api/v1/student/profile` — update profile

These are already in `/lib/api.ts`.

---

## Testing Checklist

- [ ] Page loads at `/dashboard/student/profile`
- [ ] Form fields show (full name, college, graduation year, LinkedIn)
- [ ] Email field is read-only
- [ ] Completion percentage shows and updates as you type
- [ ] Button is disabled if completion < 100%
- [ ] Can save profile (watch backend logs)
- [ ] Success message shows after save
- [ ] Completion is 100% when all fields filled
- [ ] Can navigate back to dashboard
- [ ] Link in dashboard home goes to profile

---

## What It Teaches You

✅ Form handling in React  
✅ Controlled inputs  
✅ API integration (fetch + save)  
✅ Validation and conditional rendering  
✅ Loading/saving states  
✅ Design system implementation  
✅ Error handling  

---

## Next After This

Once profile works:
1. Build Student Dashboard home (show real data)
2. Build Project Generator UI
3. Build Application Form (4 steps)
