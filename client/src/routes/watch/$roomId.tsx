import { Chat } from "@/components/Chat";
import { RoomLayout } from "@/components/room-layout";
import UsersList from "@/components/UsersList";
import YouTubeIframePlayer from "@/components/YouTubeIframePlayer";
import { useYouTubePlayerSync } from "@/hooks/useYouTubePlayerSync";
import { connectSocket, joinRoom, leaveRoom } from "@/lib/socket";
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

  const handleLeaveRoom = () => {
    (
      document.getElementById("leave_room_modal") as HTMLDialogElement
    )?.showModal();
  };

  const confirmLeave = () => {
    (document.getElementById("leave_room_modal") as HTMLDialogElement)?.close();

    leaveRoom();

    navigate({ to: "/app" });
  };

  const cancelLeave = () => {
    (document.getElementById("leave_room_modal") as HTMLDialogElement)?.close();
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "Are you sure you want to leave the watch party?";
    };

    // Add listener when in a room
    if (roomId) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

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
        chat={<Chat />}
        usersList={
          <UsersList
            onKickUser={(username: string) => {
              // TODO: Implement kick functionality
              console.log("Kick user:", username);
              // You can add kick logic here later
            }}
          />
        }
        leaveButton={
          <button
            className="btn btn-outline btn-error"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        }
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

      {/* Leave Room Confirmation Modal */}
      <dialog
        id="leave_room_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Leave Watch Party?</h3>
          <p className="py-4">
            Are you sure you want to leave this watch party? You'll stop
            watching with the group.
          </p>
          <div className="modal-action">
            <button className="btn btn-outline" onClick={cancelLeave}>
              Stay
            </button>
            <button className="btn btn-error" onClick={confirmLeave}>
              Leave Room
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
