export default function UsersList() {
  return (
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
  );
}
