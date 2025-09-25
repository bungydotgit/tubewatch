import { Server, Socket } from "socket.io";
import { RoomStore } from "../../store/roomStore.js";
import { generateServerMessage } from "../../utils/message.js";

export default function hostHandler(
  io: Server,
  socket: Socket,
  roomStore: RoomStore,
) {
  const authorizeHost = (roomId: string, socketId: string) => {
    const room = roomStore.getRoom(roomId);

    if (room) {
      return room.host === socketId;
    }

    return false;
  };

  socket.on("videoStateChange", (data) => {
    const { roomId, currentTime, eventType } = data;
    if (authorizeHost(roomId, socket.id)) {
      io.to(roomId).emit(
        "newMessage",
        generateServerMessage("updateVideoState", {
          eventType: eventType,
          currentTime,
        }),
      );
    }
  });

  socket.on("changeVideo", (data) => {
    const { roomId, videoURL } = data;

    if (authorizeHost(roomId, socket.id)) {
      roomStore.setVideoURL(roomId, videoURL);

      io.to(roomId).emit(
        "newMessage",
        generateServerMessage("updateVideoURL", { videoURL }),
      );
    }
  });
}
