import { Server, Socket } from "socket.io";
import { RoomStore } from "../../store/roomStore.js";
import { generateServerMessage } from "../../utils/message.js";

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
      socket.to(roomId).emit(
        "newMessage",
        generateServerMessage("updateVideoState", {
          eventType: eventType,
          currentTime,
        }),
      );
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
