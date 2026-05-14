# Grid Capture

Simple real-time multiplayer board game. Claim as many cells as you can.

## How to play
1. Pick a name and color.
2. Click any cell to capture it.
3. You have a 2-second cooldown between captures.
4. Try to take over the board.

## Tech stack
- **Frontend**: React + Vite + TypeScript + Tailwind (for layout).
- **Backend**: Node.js + Express + Socket.IO.
- **State**: In-memory (resets on server restart).

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Folder Structure
- `backend/src/index.js`: Single file server with all game logic.
- `frontend/src/store.ts`: Zustand store for state sync.
- `frontend/src/hooks/useSocket.ts`: Socket event handlers.
- `frontend/src/components/`: Simple, functional UI components.

## Development notes
- **Sync**: Server is the source of truth. Clients wait for server confirmation before updating.
- **Conflict**: First request to hit the server wins. No complex CRDTs used.
- **Design**: Minimal, mono-spaced, dark-themed UI. No unnecessary animations.
- **TODO**: Persistent storage (Redis/Postgres), better mobile support, rooms/matchmaking.
