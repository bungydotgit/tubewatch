import { RoomLayout } from "@/components/room-layout";
import { createFileRoute, redirect } from "@tanstack/react-router";
import ReactPlayer from "react-player";

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
  return (
    <RoomLayout
      videoPlayer={
        <ReactPlayer
          src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
          style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
          controls
        />
      }
    />
  );
}
