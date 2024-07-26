import express from "express";
import { wss } from "./websocket";
import { Server } from "http";
import { createConnection } from "typeorm";
import router from "./routes";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(router);
createConnection().then(() => {
  console.log("Connected to the database");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  app.use(bodyParser.json());
  app.use(router);
});

export default Server;
