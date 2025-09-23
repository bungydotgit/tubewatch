import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import initializeSocket from "./socket/index.js";
import { createServer } from "node:http";

const app = express();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
dotenv.config();

initializeSocket(io);

const PORT = process.env.PORT || 8081;

app.listen(8081, (error) => {
  if (!error) {
    console.log(`Websocket server listening on port: ${PORT}`);
  } else {
    console.log(`Failed to start the websocket server: ${error}`);
  }
});
