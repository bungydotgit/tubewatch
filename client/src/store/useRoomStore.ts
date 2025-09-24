import { create } from "zustand";

interface RoomState {
  isConnected: boolean;
  roomId: string | null;
  hostId: string | null;
  users: { id: string; username: string }[];
  messages: any[];
  videoURL: string | null;
  isPlaying: boolean;
  currentTime: number;
}

interface RoomActions {
  setConnected: (status: boolean) => void;
  setRoomDetails: (details: {
    roomId: string;
    hostId: string;
    videoURL: string;
  }) => void;
  setUsers: (users: { id: string; username: string }[]) => void;
  addUser: (user: { id: string; username: string }) => void;
  removeUser: (userId: string) => void;
  addMessage: (message: any) => void;
  setVideoState: (state: { isPlaying: boolean; currentTime: number }) => void;
  setVideoURL: (url: string) => void;
  resetState: () => void;
}

const initialState: RoomState = {
  isConnected: false,
  roomId: null,
  hostId: null,
  users: [],
  messages: [],
  videoURL: null,
  isPlaying: false,
  currentTime: 0,
};
