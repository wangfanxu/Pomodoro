// src/websocket.ts
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

const userSockets = new Map<number, WebSocket>(); // caching user IDs to WebSocket connections, 

export { wss, userSockets };
