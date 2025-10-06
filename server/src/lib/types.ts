export type User = {
  username: string;
  socketId: string;
  roomId: string;
};

export type Room = {
  host: string;
  users: Array<User>;
  videoURL: string;
  isPlaying: boolean;
  currentTime: number;
};

export type ServerMessage =
  | "userJoin"
  | "userLeft"
  | "userKicked"
  | "changeVideo"
  | "updateVideoURL"
  | "updateVideoState";

export type UserMessage = "userMessage";
