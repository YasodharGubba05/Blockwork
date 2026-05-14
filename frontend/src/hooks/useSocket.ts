import { useEffect } from 'react';
import { socket } from '../socket';
import { useGridStore } from '../store';
import type {
  InitialGridPayload,
  CellUpdatedPayload,
  LeaderboardUpdatePayload,
  CaptureErrorPayload,
} from '../types';

export function useSocket(username: string, color: string) {
  const store = useGridStore();

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      store.setConnected(true);
      socket.emit('join_user', { username, color });
    });

    socket.on('disconnect', () => store.setConnected(false));
    socket.on('connect_error', () => store.setConnected(false));

    socket.on('initial_grid', (p: InitialGridPayload) => {
      store.setInitialGrid(p.grid, p.gridSize, p.userId, p.cooldownMs);
    });

    socket.on('cell_updated', (p: CellUpdatedPayload) => {
      store.applyCell(p.cell);
    });

    socket.on('leaderboard_update', (p: LeaderboardUpdatePayload) => {
      store.setLeaderboard(p.leaderboard, p.onlineCount);
    });

    socket.on('capture_error', (p: CaptureErrorPayload) => {
      if (p.message === 'cooldown') {
        store.triggerCooldown();
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [username, color]); // eslint-disable-line
}
