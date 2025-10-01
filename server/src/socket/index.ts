import type { Server, Socket } from "socket.io";
import { RoomStore } from "../store/roomStore.js";
import roomHandler from "./handlers/roomHandler.js";
import hostHandler from "./handlers/hostHandler.js";
import { generateServerMessage } from "../utils/message.js";

const handleUserLeave = (socket: Socket, roomStore: RoomStore, io: Server) => {
  const user = roomStore.getUser(socket.id);
  if (!user) return null;

  console.log(`User leaving: ${user.username} from room ${user.roomId}`);

  // Remove user from room
  const removedUser = roomStore.removeUser(socket.id);

  if (removedUser) {
    const room = roomStore.getRoom(removedUser.roomId);

    // Notify other users
    socket.to(removedUser.roomId).emit(
      "newMessage",
      generateServerMessage("userLeft", {
        roomId: removedUser.roomId,
        username: removedUser.username,
      }),
    );

    // Update user list for remaining users
    io.to(removedUser.roomId).emit(
      "updateUserList",
      roomStore.getRoomUserList(removedUser.roomId),
    );

    // Check if room is empty and delete it
    if (!room || room.users.length === 0) {
      console.log(`Room ${removedUser.roomId} is empty, deleting...`);
      roomStore.removeRoom(removedUser.roomId);
    }
  }

  return removedUser;
};

export default function initializeSocket(io: Server) {
  const roomStore = new RoomStore();

  io.on("connection", (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    roomHandler(io, socket, roomStore);
    hostHandler(io, socket, roomStore);

    socket.on("leave-room", () => {
      handleUserLeave(socket, roomStore, io);
    });

    socket.on("disconnect", () => {
      handleUserLeave(socket, roomStore, io);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
