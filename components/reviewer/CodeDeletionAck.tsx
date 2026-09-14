'use client';

interface CodeDeletionAckProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function CodeDeletionAck({
  checked,
  onChange,
  disabled = false,
  compact = false,
}: CodeDeletionAckProps) {
  return (
    <div
      style={{
        marginTop: compact ? 12 : 16,
        padding: compact ? 10 : 12,
        background: 'rgba(186,26,26,0.06)',
        border: '1px solid rgba(186,26,26,0.18)',
        borderRadius: 8,
      }}
    >
      <p
        style={{
          margin: '0 0 8px',
          fontSize: compact ? 11 : 12,
          lineHeight: 1.55,
          color: 'rgba(15,13,12,0.72)',
        }}
      >
        Delete all student code from your local machine and any cloned GitHub repositories used for this review.
        Do not retain copies for other purposes.
      </p>
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          fontSize: compact ? 11 : 12,
          fontWeight: 600,
          color: '#0f0d0c',
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        <span>I have deleted all student code from my devices</span>
      </label>
    </div>
  );
}
