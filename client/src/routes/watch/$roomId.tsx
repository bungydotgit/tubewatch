import ResponsiveVideoPlayer from "@/components/responsive-video-player";
import { RoomLayout } from "@/components/room-layout";
import { useRoomStore } from "@/store/useRoomStore";
import { useUser } from "@clerk/clerk-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/watch/$roomId")({
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
  const { isLoaded, user } = useUser();
  const hostId = useRoomStore((state) => state.hostId);
  console.log("host id -- ", hostId);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl text-accent"></span>
      </div>
    );
  }

  return (
    <RoomLayout
      videoPlayer={
        <ResponsiveVideoPlayer
          isHost={hostId === user?.username}
          username={user?.username as string}
        />
      }
      chat={<p>Chat component</p>}
      usersList={<p>uses list component</p>}
    />
  );
}
