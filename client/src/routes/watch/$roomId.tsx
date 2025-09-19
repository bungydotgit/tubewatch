import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/watch/$roomId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/watch/$roomId"!</div>
}
