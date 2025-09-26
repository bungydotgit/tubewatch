import ResponsiveVideoPlayer from "@/components/responsive-video-player";
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
      videoPlayer={<ResponsiveVideoPlayer />}
      chat={<p>Chat component</p>}
      usersList={<p>uses list component</p>}
    />
  );
}
