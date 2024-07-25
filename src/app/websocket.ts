// src/websocket.ts
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received:", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send("Hi there, I am a WebSocket server");
});

export { wss };
