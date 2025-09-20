import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  const { user } = useUser();

  if (!user) {
    return <span className="loading loading-spinner loading-sm"></span>;
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Tubewatch
        </Link>
      </div>
      <div className="flex-none">
        <UserButton
          appearance={{
            elements: {
              userButtonBox: {
                flexDirection: "row-reverse",
              },
            },
          }}
          showName
        />
      </div>
    </div>
  );
}
