// src/server.ts
import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import router from "./routes";
import ConnectionManager from "./utils/connection";
import { wss } from "./websocket";

const app = express();
const PORT = 3000;

(async () => {
  try {
    await ConnectionManager.getInstance();
    console.log("Database connection established");

    app.use(bodyParser.json());
    app.use(router);

    const server = createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

export default app;
