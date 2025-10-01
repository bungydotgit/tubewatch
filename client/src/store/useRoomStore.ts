import { create } from "zustand";

interface RoomState {
  isConnected: boolean;
  roomId: string | null;
  hostId: string | null; // host username
  users: { socketId: string; username: string }[];
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
    currentTime: number;
    isPlaying: boolean;
  }) => void;
  setUsers: (users: { socketId: string; username: string }[]) => void;
  addUser: (user: { socketId: string; username: string }) => void;
  removeUser: (username: string) => void;
  addMessage: (message: any) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (newCurrentTime: number) => void;
  setVideoState: (videoState: {
    isPlaying: boolean;
    currentTime: number;
  }) => void;
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

export const useRoomStore = create<RoomState & RoomActions>((set) => ({
  ...initialState,

  // Actions:
  setConnected: (status) => set({ isConnected: status }),

  setRoomDetails: (details) =>
    set({
      roomId: details.roomId,
      hostId: details.hostId,
      videoURL: details.videoURL,
      currentTime: details.currentTime,
      isPlaying: details.isPlaying,
    }),

  setUsers: (users) => set({ users: users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  removeUser: (username) =>
    set((state) => ({
      users: state.users.filter((user) => user.username !== username),
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (newCurrentTime) => set({ currentTime: newCurrentTime }),

  setVideoState: (videoState) =>
    set({
      isPlaying: videoState.isPlaying,
      currentTime: videoState.currentTime,
    }),

  setVideoURL: (url) => set({ videoURL: url }),
  resetState: () => set(initialState),
}));
