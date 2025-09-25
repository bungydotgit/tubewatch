import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import initializeSocket from "./socket/index.js";
import { createServer } from "node:http";

const app = express();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
dotenv.config();

initializeSocket(io);

const PORT = process.env.PORT || 8081;

httpServer.listen(8081, () => {
  console.log(`Websocket server listening on port: ${PORT}`);
});
