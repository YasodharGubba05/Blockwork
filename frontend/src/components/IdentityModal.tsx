import React, { useState } from 'react';

const COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
  '#00bcd4', '#ff5722', '#8bc34a', '#607d8b',
];

interface Props {
  onConfirm: (username: string, color: string) => void;
}

export const IdentityModal: React.FC<Props> = ({ onConfirm }) => {
  const [username, setUsername] = useState('');
  const [color, setColor] = useState(COLORS[5]);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.trim();
    if (name.length < 2) {
      setError('at least 2 characters');
      return;
    }
    onConfirm(name, color);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#131110',
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          padding: '32px',
          background: '#1c1917',
          border: '1px solid #2e2b28',
          borderRadius: 6,
          margin: 16,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            {/* Simple 2x2 grid icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="7" height="7" fill="#f59e0b" rx="1"/>
              <rect x="10" y="1" width="7" height="7" fill="#3a3530" rx="1"/>
              <rect x="1" y="10" width="7" height="7" fill="#3a3530" rx="1"/>
              <rect x="10" y="10" width="7" height="7" fill="#f59e0b" rx="1" opacity="0.5"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#e2ddd8' }}>Grid Capture</span>
          </div>
          <p style={{ color: '#57534e', fontSize: 13 }}>
            Pick a name and a color, then click cells to claim them.
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div>
            <label className="label" htmlFor="username-input">Your name</label>
            <input
              id="username-input"
              className="field"
              type="text"
              placeholder="e.g. alice"
              value={username}
              maxLength={20}
              autoFocus
              autoComplete="off"
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
            />
            {error && (
              <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>↑ {error}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="label">Your color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  id={`color-${c.slice(1)}`}
                  onClick={() => setColor(c)}
                  title={c}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: c,
                    border: color === c ? '2px solid #e2ddd8' : '2px solid transparent',
                    borderRadius: 3,
                    cursor: 'pointer',
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: 2,
                    transition: 'transform 0.1s',
                    transform: color === c ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: '#111009',
            borderRadius: 4,
            border: '1px solid #2e2b28',
          }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: 2,
              background: color,
              flexShrink: 0,
            }} />
            <span style={{ color: '#a8a29e', fontSize: 13, fontFamily: 'monospace' }}>
              {username || 'your_name'}
            </span>
          </div>

          <button id="join-btn" type="submit" className="btn" style={{ width: '100%' }}>
            Join →
          </button>
        </form>
      </div>
    </div>
  );
};
