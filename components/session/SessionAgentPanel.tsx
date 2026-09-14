'use client';

import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';

export type AgentFocus =
  | 'opening'
  | 'technical_depth'
  | 'communication'
  | 'reproducibility'
  | 'problem_solving'
  | 'follow_up'
  | 'red_flags';

const FOCUS_CHIPS: { value: AgentFocus | ''; label: string; icon: string }[] = [
  { value: '', label: 'Balanced', icon: '◎' },
  { value: 'opening', label: 'Opening', icon: '→' },
  { value: 'technical_depth', label: 'Technical', icon: '⌁' },
  { value: 'communication', label: 'Comms', icon: '◈' },
  { value: 'reproducibility', label: 'Repro', icon: '↻' },
  { value: 'problem_solving', label: 'Problem', icon: '✦' },
  { value: 'follow_up', label: 'Follow-up', icon: '…' },
  { value: 'red_flags', label: 'Flags', icon: '!' },
];

const QUICK_PROMPTS: { label: string; icon: string; focus?: AgentFocus | ''; action?: 'feedback' }[] = [
  { label: 'Balanced questions', icon: '◎', focus: '' },
  { label: 'Opening probe', icon: '→', focus: 'opening' },
  { label: 'Technical depth', icon: '⌁', focus: 'technical_depth' },
  { label: 'Red flags', icon: '!', focus: 'red_flags' },
  { label: 'Draft feedback', icon: '✎', action: 'feedback' },
];

type ChatMessage =
  | { id: string; role: 'assistant'; kind: 'text'; text: string }
  | {
      id: string;
      role: 'assistant';
      kind: 'questions';
      questions: string[];
      coachingTip?: string;
      probeAreas?: string[];
    }
  | {
      id: string;
      role: 'assistant';
      kind: 'feedback';
      draft: string;
      highlights?: string[];
    }
  | { id: string; role: 'user'; text: string };

interface SessionAgentPanelProps {
  assignmentId: string;
  sessionNotes: string;
  disabled?: boolean;
  onApplyFeedbackDraft?: (draft: string) => void;
}

