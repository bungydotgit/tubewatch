import { useRef, useEffect, useState } from "react"; // <--- Import useState
import { useRoomStore } from "@/store/useRoomStore";
import { emitVideoStateChange } from "@/lib/socket"; // Assuming you have this
import { useUser } from "@clerk/clerk-react";

interface UseYouTubePlayerSyncProps {
  isHost: boolean;
}

export function useYouTubePlayerSync({ isHost }: UseYouTubePlayerSyncProps) {
  const playerRef = useRef<any>(null);
  const { user } = useUser();

  // --- NEW: State to track if the player is ready to be controlled ---
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasStartedWatching, setHasStartedWatching] = useState(false);

  const roomId = useRoomStore((state) => state.roomId);
  const isPlaying = useRoomStore((state) => state.isPlaying);
  const currentTime = useRoomStore((state) => state.currentTime);
  const videoURL = useRoomStore((state) => state.videoURL);

  const getPlayer = () => {
    if (playerRef.current) {
      return playerRef.current;
    }
    return null;
  };

  const handlePlay = () => {
    const player = getPlayer();
    if (!player) return;
    const newCurrentTime = player.getTime();
    emitVideoStateChange(
      roomId as string,
      user?.username as string,
      newCurrentTime,
      "PLAY",
    );
  };

  const handlePause = () => {
    const player = getPlayer();
    if (!player) return;
    const newCurrentTime = player.getTime();
    emitVideoStateChange(
      roomId as string,
      user?.username as string,
      newCurrentTime,
      "PAUSE",
    );
  };

  // --- BUG FIX: Use the time from the seek event, not the old time ---
  const handleSeek = (seekTime: number) => {
    emitVideoStateChange(
      roomId as string,
      user?.username as string,
      seekTime, // Use the new time from the onSeek prop
      "PLAY", // Seeking should generally result in a playing state
    );
  };

  // --- UPDATED: Set player ready state to true when the event fires ---
  const handleReady = () => {
    console.log("Player is ready (hook received ready signal)");
    setIsPlayerReady(true);
  };

  const handleStartWatching = () => {
    setHasStartedWatching(true);

    // setTimeout(() => {
    //   const player = getPlayer();
    //   if (player && isPlayerReady) {
    //     const localTime = player.getTime();
    //     const timeDifference = Math.abs(localTime - currentTime);

    //     console.log("📊 Member sync data:", {
    //       localTime,
    //       currentTime,
    //       timeDifference,
    //       isPlaying,
    //     });

    //     if (timeDifference > 1.5) {
    //       player.seekTo(currentTime);

    //       setTimeout(() => {
    //         if (isPlaying) {
    //           player.play();
    //         } else {
    //           player.pause();
    //         }
    //       }, 600);
    //     } else {
    //       setTimeout(() => {
    //         if (isPlaying) {
    //           player.play();
    //         } else {
    //           player.pause();
    //         }
    //       }, 200);
    //     }
    //   }
    // }, 300);
  };

  useEffect(() => {
    if (!isPlayerReady) return;
    if (!isHost && !hasStartedWatching) return;

    const player = getPlayer();
    if (!player) return;

    const localTime = player.getTime();
    const timeDifference = Math.abs(localTime - currentTime);
    const needsSeek = timeDifference > 1.5;

    if (needsSeek) {
      player.seekTo(currentTime);

      setTimeout(() => {
        if (isPlaying) {
          player.play();
        } else {
          player.pause();
        }
      }, 500);
    } else {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isPlaying, currentTime, isPlayerReady, hasStartedWatching]);

  return {
    playerRef,
    hasStartedWatching,
    handleStartWatching,
    playerProps: {
      onReady: handleReady,
      onPlay: isHost ? handlePlay : undefined,
      onPause: isHost ? handlePause : undefined,
      onSeek: isHost ? handleSeek : undefined,
    },
  };
}
