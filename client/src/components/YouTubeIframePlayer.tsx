import React, { useRef, useEffect, useState, useImperativeHandle } from "react";

// --- Type Definitions for the Global YouTube Player API ---

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Enhanced utility function to extract video ID from various YouTube URL formats
const extractVideoId = (url: string): string | null => {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  // If it's already an 11-character ID (alphanumeric, dash, underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Pattern 1: youtube.com/watch?v=VIDEO_ID
  let match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 2: youtu.be/VIDEO_ID
  match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 3: youtube.com/embed/VIDEO_ID
  match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 4: youtube.com/v/VIDEO_ID
  match = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 5: youtube.com/watch?feature=player_embedded&v=VIDEO_ID
  match = url.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 6: m.youtube.com (mobile)
  match = url.match(/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 7: youtube.com/shorts/VIDEO_ID
  match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Pattern 8: youtube.com/live/VIDEO_ID
  match = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  console.warn("Could not extract video ID from:", url);
  return null;
};

// Interface for the methods exposed to the parent component via ref
export interface YouTubePlayerApi {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getTime: () => number;
}

// Interface for component props
interface YouTubePlayerProps {
  videoId: string; // Accepts full URL or 11-character ID
  isHostControls?: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStateChange?: (state: number) => void;
  onSeek?: (seconds: number) => void;
}

// --- Component Definition ---

const YouTubeIframePlayer = React.forwardRef<
  YouTubePlayerApi,
  YouTubePlayerProps
>(
  (
    {
      videoId,
      isHostControls = false,
      onReady,
      onPlay,
      onPause,
      onStateChange,
      onSeek,
    },
    ref,
  ) => {
    const playerDivRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);

    // --- State for seek detection ---
    const lastTimeRef = useRef(-1);
    const timeUpdaterIntervalRef = useRef<number | null>(null);

    // Extract the valid 11-character ID from the prop value
    const extractedVideoId = extractVideoId(videoId);

    // --- Internal function to track time and detect seeks ---
    const trackTime = () => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== "function") return;

      const currentTime = player.getCurrentTime();

      if (lastTimeRef.current !== -1) {
        if (Math.abs(currentTime - lastTimeRef.current) > 1.5) {
          console.log(`Seek detected! New time: ${currentTime.toFixed(2)}`);
          if (onSeek) {
            onSeek(currentTime);
          }
        }
      }
      lastTimeRef.current = currentTime;
    };

    // --- 1. Load YouTube Iframe API Script ---
    useEffect(() => {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return;
      }

      let scriptTag = document.getElementById(
        "youtube-iframe-api-script",
      ) as HTMLScriptElement;

      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.src = "https://www.youtube.com/iframe_api";
        scriptTag.id = "youtube-iframe-api-script";

        scriptTag.onload = () => {
          if (window.YT && window.YT.Player) {
            setIsApiReady(true);
          }
        };

        document.head.appendChild(scriptTag);
      }

      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
        if (originalCallback) originalCallback();
      };

      return () => {
        window.onYouTubeIframeAPIReady = originalCallback || (() => {});
      };
    }, []);

    // --- 2. Initialize Player Instance ---
    useEffect(() => {
      if (!isApiReady || !playerDivRef.current || !extractedVideoId) {
        if (!extractedVideoId && videoId) {
          console.error("Invalid YouTube video ID or URL:", videoId);
        }
        return;
      }

      const playerId = `ytplayer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      playerDivRef.current.id = playerId;

      const cleanupPlayer = () => {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {
            console.warn("Error destroying player:", e);
          }
          playerRef.current = null;
        }
        if (timeUpdaterIntervalRef.current !== null) {
          clearInterval(timeUpdaterIntervalRef.current);
          timeUpdaterIntervalRef.current = null;
        }
        lastTimeRef.current = -1;
      };

      cleanupPlayer();

      try {
        playerRef.current = new window.YT.Player(playerId, {
          videoId: extractedVideoId,
          playerVars: {
            origin: window.location.origin,
            disablekb: 1,
            controls: isHostControls ? 1 : 0,
            vq: "hd1080",
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              console.log("YouTube Player ready for video:", extractedVideoId);
              lastTimeRef.current = event.target.getCurrentTime();
              if (onReady) onReady();
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (onStateChange) onStateChange(state);

              if (state === window.YT.PlayerState.PLAYING) {
                if (timeUpdaterIntervalRef.current === null) {
                  timeUpdaterIntervalRef.current = window.setInterval(
                    trackTime,
                    250,
                  );
                }
                if (onPlay) onPlay();
              } else if (
                state === window.YT.PlayerState.PAUSED ||
                state === window.YT.PlayerState.BUFFERING
              ) {
                if (timeUpdaterIntervalRef.current !== null) {
                  clearInterval(timeUpdaterIntervalRef.current);
                  timeUpdaterIntervalRef.current = null;
                }
                if (state === window.YT.PlayerState.PAUSED && onPause) {
                  onPause();
                }
              } else {
                if (timeUpdaterIntervalRef.current !== null) {
                  clearInterval(timeUpdaterIntervalRef.current);
                  timeUpdaterIntervalRef.current = null;
                }
              }
            },
            onError: (event: any) => {
              console.error("YouTube Player Error:", event.data);
            },
          },
        });
      } catch (error) {
        console.error("Error creating YouTube player:", error);
      }

      return () => {
        cleanupPlayer();
      };
    }, [isApiReady, extractedVideoId, isHostControls]);

    // --- 3. Expose Imperative Methods via Ref ---
    useImperativeHandle(ref, () => ({
      play: () => {
        if (playerRef.current?.playVideo) {
          playerRef.current.playVideo();
        }
      },
      pause: () => {
        if (playerRef.current?.pauseVideo) {
          playerRef.current.pauseVideo();
        }
      },
      seekTo: (seconds: number) => {
        if (playerRef.current?.seekTo) {
          playerRef.current.seekTo(seconds, true);
          lastTimeRef.current = seconds;
        }
      },
      getTime: () => {
        return playerRef.current?.getCurrentTime?.() || 0;
      },
    }));

    // --- Render ---
    if (!extractedVideoId) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-base-200">
          <div className="text-center p-6">
            <p className="text-error font-bold text-lg">Invalid YouTube URL</p>
            <p className="text-base-content/60 text-sm mt-2">
              Please provide a valid YouTube video link
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <div ref={playerDivRef} className="w-full h-full" />

        {!isHostControls && (
          <div className="absolute inset-0 z-10 cursor-default pointer-events-none" />
        )}
      </div>
    );
  },
);

YouTubeIframePlayer.displayName = "YouTubeIframePlayer";

export default YouTubeIframePlayer;