function msgId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#1a1a2e',
          color: '#fff',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        ✦
      </div>
      <div
        style={{
          padding: '10px 14px',
          background: '#f3f0ea',
          borderRadius: '14px 14px 14px 4px',
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(15,13,12,0.28)',
              animation: `agentDot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes agentDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function SessionAgentPanel({
  assignmentId,
  sessionNotes,
  disabled,
  onApplyFeedbackDraft,
}: SessionAgentPanelProps) {
  const [focus, setFocus] = useState<AgentFocus | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [quickOpen, setQuickOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      kind: 'text',
      text: 'I can suggest up to 3 Socratic questions per request, or draft feedback from your notes. Use quick prompts, pick a focus, or type below.',
    },
  ]);
  const threadRef = useRef<HTMLDivElement>(null);

  const notesHint = sessionNotes.trim()
    ? `Using ${Math.min(sessionNotes.trim().length, 4000)} chars of your notes`
    : 'Tip: add notes in the Notes tab for sharper suggestions';

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, error]);

  const appendUser = (text: string) => {
    setMessages((prev) => [...prev, { id: msgId(), role: 'user', text }]);
  };

  const suggest = async (
    nextFocus: AgentFocus | '' = focus,
    userLabel?: string,
    customMessage?: string,
  ) => {
    setFocus(nextFocus);
    setLoading(true);
    setError('');
    const chip = FOCUS_CHIPS.find((c) => c.value === nextFocus);
    const display =
      userLabel ??
      customMessage ??
      (chip?.label ? `Suggest ${chip.label.toLowerCase()} questions` : 'Suggest questions');
    appendUser(display);

    try {
      const res = (await api.session.agentSuggest({
        assignment_id: assignmentId,
        mode: 'questions',
        ...(nextFocus ? { focus: nextFocus } : {}),
        ...(sessionNotes.trim() ? { session_notes: sessionNotes.trim() } : {}),
        ...(customMessage?.trim() ? { user_message: customMessage.trim() } : {}),
      })) as {
        data?: { questions: string[]; probe_areas: string[]; coaching_tip: string };
      };

      if (!res.data?.questions?.length) throw new Error('No questions returned');

      setMessages((prev) => [
        ...prev,
        {
          id: msgId(),
          role: 'assistant',
          kind: 'questions',
          questions: res.data!.questions.slice(0, 3),
          probeAreas: res.data!.probe_areas ?? [],
          coachingTip: res.data!.coaching_tip ?? '',
        },
      ]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not get suggestions — try again.');
    } finally {
      setLoading(false);
    }
  };

  const draftFeedback = async () => {
    setLoading(true);
    setError('');
    appendUser('Draft feedback from my notes');

    try {
      const res = (await api.session.agentSuggest({
        assignment_id: assignmentId,
        mode: 'feedback_draft',
        ...(sessionNotes.trim() ? { session_notes: sessionNotes.trim() } : {}),
      })) as {
        data?: { draft: string; highlights: string[] };
      };

      if (!res.data?.draft?.trim()) throw new Error('No draft returned');

      setMessages((prev) => [
        ...prev,
        {
          id: msgId(),
          role: 'assistant',
          kind: 'feedback',
          draft: res.data!.draft,
          highlights: res.data!.highlights ?? [],
        },
      ]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not draft feedback — try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(key);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const closeComposerCollapsibles = () => {
    setQuickOpen(false);
    setFocusOpen(false);
  };

  const runQuickPrompt = (prompt: (typeof QUICK_PROMPTS)[number]) => {
    if (disabled || loading) return;
    closeComposerCollapsibles();
    if (prompt.action === 'feedback') {
      void draftFeedback();
      return;
    }
    void suggest(prompt.focus ?? '', prompt.label);
  };

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text || disabled || loading) return;
    closeComposerCollapsibles();
    setChatInput('');
    void suggest(focus, text, text);
  };

  return (
    <div className="session-agent-panel">
      {/* Chat header */}
      <div className="session-agent-header">
        <div className="session-agent-header-inner">
          <span className="session-agent-avatar" aria-hidden>✦</span>
          <div>
            <p className="session-agent-title">Review copilot</p>
            <p className="session-agent-subtitle">{notesHint}</p>
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div ref={threadRef} className="session-agent-thread">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '9px 12px',
                    background: '#eb4511',
                    color: '#fff',
                    borderRadius: '14px 14px 4px 14px',
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.kind === 'text') {
            return (
              <div key={msg.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#1a1a2e',
                    color: '#fff',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✦
                </div>
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '10px 12px',
                    background: '#fff',
                    border: '1px solid rgba(15,13,12,0.08)',
                    borderRadius: '4px 14px 14px 14px',
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: 'rgba(15,13,12,0.78)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.kind === 'questions') {
            return (
              <div key={msg.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#1a1a2e',
                    color: '#fff',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✦
                </div>
                <div style={{ maxWidth: '92%', flex: 1 }}>
                  <div
                    style={{
                      padding: '10px 12px',
                      background: '#fff',
                      border: '1px solid rgba(15,13,12,0.08)',
                      borderRadius: '4px 14px 14px 14px',
                    }}
                  >
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'rgba(15,13,12,0.45)' }}>
                      {msg.questions.length} questions
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {msg.questions.map((q, idx) => (
                        <div
                          key={`${msg.id}-q-${idx}`}
                          style={{
                            padding: '8px 10px',
                            background: '#faf7f2',
                            borderRadius: 8,
                            fontSize: 12,
                            lineHeight: 1.5,
                            color: '#0f0d0c',
                          }}
                        >
                          <span style={{ fontWeight: 700, marginRight: 6, color: '#1a1a2e' }}>{idx + 1}.</span>
                          {q}
                          <button
                            type="button"
                            onClick={() => copyText(q, `${msg.id}-${idx}`)}
                            style={{
                              display: 'block',
                              marginTop: 6,
                              padding: 0,
                              border: 'none',
                              background: 'none',
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#eb4511',
                              cursor: 'pointer',
                            }}
                          >
                            {copiedIdx === `${msg.id}-${idx}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(msg.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n'), `${msg.id}-all`)
                      }
                      style={{
                        marginTop: 8,
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#eb4511',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedIdx === `${msg.id}-all` ? '✓ Copied all' : 'Copy all'}
                    </button>
                  </div>
                  {msg.coachingTip && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '8px 10px',
                        background: 'rgba(184,121,0,0.08)',
                        borderRadius: 8,
                        borderLeft: '2px solid #9a6500',
                        fontSize: 11,
                        lineHeight: 1.5,
                        color: 'rgba(15,13,12,0.72)',
                      }}
                    >
                      <strong style={{ color: '#9a6500' }}>Coach tip · </strong>
                      {msg.coachingTip}
                    </div>
                  )}
                  {!!msg.probeAreas?.length && (
                    <p style={{ fontSize: 10, color: 'rgba(15,13,12,0.38)', margin: '6px 0 0', paddingLeft: 2 }}>
                      Probing: {msg.probeAreas.join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#1a1a2e',
                  color: '#fff',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ✦
              </div>
              <div style={{ maxWidth: '92%', flex: 1 }}>
                {!!msg.highlights?.length && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                    {msg.highlights.map((h) => (
                      <span
                        key={h}
                        style={{
                          fontSize: 10,
                          padding: '3px 8px',
                          background: 'rgba(0,122,74,0.1)',
                          borderRadius: 12,
                          color: '#007a4a',
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  style={{
                    padding: '10px 12px',
                    background: '#fff',
                    border: '1px solid rgba(15,13,12,0.08)',
                    borderRadius: '4px 14px 14px 14px',
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: '#0f0d0c',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.draft}
                </div>
                {onApplyFeedbackDraft && (
                  <button
                    type="button"
                    onClick={() => onApplyFeedbackDraft(msg.draft)}
                    style={{
                      marginTop: 8,
                      padding: '7px 12px',
                      background: '#007a4a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Use in Scores →
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && <TypingIndicator />}

        {error && (
          <div
            style={{
              margin: '4px 0 8px 36px',
              padding: '8px 10px',
              background: 'rgba(186,26,26,0.08)',
              borderRadius: 8,
              fontSize: 11,
              color: '#ba1a1a',
              lineHeight: 1.45,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="session-agent-composer">
        <div className="session-agent-quick-block">
          <button
            type="button"
            className="session-agent-quick-toggle"
            onClick={() => setQuickOpen((o) => !o)}
            aria-expanded={quickOpen}
          >
            <span>Quick prompts</span>
            <span className={`session-agent-quick-chevron${quickOpen ? ' session-agent-quick-chevron--open' : ''}`} aria-hidden>
              ›
            </span>
          </button>
          {quickOpen && (
            <div className="session-agent-quick-grid">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  disabled={disabled || loading}
                  onClick={() => runQuickPrompt(prompt)}
                  className="session-agent-quick-btn"
                >
                  <span className="session-agent-quick-icon" aria-hidden>{prompt.icon}</span>
                  {prompt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="session-agent-focus-block">
          <button
            type="button"
            className="session-agent-quick-toggle"
            onClick={() => setFocusOpen((o) => !o)}
            aria-expanded={focusOpen}
          >
            <span>Focus{focus ? `: ${FOCUS_CHIPS.find((c) => c.value === focus)?.label ?? focus}` : ''}</span>
            <span className={`session-agent-quick-chevron${focusOpen ? ' session-agent-quick-chevron--open' : ''}`} aria-hidden>
              ›
            </span>
          </button>
          {focusOpen && (
            <div className="session-agent-focus-row">
              {FOCUS_CHIPS.map((chip) => {
                const active = focus === chip.value;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={disabled || loading}
                    onClick={() => setFocus(chip.value)}
                    title={chip.label}
                    className={`session-agent-focus-chip${active ? ' session-agent-focus-chip--active' : ''}`}
                  >
                    <span aria-hidden>{chip.icon}</span>
                    {chip.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="session-agent-input-row">
          <textarea
            className="session-agent-input"
            rows={1}
            placeholder="Ask for questions… e.g. probe their database choices"
            value={chatInput}
            disabled={disabled || loading}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
              }
            }}
          />
          <button
            type="button"
            className="session-agent-send"
            disabled={disabled || loading || !chatInput.trim()}
            onClick={sendChatMessage}
            aria-label="Send message"
          >
            {loading ? '…' : '↑'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .session-agent-panel {
          display: flex;
          flex-direction: column;
          flex: 1;
          height: 100%;
          min-height: 0;
          background: #faf8f5;
        }
        .session-agent-header {
          flex-shrink: 0;
          padding: 8px 12px;
          background: #fff;
          border-bottom: 1px solid rgba(15, 13, 12, 0.08);
        }
        .session-agent-header-inner {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .session-agent-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(235, 69, 17, 0.1);
          color: #eb4511;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        .session-agent-title {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          color: #0f0d0c;
        }
        .session-agent-subtitle {
          margin: 0;
          font-size: 9.5px;
          color: rgba(15, 13, 12, 0.45);
          line-height: 1.35;
        }
        .session-agent-thread {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 4;
        }
        .session-agent-composer {
          flex-shrink: 0;
          padding: 8px 10px 10px;
          background: #fff;
          border-top: 1px solid rgba(15, 13, 12, 0.08);
        }
        .session-agent-quick-block,
        .session-agent-focus-block {
          margin-bottom: 4px;
        }
        .session-agent-quick-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 4px 2px;
          margin: 0 0 4px;
          border: none;
          background: none;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(15, 13, 12, 0.42);
          cursor: pointer;
        }
        .session-agent-quick-toggle:hover {
          color: rgba(15, 13, 12, 0.65);
        }
        .session-agent-quick-chevron {
          font-size: 14px;
          line-height: 1;
          transform: rotate(90deg);
          transition: transform 0.15s ease;
        }
        .session-agent-quick-chevron--open {
          transform: rotate(-90deg);
        }
        .session-agent-section-label {
          margin: 0 0 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(15, 13, 12, 0.38);
        }
        .session-agent-quick-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding-bottom: 4px;
        }
        .session-agent-quick-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.2;
          border-radius: 999px;
          border: 1px solid rgba(15, 13, 12, 0.1);
          background: #faf8f5;
          color: rgba(15, 13, 12, 0.78);
          cursor: pointer;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }
        .session-agent-quick-btn:hover:not(:disabled) {
          border-color: rgba(235, 69, 17, 0.35);
          background: #fff;
        }
        .session-agent-quick-btn:disabled {
          opacity: 0.45;
          cursor: default;
        }
        .session-agent-quick-icon {
          font-size: 10px;
          line-height: 1;
          color: #eb4511;
          flex-shrink: 0;
        }
        .session-agent-focus-row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding-bottom: 4px;
        }
        .session-agent-focus-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 9px;
          font-size: 10.5px;
          font-weight: 600;
          border-radius: 999px;
          border: 1px solid rgba(15, 13, 12, 0.1);
          background: #fff;
          color: rgba(15, 13, 12, 0.55);
          cursor: pointer;
          transition: border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease;
        }
        .session-agent-focus-chip--active {
          border-color: #eb4511;
          background: rgba(235, 69, 17, 0.08);
          color: #eb4511;
        }
        .session-agent-focus-chip:disabled {
          opacity: 0.45;
          cursor: default;
        }
        .session-agent-input-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .session-agent-input {
          flex: 1;
          min-width: 0;
          min-height: 36px;
          max-height: 72px;
          resize: none;
          padding: 8px 10px;
          font-family: inherit;
          font-size: 12.5px;
          line-height: 1.4;
          border-radius: 10px;
          border: 1px solid rgba(15, 13, 12, 0.12);
          background: #faf8f5;
          color: #0f0d0c;
        }
        .session-agent-input:focus {
          outline: none;
          border-color: rgba(235, 69, 17, 0.45);
          box-shadow: 0 0 0 3px rgba(235, 69, 17, 0.1);
          background: #fff;
        }
        .session-agent-input:disabled {
          opacity: 0.55;
        }
        .session-agent-send {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #eb4511, #c93a0e);
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(235, 69, 17, 0.35);
        }
        .session-agent-send:disabled {
          background: rgba(15, 13, 12, 0.08);
          color: rgba(15, 13, 12, 0.35);
          box-shadow: none;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
