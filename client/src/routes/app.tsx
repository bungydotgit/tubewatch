import Navbar from "@/components/navbar";
import { connectSocket, createAndJoinRoom, joinRoom } from "@/lib/socket";
import { useUser } from "@clerk/clerk-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [videoURL, setVideoURL] = useState("");
  const [roomId, setRoomId] = useState("");

  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();
  }, []);

  function handleCreateRoom(event: React.FormEvent) {
    event.preventDefault();
    if (!videoURL) {
      alert("Please enter video url");
      return;
    }
    const roomId = uuid();
    const username = user?.username as string;
    console.log(user);

    createAndJoinRoom(roomId, username, videoURL);

    navigate({
      to: "/watch/$roomId",
      params: { roomId },
    });
  }

  function handleJoinRoom(event: React.FormEvent) {
    event.preventDefault();
    if (!roomId) {
      alert("Please enter a roomId");
      return;
    }
    const username = user?.username as string;

    joinRoom(roomId, username);
    navigate({
      to: "/watch/$roomId",
      params: { roomId },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Navbar />
      <div className="flex w-full flex-col lg:flex-row py-3">
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-6">
          <h1 className="text-2xl font-bold mb-6">Host a watch party</h1>

          <form onSubmit={handleCreateRoom} className="flex flex-row gap-4">
            <input
              type="text"
              placeholder="Any YouTube video URL"
              className="input input-lg"
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              required
            />
            <button className="btn btn-accent btn-lg" type="submit">
              Host a party
            </button>
          </form>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-6">
          <h1 className="text-2xl font-bold mb-6">Join a watch party</h1>
          <form onSubmit={handleJoinRoom} className="flex flex-row gap-4">
            <input
              type="text"
              placeholder="Room ID"
              className="input input-lg"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-secondary btn-lg">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="bg-base-300 rounded-md p-4">Previous parties</div>
    </div>
  );
}
