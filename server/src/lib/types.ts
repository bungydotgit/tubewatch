export type User = {
  username: string;
  socketId: string;
  roomId: string;
};

export type Room = {
  host: string;
  users: Array<User>;
  videoURL: string;
};

export type ServerMessage =
  | "userJoin"
  | "userLeft"
  | "changeVideo"
  | "updateVideoURL"
  | "updateVideoState";

export type UserMessage = "userMessage";
