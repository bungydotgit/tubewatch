import { Server, Socket } from "socket.io";
import { RoomStore } from "../../store/roomStore.js";
import { generateServerMessage } from "../../utils/message.js";
import { User } from "../../lib/types.js";

export default function hostHandler(
  io: Server,
  socket: Socket,
  roomStore: RoomStore,
) {
  const authorizeHost = (roomId: string, username: string) => {
    const room = roomStore.getRoom(roomId);
    console.log(room);

    if (room) {
      console.log(room.host == username, " ", room.host === username);
      return room.host === username;
    }

    return false;
  };

  socket.on("videoStateChange", (data) => {
    const { username, roomId, currentTime, eventType } = data;
    console.log("incoming state change: ", data);
    console.log(authorizeHost(roomId, username));
    if (authorizeHost(roomId, username)) {
      const room = roomStore.getRoom(roomId);
      roomStore.setPlaybackState(roomId, currentTime, eventType === "PLAY");
      socket.to(roomId).emit(
        "newMessage",
        generateServerMessage("updateVideoState", {
          eventType: eventType,
          currentTime,
        }),
      );
    }
  });

  socket.on("kickUser", (data) => {
    const { username, userToKick, roomId } = data;

    if (authorizeHost(roomId, username)) {
      const roomUsers = roomStore.getRoomUserList(roomId);
      const { socketId } = roomUsers?.find(
        (user) => user.username === userToKick,
      ) as User;
      const socketToKick = io.sockets.sockets.get(socketId);
      if (socketToKick) {
        socketToKick.leave(roomId);

        socketToKick.emit(
          "kicked",
          "You have been kicked from the room by the host.",
        );
      }
      const removedUser = roomStore.removeUser(socketId);

      if (removedUser) {
        socket.to(roomId).emit(
          "newMessage",
          generateServerMessage("userKicked", {
            roomId: removedUser.roomId,
            username: removedUser.username,
          }),
        );

        io.to(removedUser.roomId).emit(
          "updateUserList",
          roomStore.getRoomUserList(removedUser.roomId),
        );
      }
    }
  });

  socket.on("changeVideo", (data) => {
    const { username, roomId, videoURL } = data;

    if (authorizeHost(roomId, username)) {
      roomStore.setVideoURL(roomId, videoURL);

      io.to(roomId).emit(
        "newMessage",
        generateServerMessage("updateVideoURL", { videoURL }),
      );
    }
  });
}
