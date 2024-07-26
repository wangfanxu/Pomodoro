// src/websocket.ts
import WebSocket, { WebSocketServer } from "ws";
import { Request } from "express";
import { IncomingMessage } from "http";

const wss = new WebSocketServer({ port: 8785 });

const userSockets = new Map<number, WebSocket>(); // Caching user IDs to WebSocket connections

wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
  const url = new URL(request.url!, `http://${request.headers.host}`);
  const userId = Number(url.searchParams.get("user-id"));

  // Store the WebSocket connection
  userSockets.set(userId, ws);
  console.log(userSockets);
  ws.send("hello I am the server!");

  ws.on("close", () => {
    // Remove the WebSocket connection when it is closed
    userSockets.delete(userId);
  });
});

export { wss, userSockets };
