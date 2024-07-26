import express from "express";
import { Server } from "http";
import router from "./routes";
import bodyParser from "body-parser";
import ConnectionManager from "./utils/connection";

const app = express();
const PORT = 3000;

(async () => {
  try {
    await ConnectionManager.getInstance();
    console.log("Database connection established");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      app.use(bodyParser.json());
      app.use(router);
      
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

export default Server;
