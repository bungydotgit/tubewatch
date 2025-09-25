import { io, Socket } from "socket.io-client";
import { useRoomStore } from "@/store/useRoomStore";

const {
  setConnected,
  setUsers,
  addMessage,
  setVideoURL,
  setVideoState,
  resetState,
  setRoomDetails,
} = useRoomStore.getState();

const socket: Socket = io("http://localhost:8081", {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log(`Connected to server!`);
  setConnected(true);
});

socket.on("disconnect", () => {
  console.log(`Disconnected from the server`);
  setConnected(false);
});

socket.on("updateUserList", (users) => {
  console.log(`Recieved user list: ${users}`);
  setUsers(users);
});

socket.on("newMessage", (message) => {
  console.log("New message recieved: ", message);
  addMessage(message);

  if (message.type === "updateVideoURL") {
    setVideoURL(message.payload.videoURL);
  }

  if (message.type === "updateVideoState") {
    setVideoState({
      isPlaying: message.payload.type === "PLAY",
      currentTime: message.payload.currentTime,
    });
  }
});

socket.on("changeVideo", (data) => {
  console.log(`Video changed to: ${data.videoURL}`);
  setVideoURL(data.videoURL);
});

socket.on("error", (error) => {
  console.log("Server error: ", error);

  addMessage({ type: "error", text: error.error });
});

export const joinRoom = (roomId: string, username: string) => {
  socket.emit("join-room", { roomId, username });
};

export const createAndJoinRoom = (
  roomId: string,
  username: string,
  videoURL: string,
) => {
  socket.emit("create-join", { roomId, username, videoURL });
  if (socket.connected) {
    const hostId = socket.id as string;
    setRoomDetails({ roomId, hostId, videoURL });
  }
};

// host-only events
export const emitVideoStateChange = (
  roomId: string,
  currentTime: number,
  eventType: "PLAY" | "PAUSE",
) => {
  socket.emit("videoStateChange", { roomId, currentTime, eventType });
};

export const emitChangeVideo = (roomId: string, videoURL: string) => {
  socket.emit("changeVideo", { roomId, videoURL });
};

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
