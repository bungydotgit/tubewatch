import Navbar from "@/components/navbar";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-5">
      <Navbar />
      <div className="flex w-full flex-col lg:flex-row py-3">
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-6">
          <h1 className="text-2xl font-bold mb-6">Host a watch party</h1>
          <div>
            <button className="btn btn-accent btn-lg">Host a party</button>
          </div>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-6">
          <h1 className="text-2xl font-bold mb-6">Join a watch party</h1>
          <div className="flex flex-row gap-4">
            <input type="text" placeholder="Large" className="input input-lg" />
            <button className="btn btn-secondary btn-lg">Join</button>
          </div>
        </div>
      </div>
      <div className="bg-base-300 rounded-md p-4">Previous parties</div>
    </div>
  );
}
