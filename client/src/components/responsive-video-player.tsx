import { emitVideoStateChange } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";

interface ResponsivePlayerProps {
  isHost: boolean;
  username: string;
}
export default function ResponsiveVideoPlayer({
  isHost,
  username,
}: ResponsivePlayerProps) {
  const videoPlayerRef = useRef<any | null>(null);
  const videoURL = useRoomStore((state) => state.videoURL as string);
  const roomId = useRoomStore((state) => state.roomId as string);
  const isPlaying = useRoomStore((state) => state.isPlaying);
  const currentTime = useRoomStore((state) => state.currentTime);
  const getPlayerTime = () => {
    if (
      videoPlayerRef.current &&
      typeof videoPlayerRef.current.currentTime === "number"
    ) {
      return videoPlayerRef.current.currentTime;
    }
    return 0;
  };

  const seekTo = (seconds: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = seconds;
    }
  };

  const handlePlay = () => {
    if (!isHost) return;

    if (videoPlayerRef.current) {
      const newCurrentTime = getPlayerTime();
      emitVideoStateChange(roomId, username, newCurrentTime, "PLAY");
      console.log(`Current Time emitted (PLAY): `, newCurrentTime);
    }
  };

  const handlePause = () => {
    if (!isHost) return;

    if (videoPlayerRef.current) {
      const newCurrentTime = getPlayerTime();
      emitVideoStateChange(roomId, username, newCurrentTime, "PAUSE");
      console.log(`Current Time emitted (PAUSE): `, newCurrentTime);
    }
  };

  useEffect(() => {
    const player = videoPlayerRef.current;

    if (!player || !videoURL) return;
    if (typeof currentTime === "number" && currentTime > 2) {
      const currentLocalTime = getPlayerTime();
      const timeDifference = Math.abs(currentLocalTime - currentTime);

      if (timeDifference > 1) {
        seekTo(currentTime);
        console.log(
          `Seeking due to time difference: ${timeDifference.toFixed(2)}s`,
        );
      }
    }
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, currentTime, videoURL]);

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: "16/9",
        position: "relative",
      }}
    >
      {!isHost && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 10,
            backgroundColor: "transparent",
            cursor: "default",
          }}
        />
      )}
      <ReactPlayer
        ref={videoPlayerRef}
        src={videoURL}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        playing={isPlaying}
        onPlay={isHost ? handlePlay : undefined}
        onPause={isHost ? handlePause : undefined}
        controls={isHost}
      />
    </div>
  );
}
