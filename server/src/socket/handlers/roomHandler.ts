import { Server, Socket } from "socket.io";
import { RoomStore } from "../../store/roomStore.js";
import { generateServerMessage } from "../../utils/message.js";

function roomHandler(io: Server, socket: Socket, roomStore: RoomStore) {
  socket.on("create-join", (data) => {
    const { roomId, username, videoURL } = data;

    socket.join(roomId);
    roomStore.addRoom(username, roomId, videoURL);
    roomStore.addUser(roomId, socket.id, username);

    socket.broadcast.to(roomId).emit(
      "newMessage",
      generateServerMessage("userJoin", {
        roomId,
        username,
      }),
    );

    io.to(roomId).emit("updateUserList", roomStore.getRoomUserList(roomId));
  });

  socket.on("join-room", (data, callback) => {
    const { roomId, username } = data;

    try {
      const room = roomStore.getRoom(roomId);

      if (!room) {
        return callback({
          success: false,
          error: "Room code is invalid or room no longer exists.",
        });
      }

      socket.join(roomId);
      roomStore.addUser(roomId, socket.id, username);
      console.log(`User joined: ${username} -> ${roomId}`);
      console.log(roomStore.getRoom(roomId));
      socket.emit("changeVideo", {
        videoURL: room?.videoURL,
      });
      io.to(roomId).emit("updateUserList", roomStore.getRoomUserList(roomId));

      return callback({ success: true });
    } catch (error) {
      console.error("Join room error: ", error);
      callback({
        success: false,
        error: "An unexpected server error occurred.",
      });
    }
  });
}

export default roomHandler;
