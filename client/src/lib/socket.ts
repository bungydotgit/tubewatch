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

  if (message.type === "updateVideoURL") {
    setVideoURL(message.payload.videoURL);
  }

  if (message.type === "updateVideoState") {
    setVideoState({
      isPlaying: message.payload.eventType === "PLAY",
      currentTime: message.payload.currentTime,
    });

    console.log("state updating");
  }

  if (message.type === "chatMessage") {
    // Assuming 'message' here is the object { id, username, message: chatContent, timestamp: string }
    const parsedMessage = {
      ...message.message,
      timestamp: new Date(message.message.timestamp), // Convert string to Date object
    };
    addMessage(parsedMessage);
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

export const joinRoom = (
  roomId: string,
  username: string,
  callback: (response: {
    success: boolean;
    roomPayload?: {
      roomId: string;
      hostId: string;
      videoURL: string;
      currentTime: number;
      isPlaying: boolean;
    };
    error?: string;
  }) => void,
) => {
  socket.emit("join-room", { roomId, username }, callback);
};

export const createAndJoinRoom = (
  roomId: string,
  username: string,
  videoURL: string,
) => {
  socket.emit("create-join", { roomId, username, videoURL });
  if (socket.connected) {
    const hostId = username;
    setRoomDetails({
      roomId,
      hostId,
      videoURL,
      currentTime: 0,
      isPlaying: false,
    });
  }
};

// host-only events
export const emitVideoStateChange = (
  roomId: string,
  username: string,
  currentTime: number,
  eventType: "PLAY" | "PAUSE",
) => {
  socket.emit("videoStateChange", { username, roomId, currentTime, eventType });
};

export const emitChangeVideo = (roomId: string, videoURL: string) => {
  socket.emit("changeVideo", { roomId, videoURL });
};

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export const sendChatMessage = (message: Message) => {
  const roomId = useRoomStore.getState().roomId;
  socket.emit("chatMessage", { roomId, message });
};

export const leaveRoom = () => {
  socket.emit("leave-room");
};
