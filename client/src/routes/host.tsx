import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/host")({
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
  return <div>Hello "/host"!</div>;
}
