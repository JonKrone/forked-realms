import { StoryFlow } from '@/components/StoryFlow/StoryFlow.client'
import { ReactFlowProvider } from '@xyflow/react'

export default function Story({ params }: { params: { rootId: string } }) {
  const rootId = params.rootId

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <StoryFlow rootId={rootId} />
      </ReactFlowProvider>
    </div>
  )
}
