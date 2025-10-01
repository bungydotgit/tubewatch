import { useParams } from "@tanstack/react-router";

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

  return (
    <div className="flex flex-col gap-5 my-6 h-[calc(100vh-100px)]">
      {/* Header Component */}
      <div className="flex justify-between items-center rounded-lg bg-base-300 py-4 px-6 flex-shrink-0">
        <p className="font-bold text-lg">
          Room Id:{" "}
          <span className="text-accent font-mono bg-base-100 rounded-lg p-2">
            {roomId}
          </span>
        </p>
        {leaveButton}
      </div>

      {/* Video and Side Members Panel */}
      <div className="grid grid-cols-7 gap-6 flex-1 min-h-0">
        {/* Video Player */}
        <div className="bg-base-300 col-span-5 min-h-0 flex items-center justify-center">
          {videoPlayer}
        </div>

        {/* Members Sidebar */}
        <div className="rounded-lg bg-base-300 col-span-2 min-h-0 flex flex-col">
          <div className="py-4 px-6 flex-1 min-h-0 overflow-hidden">
            {usersList}
          </div>
        </div>
      </div>

      <div className="bg-base-300 py-4 px-6">
        {chat || <p>Chat component</p>}
      </div>
    </div>
  );
};
