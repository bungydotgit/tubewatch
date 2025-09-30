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
  onSeek?: (seconds: number) => void; // <--- NEW: onSeek prop
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
      onSeek, // <--- NEW: Destructure onSeek
    },
    ref,
  ) => {
    const playerDivRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);

    // --- State for seek detection ---
    const lastTimeRef = useRef(-1); // Stores the last known playback time
    const timeUpdaterIntervalRef = useRef<number | null>(null); // Stores the interval ID

    // Extract the valid 11-character ID from the prop value
    const extractedVideoId = extractVideoId(videoId);

    // --- Internal function to track time and detect seeks ---
    const trackTime = () => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== "function") return;

      const currentTime = player.getCurrentTime();

      if (lastTimeRef.current !== -1) {
        // Detect a significant jump (seek)
        // A threshold of 1.5 seconds is common to differentiate seeks from minor buffering stutters
        if (Math.abs(currentTime - lastTimeRef.current) > 1.5) {
          console.log(`Seek detected! New time: ${currentTime.toFixed(2)}`);
          if (onSeek) {
            onSeek(currentTime); // <--- Call the onSeek prop
          }
        }
      }
      lastTimeRef.current = currentTime;
    };

    // --- 1. Load YouTube Iframe API Script ---
    useEffect(() => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return;
      }

      // Check if script tag already exists
      let scriptTag = document.getElementById(
        "youtube-iframe-api-script",
      ) as HTMLScriptElement;

      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.src = "https://www.youtube.com/iframe_api";
        scriptTag.id = "youtube-iframe-api-script";

        // Handle script load completion
        scriptTag.onload = () => {
          // API might be ready immediately or need the callback
          if (window.YT && window.YT.Player) {
            setIsApiReady(true);
          }
        };

        document.head.appendChild(scriptTag);
      }

      // Define the global callback function required by the API
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
        if (originalCallback) originalCallback();
      };

      return () => {
        // Restore original callback on cleanup
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

      // Generate unique player ID
      const playerId = `ytplayer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      playerDivRef.current.id = playerId;

      // --- Cleanup function for existing player and interval ---
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
        lastTimeRef.current = -1; // Reset last time on player destroy
      };

      // Destroy existing player instance and its interval before creating a new one
      cleanupPlayer();

      // Create new player
      try {
        playerRef.current = new window.YT.Player(playerId, {
          videoId: extractedVideoId,
          playerVars: {
            origin: window.location.origin,
            disablekb: 1,
            controls: isHostControls ? 1 : 0,
            vq: "hd1080",
            autoplay: 0,
            rel: 0, // Don't show related videos
            modestbranding: 1, // Minimal YouTube branding
          },
          events: {
            onReady: (event: any) => {
              console.log("YouTube Player ready for video:", extractedVideoId);
              lastTimeRef.current = event.target.getCurrentTime(); // Initialize lastTime
              if (onReady) onReady();
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (onStateChange) onStateChange(state);

              // --- Handle state changes for seek detection ---
              if (state === window.YT.PlayerState.PLAYING) {
                if (timeUpdaterIntervalRef.current === null) {
                  // Start polling only if not already running
                  timeUpdaterIntervalRef.current = window.setInterval(
                    trackTime,
                    250,
                  ); // Check every 250ms
                }
                if (onPlay) onPlay();
              } else if (
                state === window.YT.PlayerState.PAUSED ||
                state === window.YT.PlayerState.BUFFERING
              ) {
                // Stop polling when paused or buffering (seek often causes buffering)
                if (timeUpdaterIntervalRef.current !== null) {
                  clearInterval(timeUpdaterIntervalRef.current);
                  timeUpdaterIntervalRef.current = null;
                }
                if (state === window.YT.PlayerState.PAUSED && onPause) {
                  onPause();
                }
              } else {
                // For other states like ENDED, CUEUED, etc., stop polling
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
        // Cleanup on component unmount or prop change causing re-initialization
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
          playerRef.current.seekTo(seconds, true); // `true` for allowSeekAhead
          lastTimeRef.current = seconds; // Update lastTime immediately after manual seek
        }
      },
      getTime: () => {
        return playerRef.current?.getCurrentTime?.() || 0;
      },
    }));

    // --- Render ---
    if (!extractedVideoId) {
      return (
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            width: "100%",
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#ef4444",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold" }}>Invalid YouTube URL</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
              Please provide a valid YouTube video link
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          width: "100%",
          backgroundColor: "#1f2937",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          ref={playerDivRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {!isHostControls && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              cursor: "default",
            }}
          />
        )}
      </div>
    );
  },
);

YouTubeIframePlayer.displayName = "YouTubeIframePlayer";

export default YouTubeIframePlayer;
