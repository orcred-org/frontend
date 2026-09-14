'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import DemoScreenPreview from '@/components/admin/demo/DemoScreenPreviews';
import {
  DEMO_WALKTHROUGH_STEPS,
  type DemoWalkthroughField,
  type DemoWalkthroughStep,
} from '@/lib/demoWalkthroughSteps';

const FONT = 'Inter, system-ui, sans-serif';
const BORDER = '1px solid rgba(15,13,12,0.1)';

const PERSONA_COLORS: Record<DemoWalkthroughStep['persona'], string> = {
  student: '#eb4511',
  reviewer: '#005fa3',
  admin: '#7c3aed',
  public: '#007a4a',
};

const PERSONA_LABELS: Record<DemoWalkthroughStep['persona'], string> = {
  student: 'Student',
  reviewer: 'Reviewer',
  admin: 'Admin',
  public: 'Public',
};

interface DemoWalkthroughWindowProps {
  stepIndex: number;
  onStepIndexChange: (index: number) => void;
  syncing?: boolean;
  onReset?: () => void;
  error?: string;
}

export default function DemoWalkthroughWindow({
  stepIndex,
  onStepIndexChange,
  syncing,
  onReset,
  error,
}: DemoWalkthroughWindowProps) {
  const total = DEMO_WALKTHROUGH_STEPS.length;
  const progress = ((stepIndex + 1) / total) * 100;
  const current = DEMO_WALKTHROUGH_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  const go = (next: number) => {
    if (next < 0 || next >= total) return;
    onStepIndexChange(next);
  };

  return (
    <>
    <style>{`
      .demo-course-layout {
        display: flex;
        flex-direction: row;
        flex: 1;
        min-height: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
      .demo-course-sidebar {
        width: 280px;
        flex-shrink: 0;
        min-height: 0;
        overflow: hidden;
      }
      .demo-slide-viewport {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        position: relative;
      }
      .demo-slide-track {
        position: absolute;
        inset: 0;
        display: flex;
        height: 100%;
      }
      @media (max-width: 900px) {
        .demo-course-layout { flex-direction: column; }
        .demo-course-sidebar { width: 100%; max-height: 180px; border-right: none !important; border-bottom: 1px solid rgba(15,13,12,0.1); }
      }
    `}</style>
    <div className="demo-course-layout" style={{
      fontFamily: FONT,
      border: BORDER,
      borderRadius: 8,
      background: '#fff',
      boxShadow: '0 4px 24px rgba(15,13,12,0.05)',
    }}>
      <div className="demo-course-sidebar">
        <DemoStepSidebar stepIndex={stepIndex} onSelect={go} />
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
      }}>
        {/* Top bar */}
        <div style={{ padding: '14px clamp(16px, 3vw, 24px)', borderBottom: BORDER, flexShrink: 0, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#eb4511' }}>
                Orcred platform course
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: '#0f0d0c' }}>
                {current.subtitle.split(' · ')[0] ?? current.subtitle}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: 'rgba(15,13,12,0.45)', whiteSpace: 'nowrap' }}>
                {stepIndex + 1} / {total}
                {syncing && ' · saving…'}
              </span>
              {onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  disabled={syncing}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#ba1a1a',
                    background: 'transparent',
                    border: '1px solid rgba(186,26,26,0.3)',
                    borderRadius: 4,
                    padding: '5px 10px',
                    cursor: syncing ? 'not-allowed' : 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div style={{ height: 4, background: 'rgba(15,13,12,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#eb4511',
                borderRadius: 2,
                transition: 'width 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </div>
          {error && (
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#ba1a1a', lineHeight: 1.4 }}>
              {error}
            </p>
          )}
        </div>

        {/* Slide viewport — clipped; only SlideBody scrolls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div className="demo-slide-viewport">
            <div
              className="demo-slide-track"
              style={{
                width: `${total * 100}%`,
                transform: `translateX(-${(stepIndex * 100) / total}%)`,
                transition: 'transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {DEMO_WALKTHROUGH_STEPS.map((step, i) => (
                <div
                  key={step.id}
                  style={{
                    width: `${100 / total}%`,
                    height: '100%',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    overflow: 'hidden',
                  }}
                >
                  <SlideChrome step={step} />
                  <SlideBody step={step} active={i === stepIndex} />
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: BORDER,
            padding: '16px clamp(16px, 3vw, 32px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background: '#fff',
            flexShrink: 0,
          }}>
            <NavBtn label="← Previous" disabled={isFirst} onClick={() => go(stepIndex - 1)} />
            <span style={{ fontSize: 12, color: 'rgba(15,13,12,0.4)', textAlign: 'center', flex: 1 }}>
              {current.title}
            </span>
            <NavBtn
              label={isLast ? 'Finish course ✓' : 'Continue →'}
              primary
              onClick={() => go(stepIndex + 1)}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function DemoStepSidebar({
  stepIndex,
  onSelect,
}: {
  stepIndex: number;
  onSelect: (index: number) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [stepIndex]);

  let lastPersona: DemoWalkthroughStep['persona'] | null = null;

  return (
    <aside style={{
      width: '100%',
      height: '100%',
      borderRight: BORDER,
      background: '#faf7f2',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    }}>
      <div style={{ padding: '16px 18px 12px', borderBottom: BORDER, flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)' }}>
          Course outline
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(15,13,12,0.55)' }}>
          Step {stepIndex + 1} of {DEMO_WALKTHROUGH_STEPS.length}
          {stepIndex > 0 && ` · ${stepIndex} done`}
        </p>
      </div>

      <nav
        aria-label="Course steps"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 10px 16px',
        }}
      >
        {DEMO_WALKTHROUGH_STEPS.map((step, i) => {
          const showSection = step.persona !== lastPersona;
          lastPersona = step.persona;
          const isActive = i === stepIndex;
          const isDone = i < stepIndex;

          return (
            <div key={step.id}>
              {showSection && (
                <p style={{
                  margin: i === 0 ? '0 0 8px' : '16px 0 8px',
                  padding: '0 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: PERSONA_COLORS[step.persona],
                }}>
                  {PERSONA_LABELS[step.persona]}
                </p>
              )}
              <button
                ref={isActive ? activeRef : undefined}
                type="button"
                onClick={() => onSelect(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 10px',
                  marginBottom: 2,
                  border: isActive ? '1px solid rgba(235,69,17,0.35)' : '1px solid transparent',
                  borderRadius: 6,
                  background: isActive ? '#fff' : isDone ? 'rgba(0,122,74,0.06)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: FONT,
                  boxShadow: isActive ? '0 2px 8px rgba(15,13,12,0.06)' : 'none',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  background: isDone ? '#007a4a' : isActive ? '#eb4511' : 'rgba(15,13,12,0.08)',
                  color: isDone || isActive ? '#fff' : 'rgba(15,13,12,0.4)',
                }}>
                  {isDone ? '✓' : i + 1}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#0f0d0c' : isDone ? 'rgba(15,13,12,0.65)' : 'rgba(15,13,12,0.45)',
                    lineHeight: 1.35,
                  }}>
                    {step.title}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SlideChrome({ step }: { step: DemoWalkthroughStep }) {
  return (
    <div style={{
      background: '#0f0d0c',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
      </div>
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 6,
        padding: '6px 12px',
        fontSize: 12,
        color: 'rgba(255,255,255,0.65)',
        fontFamily: 'ui-monospace, monospace',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        orcred.app{step.route}
      </div>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#fff',
        background: PERSONA_COLORS[step.persona],
        padding: '3px 8px',
        borderRadius: 4,
        flexShrink: 0,
      }}>
        {step.persona}
      </span>
    </div>
  );
}

function SlideBody({ step, active }: { step: DemoWalkthroughStep; active: boolean }) {
  const isPreview = !!step.preview;

  return (
    <div
      style={{
        background: '#faf7f2',
        flex: 1,
        minHeight: 0,
        overflowY: active ? 'auto' : 'hidden',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
        padding: isPreview ? 'clamp(12px, 1.5vw, 20px)' : 'clamp(16px, 2vw, 28px) clamp(16px, 3vw, 40px)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: isPreview ? 920 : 680 }}>
        {!isPreview && (
          <>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 6px' }}>
              {step.subtitle}
            </p>
            <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 600, margin: '0 0 24px', letterSpacing: '-0.02em', color: '#0f0d0c' }}>
              {step.title}
            </h3>
          </>
        )}
        {isPreview && (
          <div style={{ marginBottom: step.fields.length ? 12 : 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,13,12,0.4)', margin: '0 0 4px' }}>
              {step.subtitle}
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 14px', letterSpacing: '-0.02em', color: '#0f0d0c' }}>
              {step.title}
            </h3>
          </div>
        )}
        {isPreview ? (
          <DemoScreenPreview id={step.preview!} variant={step.previewVariant} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step.fields.map((field) => (
              <DemoField key={`${step.id}-${field.label}`} field={field} />
            ))}
          </div>
        )}
        {isPreview && step.fields.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {step.fields.map((field) => (
              <DemoField key={`${step.id}-${field.label}`} field={field} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DemoField({ field }: { field: DemoWalkthroughField }) {
  const type = field.type ?? 'text';

  if (type === 'info') {
    return (
      <div style={{ padding: '12px 14px', background: 'rgba(0,95,163,0.06)', border: '1px solid rgba(0,95,163,0.15)', fontSize: 13, lineHeight: 1.6, color: 'rgba(15,13,12,0.7)' }}>
        <strong style={{ display: 'block', marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#005fa3' }}>{field.label}</strong>
        {field.value}
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div style={{ padding: '14px 16px', background: 'rgba(0,122,74,0.08)', border: '1px solid rgba(0,122,74,0.2)' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#007a4a' }}>{field.label}</p>
        <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.55, color: 'rgba(15,13,12,0.65)' }}>{field.value}</p>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'default' }}>
        <span style={{
          width: 18, height: 18, flexShrink: 0, marginTop: 2,
          background: '#007a4a', borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700,
        }}>✓</span>
        <span>
          <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0f0d0c', marginBottom: 2 }}>{field.label}</span>
          <span style={{ fontSize: 12, color: 'rgba(15,13,12,0.5)' }}>{field.value}</span>
        </span>
      </label>
    );
  }

  if (type === 'chips') {
    const tags = field.value.split(',').map((t) => t.trim()).filter(Boolean);
    return (
      <FieldShell label={field.label} hint={field.hint}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {tags.map((tag) => (
            <span key={tag} style={{ fontSize: 12, fontWeight: 600, padding: '5px 10px', background: 'rgba(235,69,17,0.12)', color: '#eb4511', borderRadius: 4 }}>
              {tag}
            </span>
          ))}
        </div>
      </FieldShell>
    );
  }

  if (type === 'payment') {
    return (
      <FieldShell label={field.label} hint={field.hint}>
        <div style={{ marginTop: 6, padding: '12px 14px', background: '#fff', border: '1px solid rgba(15,13,12,0.12)', fontSize: 20, fontWeight: 600 }}>
          {field.value}
        </div>
      </FieldShell>
    );
  }

  if (type === 'textarea') {
    return (
      <FieldShell label={field.label} hint={field.hint}>
        <div style={filledBoxStyle(true)}>{field.value}</div>
      </FieldShell>
    );
  }

  return (
    <FieldShell label={field.label} hint={field.hint}>
      <div style={filledBoxStyle(false)}>{field.value}</div>
    </FieldShell>
  );
}

function FieldShell({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#eb4511', marginBottom: 4 }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: 'rgba(15,13,12,0.38)', marginTop: 6, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

function filledBoxStyle(multiline: boolean): CSSProperties {
  return {
    marginTop: 4,
    padding: '10px 12px',
    background: '#fff',
    border: '1.5px solid rgba(15,13,12,0.14)',
    fontSize: 14,
    lineHeight: 1.55,
    color: '#0f0d0c',
    whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
    overflow: multiline ? 'visible' : 'hidden',
    textOverflow: multiline ? undefined : 'ellipsis',
  };
}

function NavBtn({ label, onClick, disabled, primary }: { label: string; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        fontSize: 13,
        fontWeight: 600,
        minWidth: primary ? 140 : 110,
        background: primary ? '#eb4511' : '#fff',
        color: primary ? '#fff' : '#0f0d0c',
        border: primary ? 'none' : BORDER,
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}
