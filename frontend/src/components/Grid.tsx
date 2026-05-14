import React, { useCallback, useMemo } from 'react';
import { useGridStore } from '../store';
import { socket } from '../socket';
import { GridCell } from './GridCell';
import { useCooldown } from '../hooks/useCooldown';

const GAP = 2;

export const Grid: React.FC = () => {
  const cells     = useGridStore((s) => s.cells);
  const gridSize  = useGridStore((s) => s.gridSize);
  const myUserId  = useGridStore((s) => s.myUserId);
  const { onCooldown } = useCooldown();

  const cellSize = useMemo(() => {
    // Use the available area minus the sidebar (240) and some padding
    const w = Math.min(window.innerWidth - 240 - 48, window.innerHeight - 48 - 80);
    return Math.max(10, Math.floor((w - gridSize * GAP) / gridSize));
  }, [gridSize]);

  const handleCapture = useCallback((x: number, y: number) => {
    if (onCooldown) return;
    socket.emit('capture_cell', { x, y });
  }, [onCooldown]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      overflow: 'auto',
    }}>
      {/* cooldown notice — subtle, not a banner */}
      <div style={{
        height: 20,
        marginBottom: 8,
        fontSize: 12,
        color: onCooldown ? '#f59e0b' : 'transparent',
        fontFamily: 'monospace',
        transition: 'color 0.15s',
        userSelect: 'none',
      }}>
        {onCooldown ? '⟳ cooldown active' : '·'}
      </div>

      {/* The board */}
      <div
        id="game-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
          gap: GAP,
          background: '#111009',
          border: '1px solid #2e2b28',
          borderRadius: 4,
          padding: 6,
        }}
      >
        {Array.from({ length: gridSize }, (_, y) =>
          Array.from({ length: gridSize }, (_, x) => {
            const key = `${x}_${y}`;
            const cell = cells.get(key);
            return (
              <GridCell
                key={key}
                x={x}
                y={y}
                cell={cell}
                isMe={!!myUserId && cell?.ownerId === myUserId}
                onCapture={handleCapture}
                cellSize={cellSize}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
