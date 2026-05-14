import React from 'react';
import { useGridStore } from '../store';
import { useCooldown } from '../hooks/useCooldown';

export const Sidebar: React.FC = () => {
  const leaderboard = useGridStore((s) => s.leaderboard);
  const onlineCount  = useGridStore((s) => s.onlineCount);
  const myUserId     = useGridStore((s) => s.myUserId);
  const myUsername   = useGridStore((s) => s.myUsername);
  const myColor      = useGridStore((s) => s.myColor);
  const { onCooldown, remainingMs, progress } = useCooldown();

  const myEntry = leaderboard.find((e) => e.id === myUserId);
  const myRank  = myEntry ? leaderboard.indexOf(myEntry) + 1 : null;

  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      overflowY: 'auto',
      background: '#1c1917',
      borderLeft: '1px solid #2e2b28',
    }}>

      {/* ── You ───────────────────────────────────────────────── */}
      <section style={{ padding: '16px 16px 12px' }}>
        <div className="label" style={{ marginBottom: 10 }}>you</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 3,
            background: myColor,
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontWeight: 600, color: '#e2ddd8', fontSize: 14 }}>{myUsername}</div>
            {myEntry && (
              <div className="mono" style={{ fontSize: 12, color: '#78716c' }}>
                #{myRank} · {myEntry.score} cell{myEntry.score !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* cooldown bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: '#57534e', letterSpacing: '0.04em' }}>cooldown</span>
            {onCooldown && (
              <span className="mono" style={{ fontSize: 11, color: '#f59e0b' }}>
                {(remainingMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
          <div style={{
            height: 3,
            background: '#2e2b28',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(1 - progress) * 100}%`,
              background: onCooldown ? '#f59e0b' : '#4ade80',
              transition: 'width 0.05s linear',
              borderRadius: 2,
            }} />
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Leaderboard ───────────────────────────────────────── */}
      <section style={{ padding: '12px 16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="label" style={{ marginBottom: 10 }}>
          leaderboard
          <span style={{ float: 'right', color: '#3a3530', fontWeight: 400 }}>
            {onlineCount} online
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto', flex: 1 }}>
          {leaderboard.length === 0 && (
            <p style={{ fontSize: 12, color: '#3a3530', marginTop: 8 }}>
              no captures yet
            </p>
          )}
          {leaderboard.slice(0, 20).map((entry, i) => {
            const isMe = entry.id === myUserId;
            return (
              <div
                key={entry.id}
                id={`lb-${entry.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 3,
                  background: isMe ? 'rgba(245,158,11,0.07)' : 'transparent',
                  borderLeft: isMe ? `2px solid #f59e0b` : '2px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                {/* rank */}
                <span className="mono" style={{
                  fontSize: 11,
                  width: 18,
                  color: i === 0 ? '#fbbf24' : i === 1 ? '#a8a29e' : i === 2 ? '#cd7c2e' : '#3a3530',
                  flexShrink: 0,
                  textAlign: 'right',
                }}>
                  {i + 1}
                </span>

                {/* color chip */}
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: 1,
                  background: entry.color,
                  flexShrink: 0,
                }} />

                {/* name */}
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: isMe ? 600 : 400,
                  color: isMe ? '#e2ddd8' : '#a8a29e',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {entry.username}
                </span>

                {/* score */}
                <span className="mono" style={{ fontSize: 12, color: '#57534e', flexShrink: 0 }}>
                  {entry.score}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="divider" />

      {/* ── Footer ────────────────────────────────────────────── */}
      <div style={{ padding: '10px 16px', fontSize: 11, color: '#3a3530' }}>
        click a cell to capture it · 2s cooldown
      </div>
    </aside>
  );
};
