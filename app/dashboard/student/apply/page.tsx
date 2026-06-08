'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface ApplicationFormData {
  // Step 1
  full_name: string;
  email: string;
  linkedin_url: string;
  college: string;
  graduation_year: string;

  // Step 2
  project_name: string;
  tech_stack: string;
  github_url: string;
  loom_url: string;

  // Step 3
  build_decision_1: string;
  build_decision_2: string;
  build_decision_3: string;
  what_broke: string;
  ai_tools_used: string;

  // Step 4
  availability_week_1: string[];
  availability_week_2: string[];
  timezone: string;
  terms_confirmed: boolean;
  recording_consent: boolean;
}

const STEPS = [
  { number: 1, label: 'Personal Details' },
  { number: 2, label: 'Project Details' },
  { number: 3, label: 'Deep Dive' },
  { number: 4, label: 'Schedule & Payment' },
];

// Mock pre-filled data
const MOCK_PROFILE = {
  full_name: 'Pragathii',
  email: 'pragathii@example.com',
  linkedin_url: 'https://linkedin.com/in/pragathii',
  college: 'Indian Institute of Technology',
  graduation_year: '2025',
};

const MOCK_PROJECT = {
  project_name: 'Real-time Collaborative Document Editor',
  tech_stack: 'React, Node.js, WebSocket, MongoDB',
  github_url: 'https://github.com/pragathii/doc-editor',
  loom_url: 'https://loom.com/share/xxx',
};

