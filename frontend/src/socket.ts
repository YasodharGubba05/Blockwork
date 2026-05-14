/**
 * socket.ts — Singleton Socket.IO client
 *
 * We create ONE socket instance for the entire app lifetime.
 * Importing this module always returns the same socket reference,
 * which prevents duplicate event listeners and duplicate connections.
 */
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  // Don't connect until we have a user identity
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
  reconnectionDelay: 1500,
});
