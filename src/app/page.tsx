import { ReactFlowProvider } from '@xyflow/react'
import { StoryFlow } from '../components/StoryFlow/StoryFlow.client'

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <StoryFlow />
      </ReactFlowProvider>
    </div>
  )
}