export default function ApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ApplicationFormData>({
    // Step 1
    full_name: MOCK_PROFILE.full_name,
    email: MOCK_PROFILE.email,
    linkedin_url: MOCK_PROFILE.linkedin_url,
    college: MOCK_PROFILE.college,
    graduation_year: MOCK_PROFILE.graduation_year,

    // Step 2
    project_name: MOCK_PROJECT.project_name,
    tech_stack: MOCK_PROJECT.tech_stack,
    github_url: MOCK_PROJECT.github_url,
    loom_url: MOCK_PROJECT.loom_url,

    // Step 3
    build_decision_1: '',
    build_decision_2: '',
    build_decision_3: '',
    what_broke: '',
    ai_tools_used: '',

    // Step 4
    availability_week_1: [],
    availability_week_2: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    terms_confirmed: false,
    recording_consent: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
      if (!formData.linkedin_url.trim()) newErrors.linkedin_url = 'LinkedIn URL is required';
    }

    if (currentStep === 2) {
      if (!formData.github_url.trim()) newErrors.github_url = 'GitHub URL is required';
      if (!formData.loom_url.trim()) newErrors.loom_url = 'Loom URL is required';
    }

    if (currentStep === 3) {
      if (!formData.build_decision_1.trim()) newErrors.build_decision_1 = 'This field is required';
      if (!formData.build_decision_2.trim()) newErrors.build_decision_2 = 'This field is required';
      if (!formData.build_decision_3.trim()) newErrors.build_decision_3 = 'This field is required';
      if (!formData.what_broke.trim()) newErrors.what_broke = 'This field is required';
      if (!formData.ai_tools_used.trim()) newErrors.ai_tools_used = 'Please declare AI tools used';
    }

    if (currentStep === 4) {
      if (!formData.terms_confirmed) newErrors.terms = 'Please confirm the terms';
      if (!formData.recording_consent) newErrors.recording = 'Please consent to recording';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      // Step 1: update profile
      await api.student.updateProfile({
        full_name: formData.full_name,
        linkedin_url: formData.linkedin_url,
        college: formData.college,
        graduation_year: formData.graduation_year,
      });

      // Step 2: submit application
      await api.student.createApplication({
        project_name: formData.project_name,
        tech_stack: formData.tech_stack,
        github_url: formData.github_url,
        loom_url: formData.loom_url,
        build_decision_1: formData.build_decision_1,
        build_decision_2: formData.build_decision_2,
        build_decision_3: formData.build_decision_3,
        what_broke: formData.what_broke,
        ai_tools_used: formData.ai_tools_used,
        availability_week_1: formData.availability_week_1,
        availability_week_2: formData.availability_week_2,
        timezone: formData.timezone,
        terms_confirmed: formData.terms_confirmed,
        recording_consent: formData.recording_consent,
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrors({ submit: err?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
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
              Orcred
            </h1>
          </div>
        </header>

        <main className="max-w-container mx-auto p-6 lg:p-10 flex items-center justify-center min-h-[500px]">
          <div
            className="max-w-md p-8 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '2px',
              border: '2px solid',
              borderColor: 'var(--orange)',
            }}
          >
            <h2
              style={{
                fontSize: '48px',
                color: 'var(--orange)',
                marginBottom: '16px',
                fontWeight: '600',
              }}
            >
              ✓
            </h2>
            <h3 className="text-h2 mb-2" style={{ color: 'var(--fg)' }}>
              Application Submitted!
            </h3>
            <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
              Thank you for applying. You'll hear from us within 3-5 business days.
            </p>
            <button
              onClick={() => router.push('/dashboard/student')}
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
                width: '100%',
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </main>
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
            className="mb-4 text-sm hover:opacity-70"
          >
            ← Back
          </button>
          <h1 className="text-h1 mb-2" style={{ color: 'var(--orange)' }}>
            Apply for Verification
          </h1>
          <p style={{ color: 'var(--fg-muted)' }}>Step {currentStep} of 4</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-container mx-auto p-6 lg:p-10">
        {/* Progress Steps */}
        <div className="mb-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {STEPS.map((step) => (
              <div
                key={step.number}
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: step.number <= currentStep ? 'var(--orange)' : 'var(--bg-alt)',
                    borderRadius: '2px',
                    marginBottom: '8px',
                  }}
                />
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: step.number <= currentStep ? 'var(--orange)' : 'var(--fg-muted)',
                  }}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div
                  style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                  className="w-3 h-3"
                />
                <h2 className="text-h2">Personal Details</h2>
              </div>

              {/* Full Name */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.full_name ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                  }}
                />
                {errors.full_name && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-alt)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: 'var(--border)',
                    color: 'var(--fg-muted)',
                  }}
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  LinkedIn URL *
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.linkedin_url ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                  }}
                />
                {errors.linkedin_url && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.linkedin_url}
                  </p>
                )}
              </div>

              {/* College & Year (Read-only) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      color: 'var(--orange)',
                      fontSize: '10px',
                      fontWeight: '500',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                    }}
                  >
                    College
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    disabled
                    className="w-full px-4 py-3"
                    style={{
                      backgroundColor: 'var(--bg-alt)',
                      borderRadius: '2px',
                      border: '1px solid',
                      borderColor: 'var(--border)',
                      color: 'var(--fg-muted)',
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      color: 'var(--orange)',
                      fontSize: '10px',
                      fontWeight: '500',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.graduation_year}
                    disabled
                    className="w-full px-4 py-3"
                    style={{
                      backgroundColor: 'var(--bg-alt)',
                      borderRadius: '2px',
                      border: '1px solid',
                      borderColor: 'var(--border)',
                      color: 'var(--fg-muted)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div
                  style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                  className="w-3 h-3"
                />
                <h2 className="text-h2">Project Details</h2>
              </div>

              {/* Project Name (Read-only) */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.project_name}
                  disabled
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-alt)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: 'var(--border)',
                    color: 'var(--fg-muted)',
                  }}
                />
              </div>

              {/* Tech Stack (Read-only) */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  disabled
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-alt)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: 'var(--border)',
                    color: 'var(--fg-muted)',
                  }}
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.github_url ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                  }}
                />
                {errors.github_url && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.github_url}
                  </p>
                )}
              </div>

              {/* Loom URL */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Loom Walkthrough URL *
                </label>
                <input
                  type="url"
                  value={formData.loom_url}
                  onChange={(e) => handleInputChange('loom_url', e.target.value)}
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.loom_url ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                  }}
                />
                {errors.loom_url && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.loom_url}
                  </p>
                )}
                <p style={{ color: 'var(--fg-faint)', fontSize: '12px', marginTop: '8px' }}>
                  Your Loom should be 8-12 minutes. Walk through what the system does, why you chose your stack, one decision you would change and why.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Deep Dive */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div
                  style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                  className="w-3 h-3"
                />
                <h2 className="text-h2">Deep Dive</h2>
              </div>

              {/* Decision 1 */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Most Important Architectural Decision *
                </label>
                <textarea
                  value={formData.build_decision_1}
                  onChange={(e) => handleInputChange('build_decision_1', e.target.value)}
                  placeholder="What was the most important architectural decision you made and why"
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.build_decision_1 ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
                {errors.build_decision_1 && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.build_decision_1}
                  </p>
                )}
              </div>

              {/* Decision 2 */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  What Didn't Work *
                </label>
                <textarea
                  value={formData.build_decision_2}
                  onChange={(e) => handleInputChange('build_decision_2', e.target.value)}
                  placeholder="What did you try that did not work and what did you do instead"
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.build_decision_2 ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
                {errors.build_decision_2 && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.build_decision_2}
                  </p>
                )}
              </div>

              {/* Decision 3 */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  What You'd Change *
                </label>
                <textarea
                  value={formData.build_decision_3}
                  onChange={(e) => handleInputChange('build_decision_3', e.target.value)}
                  placeholder="If you were to rebuild this from scratch what would you do differently"
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.build_decision_3 ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
                {errors.build_decision_3 && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.build_decision_3}
                  </p>
                )}
              </div>

              {/* What Broke */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Something That Broke *
                </label>
                <textarea
                  value={formData.what_broke}
                  onChange={(e) => handleInputChange('what_broke', e.target.value)}
                  placeholder="Describe one thing that broke during development and how you fixed it"
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.what_broke ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
                {errors.what_broke && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.what_broke}
                  </p>
                )}
              </div>

              {/* AI Tools */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  AI Tools Used *
                </label>
                <textarea
                  value={formData.ai_tools_used}
                  onChange={(e) => handleInputChange('ai_tools_used', e.target.value)}
                  placeholder="Which AI tools did you use and for what specifically. Be honest and specific."
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: '2px',
                    border: '1px solid',
                    borderColor: errors.ai_tools_used ? '#ba1a1a' : 'var(--border)',
                    color: 'var(--fg)',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
                {errors.ai_tools_used && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px', marginTop: '4px' }}>
                    {errors.ai_tools_used}
                  </p>
                )}
                <p style={{ color: 'var(--fg-faint)', fontSize: '12px', marginTop: '8px' }}>
                  Be specific and honest. Using AI tools is fine. Claiming you didn't when you did is grounds for disqualification.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Schedule & Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div
                  style={{ backgroundColor: 'var(--orange)', borderRadius: '50px' }}
                  className="w-3 h-3"
                />
                <h2 className="text-h2">Schedule & Payment</h2>
              </div>

              {/* Timezone */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
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

              {/* Availability Week 1 */}
              <div>
                <label
                  className="block mb-2"
                  style={{
                    color: 'var(--orange)',
                    fontSize: '10px',
                    fontWeight: '500',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}
                >
                  Availability Week 1
                </label>
                <p style={{ color: 'var(--fg-muted)', fontSize: '12px', marginBottom: '8px' }}>
                  Select 3 preferred time slots
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    'Monday 10:00 AM',
                    'Tuesday 2:00 PM',
                    'Wednesday 10:00 AM',
                    'Thursday 3:00 PM',
                  ].map((slot) => (
                    <label
                      key={slot}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        backgroundColor: formData.availability_week_1.includes(slot)
                          ? 'var(--orange-tint)'
                          : 'transparent',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.availability_week_1.includes(slot)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('availability_week_1', [
                              ...formData.availability_week_1,
                              slot,
                            ]);
                          } else {
                            handleInputChange(
                              'availability_week_1',
                              formData.availability_week_1.filter((s) => s !== slot)
                            );
                          }
                        }}
                      />
                      <span style={{ color: 'var(--fg)', fontSize: '14px' }}>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <label
                  style={{
                    display: 'flex',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.terms_confirmed}
                    onChange={(e) => handleInputChange('terms_confirmed', e.target.checked)}
                  />
                  <span style={{ color: 'var(--fg)' }}>
                    I confirm I built this project and can defend every decision I made
                  </span>
                </label>
                {errors.terms && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px' }}>{errors.terms}</p>
                )}

                <label
                  style={{
                    display: 'flex',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.recording_consent}
                    onChange={(e) => handleInputChange('recording_consent', e.target.checked)}
                  />
                  <span style={{ color: 'var(--fg)' }}>
                    I consent to this session being recorded for quality control purposes
                  </span>
                </label>
                {errors.recording && (
                  <p style={{ color: '#ba1a1a', fontSize: '12px' }}>{errors.recording}</p>
                )}
              </div>

              {/* Payment Widget */}
              <div
                className="p-6 border-2"
                style={{
                  borderColor: 'var(--orange)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--orange-tint)',
                  marginTop: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: 'clamp(16px, 1.8vw, 24px)',
                    fontWeight: '500',
                    color: 'var(--orange)',
                    marginBottom: '16px',
                  }}
                >
                  Payment
                </h3>
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: '2px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--fg)' }}>Verification Fee</span>
                    <span style={{ color: 'var(--orange)', fontWeight: '600' }}>₹1,999</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--fg)', fontWeight: '500' }}>Total</span>
                    <span style={{ fontSize: '18px', color: 'var(--orange)', fontWeight: '600' }}>
                      ₹1,999
                    </span>
                  </div>
                </div>
                <p style={{ color: 'var(--fg-muted)', fontSize: '12px', marginBottom: '16px' }}>
                  Payment will be processed via Razorpay (UPI, Cards, Net Banking supported)
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid',
              borderColor: 'var(--border)',
            }}
          >
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              style={{
                backgroundColor: 'transparent',
                color: currentStep === 1 ? 'var(--fg-faint)' : 'var(--fg)',
                borderRadius: '50px',
                padding: '10px 24px',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                border: '1px solid',
                borderColor: currentStep === 1 ? 'var(--border)' : 'var(--fg)',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) =>
                currentStep > 1 && (e.currentTarget.style.opacity = '0.6')
              }
              onMouseLeave={(e) =>
                currentStep > 1 && (e.currentTarget.style.opacity = '1')
              }
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
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
                  flex: 1,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Next
              </button>
            ) : (
              <>
                {errors.submit && (
                  <p style={{ color: '#ba1a1a', fontSize: '13px', width: '100%', textAlign: 'center', marginBottom: '8px' }}>
                    {errors.submit}
                  </p>
                )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
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
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  flex: 1,
                  opacity: submitting ? 0.6 : 1,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => !submitting && (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => !submitting && (e.currentTarget.style.opacity = '1')}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
