import { Server, Socket } from "socket.io";
import { RoomStore } from "../../store/roomStore.js";
import { generateServerMessage } from "../../utils/message.js";

function roomHandler(io: Server, socket: Socket, roomStore: RoomStore) {
  socket.on("create-join", (data) => {
    const { roomId, username, videoURL } = data;

    socket.join(roomId);
    roomStore.addRoom(socket.id, roomId, videoURL);
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

  socket.on("join-room", (data) => {
    const { roomId, username } = data;
    const room = roomStore.getRoom(roomId);

    if (room) {
      socket.join(roomId);
      roomStore.addUser(roomId, socket.id, username);
      socket.emit("changeVideo", {
        videoURL: room?.videoURL,
      });
      io.to(roomId).emit("updateUserList", roomStore.getRoomUserList(roomId));
    } else {
      socket.emit("error", { error: "Room Does not exist" });
    }
  });
}

export default roomHandler;
