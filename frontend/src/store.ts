import { create } from 'zustand';
import type { Cell, LeaderboardEntry } from './types';

interface GridState {
  cells: Map<string, Cell>;
  gridSize: number;

  myUserId: string | null;
  myUsername: string;
  myColor: string;

  connected: boolean;
  cooldownMs: number;
  cooldownUntil: number; // timestamp

  leaderboard: LeaderboardEntry[];
  onlineCount: number;

  setInitialGrid: (cells: Cell[], gridSize: number, userId: string, cooldownMs: number) => void;
  applyCell: (cell: Cell) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[], onlineCount: number) => void;
  setConnected: (v: boolean) => void;
  setIdentity: (username: string, color: string) => void;
  triggerCooldown: () => void;
}

export const useGridStore = create<GridState>((set, get) => ({
  cells: new Map(),
  gridSize: 30,
  myUserId: null,
  myUsername: '',
  myColor: '#3498db',
  connected: false,
  cooldownMs: 2000,
  cooldownUntil: 0,
  leaderboard: [],
  onlineCount: 0,

  setInitialGrid(cells, gridSize, userId, cooldownMs) {
    const map = new Map<string, Cell>();
    cells.forEach((c) => map.set(c.id, c));
    set({ cells: map, gridSize, myUserId: userId, cooldownMs });
  },

  applyCell(cell) {
    set((state) => {
      const next = new Map(state.cells);
      next.set(cell.id, cell);
      return { cells: next };
    });
  },

  setLeaderboard(leaderboard, onlineCount) {
    set({ leaderboard, onlineCount });
  },

  setConnected(v) {
    set({ connected: v });
  },

  setIdentity(username, color) {
    set({ myUsername: username, myColor: color });
  },

  triggerCooldown() {
    const { cooldownMs } = get();
    set({ cooldownUntil: Date.now() + cooldownMs });
  },
}));
