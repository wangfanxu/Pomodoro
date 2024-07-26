import express from "express";
import { wss } from "./websocket";
import http, { Server } from "http";
import { createConnection } from "typeorm";
import { serialize } from "v8";
import router from "./routes";

const app = express();
const PORT = 3000;

app.use(router);
createConnection().then(() => {
  console.log("Connected to the database");
  const server = http.createServer(app);

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default Server;
