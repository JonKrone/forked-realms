'use server'

import { StoryFlow } from '@/components/StoryFlow/StoryFlow.client'

export default async function StoryFlowRoot({ rootId }: { rootId: string }) {
  return <StoryFlow rootId={rootId} />
}
