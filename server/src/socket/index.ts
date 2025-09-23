import type { Server, Socket } from "socket.io";
import { RoomStore } from "../store/roomStore.js";

export default function initializeSocket(io: Server) {
  const roomStore = new RoomStore();

  io.on("connection", (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    // roomHandler(io, socket, roomStore)
    // hostHandler(io, socket, roomStore)

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
