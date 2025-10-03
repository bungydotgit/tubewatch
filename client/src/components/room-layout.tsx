import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";

interface RoomLayoutProps {
  videoPlayer: React.ReactNode;
  usersList: React.ReactNode;
  chat: React.ReactNode;
  leaveButton?: React.ReactNode;
}

export const RoomLayout = ({
  videoPlayer,
  usersList,
  chat,
  leaveButton,
}: RoomLayoutProps) => {
  const roomId = useParams({
    from: "/watch/$roomId",
    select: (params) => params.roomId,
  });

  const [isMembersOpen, setIsMembersOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    // Use the full viewport height minus the navbar/header space
    <div className="flex flex-col gap-6 p-4 md:p-6 h-[calc(100vh-80px)]">
      {/* Header Component */}
      <div className="flex justify-between items-center rounded-box bg-base-300 py-4 px-6 flex-shrink-0 shadow-md">
        <p className="flex gap-2 items-center text-md">
          <span>Room ID: </span>
          <span
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              toast.success("Copied Room ID to Clipboard.");
            }}
            className="flex items-center text-white bg-base-100/50 rounded-lg px-3 py-1.5 relative group overflow-hidden pr-7"
          >
            {roomId}
            <Copy
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              size={15}
            />
          </span>
        </p>
        {leaveButton}
      </div>

      {/* Main Content Area - Switched to Flexbox for better space distribution */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Members Sidebar */}
        <div
          className={`
            bg-base-300 rounded-box shadow-lg flex flex-col
            transition-[width] duration-300 ease-in-out
            ${isMembersOpen ? "w-72" : "w-20"}
          `}
        >
          {isMembersOpen ? (
            <>
              {/* Members Header */}
              <div className="flex items-center justify-between p-4 border-b border-base-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Members</h3>
                </div>
                <button
                  onClick={() => setIsMembersOpen(false)}
                  className="btn btn-ghost btn-sm btn-square"
                  aria-label="Collapse members panel"
                >
                  {/* Icon direction is more intuitive now */}
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              {/* Members List with proper overflow handling */}
              <div className="flex-1 overflow-y-auto p-4">{usersList}</div>
            </>
          ) : (
            // Collapsed View
            <button
              onClick={() => setIsMembersOpen(true)}
              className="flex flex-col items-center justify-center h-full gap-3 hover:bg-base-100/50 transition-colors rounded-box w-full"
              aria-label="Expand members panel"
            >
              <Users className="w-6 h-6 text-primary" />
              <span className="[writing-mode:vertical-lr] font-semibold text-sm tracking-wider">
                MEMBERS
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Video Player - Takes up all remaining space */}
        <div className="bg-black rounded-box shadow-lg flex-1 min-w-0 overflow-hidden">
          {videoPlayer}
        </div>

        {/* Chat Sidebar */}
        <div
          className={`
            bg-base-300 rounded-box shadow-lg flex flex-col
            transition-[width] duration-300 ease-in-out
            ${isChatOpen ? "w-96" : "w-20"}
          `}
        >
          {isChatOpen ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-base-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold">Chat</h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="btn btn-ghost btn-sm btn-square"
                  aria-label="Collapse chat panel"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              {/* Chat Content with proper overflow handling */}
              <div className="flex-1 overflow-hidden p-4">{chat}</div>
            </>
          ) : (
            // Collapsed View
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex flex-col items-center justify-center h-full gap-3 hover:bg-base-100/50 transition-colors rounded-box w-full"
              aria-label="Expand chat panel"
            >
              <MessageSquare className="w-6 h-6 text-secondary" />
              <span className="[writing-mode:vertical-lr] font-semibold text-sm tracking-wider">
                CHAT
              </span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
