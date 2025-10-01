import { RoomLayout } from "@/components/room-layout";
import YouTubeIframePlayer from "@/components/YouTubeIframePlayer";
import { useYouTubePlayerSync } from "@/hooks/useYouTubePlayerSync";
import { connectSocket, joinRoom } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";
import { useUser } from "@clerk/clerk-react";
import {
  createFileRoute,
  redirect,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";

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
  const storeRoomId = useRoomStore((state) => state.roomId);
  const { roomId } = useParams({ from: "/watch/$roomId" });

  const hostId = useRoomStore((state) => state.hostId);
  const videoURL = useRoomStore((state) => state.videoURL);
  const setRoomDetails = useRoomStore((state) => state.setRoomDetails);

  const navigate = useNavigate();
  const isHost = hostId === user?.username;
  const { playerRef, playerProps, hasStartedWatching, handleStartWatching } =
    useYouTubePlayerSync({ isHost });

  const handleStartWatchingClick = () => {
    (
      document.getElementById("start_watching_modal") as HTMLDialogElement
    )?.close();

    handleStartWatching();
  };

  useEffect(() => {
    if (storeRoomId === roomId) return;
    connectSocket();

    if (isLoaded && user?.username) {
      joinRoom(roomId, user.username, (response) => {
        if (response.success) {
          toast.success("Joined Room successfully");
          if (response.roomPayload) {
            setRoomDetails({ ...response.roomPayload });
          }
        } else {
          toast.error(`Error Joining room: ${response.error}`);
          navigate({ to: "/app" });
        }
      });
    }
  }, [isLoaded, roomId, storeRoomId]);

  const shouldShowModal = !isHost && !hasStartedWatching && videoURL;

  useEffect(() => {
    if (shouldShowModal) {
      setTimeout(() => {
        (
          document.getElementById("start_watching_modal") as HTMLDialogElement
        )?.showModal();
      }, 100);
    }
  }, [shouldShowModal]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl text-accent"></span>
      </div>
    );
  }

  return (
    <>
      <RoomLayout
        videoPlayer={
          <YouTubeIframePlayer
            ref={playerRef}
            isHostControls={isHost}
            videoId={videoURL as string}
            {...playerProps}
          />
        }
        chat={<p>Chat component</p>}
        usersList={<p>uses list component</p>}
      />

      {/* Start Watching Modal */}
      <dialog
        id="start_watching_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Join the Watch Party! 🎬</h3>
          <p className="py-4">
            Click "Start Watching" to sync with the room and begin watching
            together.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleStartWatchingClick}
            >
              ▶️ Start Watching
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
