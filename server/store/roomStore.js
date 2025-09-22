class RoomStore {
  constructor() {
    this.rooms = new Map();
    /*
      roomId -> {
        host: hostSocketId
        users: [
          { username, socketId, roomId }
        ],
        videoURL: ''
      }
    */

    this.socketToRoomMap = new Map();
    /*
      socketId -> RoomId
    */
  }

  addRoom(hostId, roomId, videoURL) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        host: hostId,
        users: [],
        videoURL,
      });
    }
  }

  removeRoom(roomId) {
    if (this.rooms.size !== 0) this.rooms.delete(roomId);
  }

  addUser(roomId, socketId, username) {
    const currentRoom = this.rooms.get(roomId);

    if (currentRoom) {
      currentRoom.users.push({ username, socketId, roomId });
      this.rooms.set(roomId, currentRoom);

      this.users.set(socketId, roomId);
    }
  }

  removeUser(socketId) {
    const roomId = this.socketToRoomMap.get(socketId);
    let user_ = null;

    if (roomId) {
      const currentRoom = this.rooms.get(roomId);
      let users = currentRoom.users;

      currentRoom.users = users.filter((user) => {
        if (user.socketId === socketId) {
          user_ = user;
        }

        return user.socketId !== socketId;
      });

      this.rooms.set(roomId, currentRoom);
      return user_;
    }

    return null;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getUser(socketId) {
    const room = this.socketToRoomMap.get(socketId);
    const users = room.users;
    return users.find((user) => user.socketId === socketId);
  }

  getRoomUserList(roomId) {
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

  /*
  -- TODOS --
    - addRoom(roomId, videoId)
    - addUser(roomId, socketId, username)
    - removeUser(socketId)
    - getRoom(roomId)
    - getUser(userId)
    - removeRoom(roomId)
    getUserList(roomId)
    showInfo()
  */
}
