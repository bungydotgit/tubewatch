import type { Room, User } from "../lib/types.js";

export class RoomStore {
  rooms: Map<string, Room>;
  socketToRoomMap: Map<string, string>;

  constructor() {
    this.rooms = new Map<string, Room>();
    this.socketToRoomMap = new Map<string, string>();
  }

  addRoom(hostUsername: string, roomId: string, videoURL: string) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        host: hostUsername,
        users: [],
        videoURL,
        isPlaying: false,
        currentTime: 0,
      });
    }
  }

  removeRoom(roomId: string) {
    if (this.rooms.size !== 0) this.rooms.delete(roomId);
  }

  addUser(roomId: string, socketId: string, username: string) {
    const currentRoom = this.rooms.get(roomId);

    if (currentRoom) {
      currentRoom.users.push({ username, socketId, roomId });
      this.rooms.set(roomId, currentRoom);

      this.socketToRoomMap.set(socketId, roomId);
    }
  }

  removeUser(socketId: string) {
    const roomId = this.socketToRoomMap.get(socketId);
    let user_ = null;

    if (roomId) {
      const currentRoom = this.rooms.get(roomId);

      if (currentRoom) {
        let users = currentRoom.users;

        currentRoom.users = users.filter((user: User) => {
          if (user.socketId === socketId) {
            user_ = user;
          }

          return user.socketId !== socketId;
        });

        this.rooms.set(roomId, currentRoom);
        return user_;
      }
    }

    return null;
  }

  setPlaybackState(roomId: string, currentTime: number, isPlaying: boolean) {
    const room = this.getRoom(roomId);
    if (room) {
      room.currentTime = currentTime;
      room.isPlaying = isPlaying;
    }
  }

  setVideoURL(roomId: string, videoURL: string) {
    const room = this.getRoom(roomId);
    if (room) {
      room.videoURL = videoURL;
      this.rooms.set(roomId, room);
    } else {
      throw new Error("Room Not found");
    }
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  getUser(socketId: string) {
    const roomId = this.socketToRoomMap.get(socketId);
    if (roomId) {
      const room = this.rooms.get(roomId);

      if (room) return room.users.find((user) => user.socketId == socketId);
    }
  }

  getRoomUserList(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      return room.users;
    }
  }

  showInfo() {
    const rooms = this.rooms;
    for (const [room, users] of rooms) {
      console.log(`Room: ${room}`);
      for (const user in users) {
        console.log(user);
      }
    }
  }
}
