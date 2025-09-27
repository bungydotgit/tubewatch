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
  const setIsPlaying = useRoomStore((state) => state.setIsPlaying);
  const setCurrentTime = useRoomStore((state) => state.setCurrentTime);

  const seekTo = (seconds: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = seconds;
    }
  };

  const handlePlay = () => {
    if (videoPlayerRef.current) {
      const newCurrentTime = videoPlayerRef.current.currentTime;

      emitVideoStateChange(roomId, username, newCurrentTime, "PLAY");
      console.log(`Current Time: `, newCurrentTime);
    }
  };

  const handlePause = () => {
    if (videoPlayerRef.current) {
      const newCurrentTime = videoPlayerRef.current.currentTime;

      emitVideoStateChange(roomId, username, newCurrentTime, "PAUSE");
      console.log(`Current Time: `, newCurrentTime);
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    seekTo(currentTime);
  }, [currentTime]);

  return (
    <ReactPlayer
      ref={videoPlayerRef}
      src={videoURL}
      style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
      playing={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      controls={isHost}
    />
  );
}
