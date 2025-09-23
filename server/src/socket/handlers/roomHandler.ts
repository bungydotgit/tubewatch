import { Server } from "socket.io";
import { RoomStore } from "../../store/roomStore.js";

function roomHandler(io: Server, socket: string, roomStore: RoomStore) {
  io.on("connection", (socket) => {
    /*
      TODO:
      join-room
    */

    socket.on("disconnect", () => {
      roomStore.removeUser(socket.id);
      // TODO: message client that user is disconnected
    });
  });
}

export default roomHandler;
