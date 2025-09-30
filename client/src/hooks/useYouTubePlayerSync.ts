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

  // --- THE MAIN FIX: The Synchronization Logic ---
  useEffect(() => {
    // 1. Guard Clause: Don't run this logic until the player is ready.
    if (!isPlayerReady) {
      return;
    }

    const player = getPlayer();
    if (!player) return;

    // 2. Sync seeking
    const localTime = player.getTime();
    const timeDifference = Math.abs(localTime - currentTime);
    if (timeDifference > 1.5) {
      player.seekTo(currentTime);
    }

    // 3. Sync play/pause state
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
    // 4. Dependency Array: Now depends on isPlayerReady as well.
  }, [isPlaying, currentTime, isPlayerReady]);

  return {
    playerRef,
    playerProps: {
      onReady: handleReady,
      onPlay: isHost ? handlePlay : undefined,
      onPause: isHost ? handlePause : undefined,
      onSeek: isHost ? handleSeek : undefined, // Only host should emit seek events
    },
  };
}
