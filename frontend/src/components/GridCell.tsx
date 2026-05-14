/**
 * GridCell — one cell on the board.
 *
 * Memoized so only cells that actually changed re-render.
 * Animation is kept minimal: a quick scale on click, nothing more.
 */
import React, { useCallback, useState } from 'react';
import type { Cell as CellType } from '../types';

interface Props {
  x: number;
  y: number;
  cell: CellType | undefined;
  isMe: boolean;
  onCapture: (x: number, y: number) => void;
  cellSize: number;
}

export const GridCell: React.FC<Props> = React.memo(({ x, y, cell, isMe, onCapture, cellSize }) => {
  const [flash, setFlash] = useState(false);
  const claimed = !!cell;

  const handleClick = useCallback(() => {
    onCapture(x, y);
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  }, [x, y, onCapture]);

  const bg = claimed
    ? flash ? `${cell.color}cc` : cell.color
    : flash ? '#2e2b28' : '#1a1816';

  return (
    <div
      onClick={handleClick}
      title={claimed ? `${cell.ownerName}` : ''}
      style={{
        width: cellSize,
        height: cellSize,
        background: bg,
        border: `1px solid ${claimed ? `${cell.color}55` : '#242220'}`,
        borderRadius: 2,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.12s, transform 0.08s',
        transform: flash ? 'scale(0.88)' : 'scale(1)',
        // my cells get a small dot in the center
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isMe && (
        <div style={{
          width: Math.max(2, cellSize * 0.22),
          height: Math.max(2, cellSize * 0.22),
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}, (prev, next) => (
  prev.cell?.updatedAt === next.cell?.updatedAt &&
  prev.isMe === next.isMe &&
  prev.cellSize === next.cellSize
));

GridCell.displayName = 'GridCell';
