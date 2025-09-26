import { emitChangeVideo, emitVideoStateChange } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";
import { useRef, type ReactEventHandler } from "react";
import ReactPlayer from "react-player";

export default function ResponsiveVideoPlayer() {
  const videoPlayerRef = useRef<any | null>(null);
  const videoURL = useRoomStore((state) => state.videoURL as string);
  const roomId = useRoomStore((state) => state.roomId as string);
  const isPlaying = useRoomStore((state) => state.isPlaying);
  const { setVideoState } = useRoomStore.getState();
  const currentTime = useRoomStore((state) => state.currentTime);

  const handlePlay = () => {
    if (videoPlayerRef.current) {
      setVideoState({
        isPlaying: true,
        currentTime: videoPlayerRef.current.currentTime,
      });
      emitVideoStateChange(roomId, currentTime, "PLAY");
      console.log(`Current Time: `, currentTime);
    }
  };

  const handlePause = () => {
    if (videoPlayerRef.current) {
      setVideoState({
        isPlaying: false,
        currentTime: videoPlayerRef.current.currentTime,
      });
      emitVideoStateChange(roomId, currentTime, "PAUSE");
      console.log(`Current Time: `, currentTime);
    }
  };

  const handleProgress = (progress: any) => {
    setVideoState({ isPlaying: true, currentTime: progress.played });
  };

  return (
    <ReactPlayer
      ref={videoPlayerRef}
      src={videoURL}
      style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
      playing={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
      onProgress={handleProgress}
      controls
    />
  );
}
