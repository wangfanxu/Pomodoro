import express from "express";
import { wss } from "./websocket";
import http from "http";

const app = express();
const PORT = 3000;

const server = http.createServer(app);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
