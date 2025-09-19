import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const partySchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },

    videoUrl: {
      type: "string",
      ownerId: { type: "string" },

      currentVideoState: {
        type: "object",

        properties: {
          playbackPosition: {
            type: "number",
          },

          isPaused: { type: "boolean" },
          lastUpdatedBy: { type: "string" },
          isSeeking: { type: "boolean" },
        },
      },

      lastUpdated: {
        type: "number",
      },

      members: {
        type: "array",
        items: {
          type: "string",
        },
      },

      required: [
        "id",
        "videoUrl",
        "ownerId",
        "currentVideoState",
        "lastUpdated",
      ],
      indexes: ["lastUpdated"],
    },
  },
} as const;

export const userProfileSchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    username: { type: "string" },
    avatarUrl: { type: "string" },
    lastActive: { type: "number" },
    lastUpdated: { type: "number" },
  },
  required: ["id", "username", "lastActive", "lastUpdated"],
  indexes: ["lastUpdated"],
} as const;

const partySchemaTyped = toTypedRxJsonSchema(partySchemaLiteral);
const userSchemaTyped = toTypedRxJsonSchema(userProfileSchemaLiteral);

export type PartySchType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof partySchemaTyped
>;
export type UserSchType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof userSchemaTyped
>;

export const partySchema: RxJsonSchema<PartySchType> = partySchemaLiteral;
export const userSchema: RxJsonSchema<UserSchType> = userProfileSchemaLiteral;
