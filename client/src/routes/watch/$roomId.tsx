import { RoomLayout } from "@/components/room-layout";
import { createFileRoute } from "@tanstack/react-router";
import ReactPlayer from "react-player";

export const Route = createFileRoute("/watch/$roomId")({
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
