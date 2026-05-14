import React from 'react';
import { useGridStore } from '../store';

export const Header: React.FC = () => {
  const connected = useGridStore((s) => s.connected);
  const onlineCount = useGridStore((s) => s.onlineCount);
  const cells = useGridStore((s) => s.cells);
  const gridSize = useGridStore((s) => s.gridSize);

  const total = gridSize * gridSize;
  const claimed = cells.size;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: 48,
      background: '#1c1917',
      borderBottom: '1px solid #2e2b28',
      flexShrink: 0,
    }}>
      {/* Left: brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="0" y="0" width="6.5" height="6.5" fill="#f59e0b" rx="1"/>
          <rect x="9.5" y="0" width="6.5" height="6.5" fill="#3a3530" rx="1"/>
          <rect x="0" y="9.5" width="6.5" height="6.5" fill="#3a3530" rx="1"/>
          <rect x="9.5" y="9.5" width="6.5" height="6.5" fill="#f59e0b" rx="1" opacity="0.45"/>
        </svg>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#e2ddd8', letterSpacing: '-0.01em' }}>
          Grid Capture
        </span>
        <span style={{
          fontSize: 11,
          color: '#57534e',
          fontFamily: 'monospace',
          paddingLeft: 6,
          borderLeft: '1px solid #2e2b28',
          marginLeft: 2,
        }}>
          {gridSize}×{gridSize}
        </span>
      </div>

      {/* Middle: stats — only on wider screens */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 13, color: '#e2ddd8', fontWeight: 500 }}>
            {claimed}
            <span style={{ color: '#3a3530', margin: '0 2px' }}>/</span>
            <span style={{ color: '#57534e' }}>{total}</span>
          </div>
          <div style={{ fontSize: 10, color: '#57534e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>cells</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 13, color: '#e2ddd8', fontWeight: 500 }}>
            {total > 0 ? Math.round((claimed / total) * 100) : 0}%
          </div>
          <div style={{ fontSize: 10, color: '#57534e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>filled</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 13, color: '#e2ddd8', fontWeight: 500 }}>{onlineCount}</div>
          <div style={{ fontSize: 10, color: '#57534e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>online</div>
        </div>
      </div>

      {/* Right: connection */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: connected ? '#a3e6b8' : '#f87171',
      }}>
        <span style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: connected ? '#4ade80' : '#f87171',
          display: 'inline-block',
        }} />
        {connected ? 'live' : 'offline'}
      </div>
    </header>
  );
};
