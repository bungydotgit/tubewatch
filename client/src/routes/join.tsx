import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/join')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/join"!</div>
}
