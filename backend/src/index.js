require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const io = new Server(server, {
  cors: { origin: FRONTEND_URL, methods: ['GET', 'POST'] },
});

// Config constants
const GRID_SIZE = 30; 
const COOLDOWN_MS = 2000; 

// State (kept in memory for simplicity)
// TODO: migrate to redis if scaling past one node
const grid = new Map();
const users = new Map();
const cooldowns = new Map();

// Helper to get leaderboard data
function getLeaderboard() {
  return Array.from(users.values())
    .sort((a, b) => b.score - a.score)
    .map(u => ({ id: u.id, username: u.username, color: u.color, score: u.score }));
}

function isValidCoord(x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && 
         x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

app.get('/health', (req, res) => res.send('ok'));

io.on('connection', (socket) => {
  console.log(`conn: ${socket.id}`);

  socket.on('join_user', ({ username, color }) => {
    if (!username || !color) return;

    const user = {
      id: uuidv4(),
      socketId: socket.id,
      username: username.slice(0, 20),
      color,
      score: 0,
    };
    users.set(socket.id, user);

    console.log(`join: ${user.username} [${user.id}]`);

    // push initial state
    socket.emit('initial_grid', {
      grid: Array.from(grid.values()),
      gridSize: GRID_SIZE,
      userId: user.id,
      cooldownMs: COOLDOWN_MS,
    });

    // update everyone
    io.emit('leaderboard_update', {
      leaderboard: getLeaderboard(),
      onlineCount: users.size,
    });
  });

  socket.on('capture_cell', ({ x, y }) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (!isValidCoord(x, y)) return;

    // cooldown check
    const now = Date.now();
    const last = cooldowns.get(user.id) || 0;
    if (now - last < COOLDOWN_MS) {
      socket.emit('capture_error', { 
        message: 'cooldown', 
        remainingMs: COOLDOWN_MS - (now - last) 
      });
      return;
    }

    const key = `${x}_${y}`;
    const old = grid.get(key);

    // update cell
    const cell = {
      id: key, x, y,
      ownerId: user.id,
      ownerName: user.username,
      color: user.color,
      updatedAt: new Date().toISOString(),
    };
    grid.set(key, cell);
    cooldowns.set(user.id, now);

    // score adjustment
    if (old && old.ownerId !== user.id) {
      // search for old owner to decrement score
      for (let u of users.values()) {
        if (u.id === old.ownerId) {
          u.score = Math.max(0, u.score - 1);
          break;
        }
      }
    }
    user.score += 1;

    // broadcast
    io.emit('cell_updated', { cell });
    io.emit('leaderboard_update', {
      leaderboard: getLeaderboard(),
      onlineCount: users.size,
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`quit: ${user.username}`);
      users.delete(socket.id);
      cooldowns.delete(user.id);

      io.emit('leaderboard_update', {
        leaderboard: getLeaderboard(),
        onlineCount: users.size,
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});
