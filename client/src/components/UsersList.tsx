import { useRoomStore } from "@/store/useRoomStore";
import { useUser } from "@clerk/clerk-react";

interface UsersListProps {
  onKickUser?: (username: string) => void; // Optional kick functionality
}

export default function UsersList({ onKickUser }: UsersListProps) {
  const { user: currentUser } = useUser();
  const users = useRoomStore((state) => state.users);
  const hostId = useRoomStore((state) => state.hostId);

  const isCurrentUserHost = currentUser?.username === hostId;

  const handleKickUser = (username: string) => {
    if (onKickUser && username !== currentUser?.username) {
      // Show confirmation before kicking
      const confirmed = confirm(`Are you sure you want to kick ${username}?`);
      if (confirmed) {
        onKickUser(username);
      }
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/60">
        <p>No users in room</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="text-sm font-semibold text-base-content/80 px-1">
        Users ({users.length})
      </div>

      {users.map((roomUser) => {
        const isHost = roomUser.username === hostId;
        const isCurrentUser = roomUser.username === currentUser?.username;
        const canKick = isCurrentUserHost && !isCurrentUser && !isHost;

        return (
          <div
            key={roomUser.socketId}
            className="flex items-center justify-between rounded-md bg-base-100 px-3 py-2 flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              {/* Online indicator */}
              <div className="rounded-full h-2 w-2 bg-green-500 flex-shrink-0"></div>

              {/* User info */}
              <div className="flex gap-2 items-center min-w-0">
                <p className="truncate">
                  {roomUser.username}
                  {isCurrentUser && " (You)"}
                </p>

                {/* Badges */}
                {isHost && (
                  <div className="badge badge-primary badge-sm">Host</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              {canKick && onKickUser && (
                <button
                  className="btn btn-sm btn-error btn-outline"
                  onClick={() => handleKickUser(roomUser.username)}
                >
                  Kick
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
