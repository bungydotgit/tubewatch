import { useRoomStore } from "@/store/useRoomStore";
import { useUser } from "@clerk/clerk-react";
import { Crown, UserX } from "lucide-react";

interface UsersListProps {
  onKickUser?: (username: string) => void;
}

export default function UsersList({ onKickUser }: UsersListProps) {
  const { user: currentUser } = useUser();
  const users = useRoomStore((state) => state.users);
  const hostId = useRoomStore((state) => state.hostId);
  const isCurrentUserHost = currentUser?.username === hostId;

  const handleKickUser = (username: string) => {
    if (onKickUser && username !== currentUser?.username) {
      const confirmed = confirm(`Are you sure you want to kick ${username}?`);
      if (confirmed) {
        onKickUser(username);
      }
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/60">
        <p className="text-sm">No users in room</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* User count */}
      <div className="text-xs font-semibold text-base-content/70 px-1">
        {users.length} {users.length === 1 ? "member" : "members"} online
      </div>

      {/* Users list with scroll */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {users.map((roomUser) => {
          const isHost = roomUser.username === hostId;
          const isCurrentUser = roomUser.username === currentUser?.username;
          const canKick = isCurrentUserHost && !isCurrentUser && !isHost;

          return (
            <div
              key={roomUser.socketId}
              className={`group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all flex-shrink-0 ${
                isCurrentUser
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-base-100 hover:bg-base-100/80"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Online indicator */}
                <div className="relative flex-shrink-0">
                  <div className="rounded-full h-2.5 w-2.5 bg-success"></div>
                  <div className="absolute inset-0 rounded-full h-2.5 w-2.5 bg-success animate-ping opacity-75"></div>
                </div>

                {/* User info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {roomUser.username}
                      {isCurrentUser && (
                        <span className="text-primary ml-1">(You)</span>
                      )}
                    </p>
                  </div>
                  {/* Host badge */}
                  {isHost && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Crown className="w-3 h-3 text-warning" />
                      <span className="text-xs text-warning font-semibold">
                        Host
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Kick button */}
              {canKick && onKickUser && (
                <button
                  className="btn btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleKickUser(roomUser.username)}
                  title={`Kick ${roomUser.username}`}
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
