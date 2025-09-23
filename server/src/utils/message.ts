import { v4 as uuid } from "uuid";
import { ServerMessage } from "../lib/types.js";

export const generateServerMessage = (type: ServerMessage, payload = {}) => {
  return {
    id: uuid(),
    type,
    payload,
    timestamp: Date.now(),
  };
};

// For Future chat messaging functionality
export const generateUserMessage = (
  from: string,
  userId: string,
  text: string,
) => {
  return {
    id: uuid(),
    type: "userMessage",
    userId,
    from,
    text,
    timestamp: Date.now(),
  };
};
