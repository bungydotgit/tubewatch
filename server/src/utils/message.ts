import { v4 as uuid } from "uuid";
import { ServerMessage } from "../lib/types.js";
import { timeStamp } from "node:console";

export const generateServerMessage = (type: ServerMessage, payload = {}) => {
  return {
    id: uuid(),
    type,
    payload,
    timestamp: Date.now(),
  };
};
