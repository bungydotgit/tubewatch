import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";

const app = express();
const io = new Server(app, {
  cors: {
    origin: "*",
  },
});
dotenv.config();

const PORT = process.env.PORT || 8081;

app.listen(8081, (error) => {
  if (!error) {
    console.log(`Websocket server listening on port: ${PORT}`);
  } else {
    console.log();
  }
});
