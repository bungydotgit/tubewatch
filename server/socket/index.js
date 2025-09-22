export default function initializeSocket(io) {
  const roomStore = new RoomStore();

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // roomHandler(io, socket, roomStore)
    // hostHandler(io, socket, roomStore)

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
