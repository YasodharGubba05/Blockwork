// ─── Shared Types ──────────────────────────────────────────────────────────

export interface Cell {
  id: string;       // "${x}_${y}"
  x: number;
  y: number;
  ownerId: string;
  ownerName: string;
  color: string;    // hex color from owning user
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  color: string;
  score: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  color: string;
  score: number;
}

// ─── Socket Event Payloads ─────────────────────────────────────────────────

export interface InitialGridPayload {
  grid: Cell[];
  gridSize: number;
  userId: string;
  cooldownMs: number;
}

export interface CellUpdatedPayload {
  cell: Cell;
}

export interface LeaderboardUpdatePayload {
  leaderboard: LeaderboardEntry[];
  onlineCount: number;
}

export interface CaptureErrorPayload {
  message: string;
  remainingMs: number;
}

// ─── Local Identity ────────────────────────────────────────────────────────

export interface LocalIdentity {
  username: string;
  color: string;
}
