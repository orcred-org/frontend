'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import DemoWalkthroughWindow from '@/components/admin/DemoWalkthroughWindow';
import {
  BACKEND_STAGE_ORDER,
  DEMO_WALKTHROUGH_STEPS,
} from '@/lib/demoWalkthroughSteps';

const FONT = 'Inter, system-ui, sans-serif';
const BORDER = '1px solid rgba(15,13,12,0.1)';

export default function PlatformDemoPanel() {
  const [walkStep, setWalkStep] = useState(0);
  const [walkStarted, setWalkStarted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState('');

  const syncToStage = async (targetStage: string) => {
    try {
      let res = await api.admin.demoStatus() as { data?: { stage: string } };
      let current = res?.data?.stage ?? 'idle';

      if (targetStage === 'idle') return;

      const targetIdx = BACKEND_STAGE_ORDER.indexOf(targetStage as typeof BACKEND_STAGE_ORDER[number]);
      const currentIdx = BACKEND_STAGE_ORDER.indexOf(current as typeof BACKEND_STAGE_ORDER[number]);
      if (targetIdx < 0) return;
      if (currentIdx >= 0 && targetIdx <= currentIdx) return;

      if (current === 'idle' && targetIdx >= 1) {
        await api.admin.demoAction('start');
        res = await api.admin.demoStatus() as { data?: { stage: string } };
        current = res?.data?.stage ?? 'student_registered';
      }

      let guard = 0;
      while (current !== targetStage && guard < 15) {
        await api.admin.demoAction('advance');
        res = await api.admin.demoStatus() as { data?: { stage: string } };
        current = res?.data?.stage ?? current;
        guard += 1;
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Backend sync failed — course preview still works');
    }
  };

  const syncStepsInBackground = (fromIndex: number, toIndex: number) => {
    if (toIndex <= fromIndex) return;
    setSyncing(true);
    void (async () => {
      try {
        for (let i = fromIndex; i < toIndex; i += 1) {
          const leaving = DEMO_WALKTHROUGH_STEPS[i];
          if (leaving?.backendStage) {
            await syncToStage(leaving.backendStage);
          }
        }
      } finally {
        setSyncing(false);
      }
    })();
  };

  const handleStepChange = (nextIndex: number) => {
    const prev = walkStep;
    setWalkStep(nextIndex);
    if (nextIndex > prev) {
      syncStepsInBackground(prev, nextIndex);
    }
  };

  const startWalkthrough = async () => {
    setActing(true);
    setError('');
    try {
      await api.admin.demoAction('reset');
    } catch {
      /* UI-only mode ok */
    }
    setWalkStep(0);
    setWalkStarted(true);
    setActing(false);
  };

  const resetAll = async () => {
    if (!confirm('Restart the course from the beginning?')) return;
    setSyncing(true);
    try {
      await api.admin.demoAction('reset');
      setWalkStep(0);
      setError('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Reset failed');
    } finally {
      setSyncing(false);
    }
  };

  if (!walkStarted) {
    return (
      <div style={{
        fontFamily: FONT,
        flex: 1,
        width: '100%',
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          background: '#fff',
          border: BORDER,
          padding: '56px 48px',
          textAlign: 'center',
          width: '100%',
          maxWidth: 560,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#eb4511', margin: '0 0 12px' }}>
            Platform course
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Full product walkthrough
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(15,13,12,0.55)', margin: '0 0 32px', lineHeight: 1.7 }}>
            {DEMO_WALKTHROUGH_STEPS.length} screens — waitlist through credential, with live UI previews for sessions, reviewer flow, and verify page.
            Continue is instant; demo data saves in the background.
          </p>
          <button
            type="button"
            onClick={startWalkthrough}
            disabled={acting}
            style={{
              padding: '14px 36px',
              fontSize: 15,
              fontWeight: 600,
              background: '#eb4511',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: acting ? 'wait' : 'pointer',
              fontFamily: FONT,
            }}
          >
            {acting ? 'Starting…' : 'Begin course →'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: FONT,
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
    }}>
      <DemoWalkthroughWindow
        stepIndex={walkStep}
        onStepIndexChange={handleStepChange}
        syncing={syncing}
        onReset={resetAll}
        error={error}
      />
    </div>
  );
}
