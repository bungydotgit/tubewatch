import { useParams } from "@tanstack/react-router";

export const RoomLayout = ({ videoPlayer }: any) => {
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
        <button className="btn btn-error">Leave</button>
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
            <div className="flex flex-col gap-4 h-full overflow-y-auto">
              {Array.from(new Array(20)).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md bg-base-100 px-3 py-2 flex-shrink-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full h-2 w-2 bg-green-500"></div>
                    <div className="flex gap-2 items-center">
                      <p>adwait</p>
                      <div className="badge badge-soft badge-primary">Host</div>
                    </div>
                  </div>
                  <div className="relative z-10 h-full right-0 top-0 bg-gradient-to-r from-transparent to-base-100">
                    <button className="btn btn-sm btn-error">Kick</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
