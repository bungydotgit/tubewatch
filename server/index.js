import { startSignalingServerSimplePeer } from "rxdb/plugins/replication-webrtc";
import express from "express";
import http from "node:http";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

const serverState = await startSignalingServerSimplePeer({
  server,
});

server.listen(8081, () => {
  console.log("Signaling server listening to port 8081");
});
