import StoryFlowRoot from '@/components/StoryFlow/StoryFlowRoot'
import { ReactFlowProvider } from '@xyflow/react'

export default function Story({ params }: { params: { rootId: string } }) {
  const rootId = params.rootId

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <StoryFlowRoot rootId={rootId} />
      </ReactFlowProvider>
    </div>
  )
}
