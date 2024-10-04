import { ReactFlowProvider } from '@xyflow/react'
import StoryFlow from '../components/StoryFlow/StoryFlow'

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <StoryFlow />
      </ReactFlowProvider>
    </div>
  )
}
