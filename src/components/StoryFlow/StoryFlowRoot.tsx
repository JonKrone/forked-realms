'use server'

import { StoryCardNode } from '@/components/StoryFlow/StoryCard'
import { StoryFlow } from '@/components/StoryFlow/StoryFlow.client'
import { StoryNode } from '@/lib/supabase/story-node'
import { Edge } from '@xyflow/react'

export default async function StoryFlowRoot({ rootId }: { rootId: string }) {
  let storyNodes = await StoryNode.getStoryTree(rootId)

  // if no story nodes exist, create the root node
  if (storyNodes.length === 0) {
    const rootNode = await StoryNode.create({
      id: rootId,
      text: StartingStories[Math.floor(Math.random() * StartingStories.length)],
    })

    if (!rootNode) {
      throw new Error('Failed to create root node')
    }

    storyNodes = [rootNode]
  }

  const { nodes, edges } = nodesAndEdgesFromStoryNodes(storyNodes)

  return <StoryFlow initialNodes={nodes} initialEdges={edges} />
}

interface NodesAndEdges {
  nodes: StoryCardNode[]
  edges: Edge[]
}

type StoryNode = Awaited<ReturnType<typeof StoryNode.getStoryTree>>[number]

const nodesAndEdgesFromStoryNodes = (storyNodes: StoryNode[]) => {
  const parentNodes = new Set<string>(
    storyNodes.filter((node) => node.parentId).map((node) => node.parentId!)
  )

  return storyNodes.reduce<NodesAndEdges>(
    (acc, node: StoryNode) => {
      const flowNode: StoryCardNode = {
        id: node.id,
        type: 'storyCard',
        data: {
          characterDescriptions: node.characterDescriptions || '',
          imagePrompt: node.imagePrompt,
          imageUrl: node.imageUrl,
          text: node.text,
          root: node.parentId === null,
          leaf: !parentNodes.has(node.id),
        },
        position: { x: 0, y: 0 },
      }

      acc.nodes.push(flowNode)

      // If the node has a parent, create an Edge
      if (node.parentId) {
        const flowEdge: Edge = {
          id: `${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
        }
        acc.edges.push(flowEdge)
      }

      return acc
    },
    { nodes: [], edges: [] }
  )
}

const StartingStories = [
  /** a fun one **/ 'An ancient tree in the park starts whispering your name whenever you walk by.',
  "In a world where shadows have their own secrets, you find a key that doesn't fit any lock you've ever seen.",
  'Just as the clock strikes midnight, the stars begin to fall from the sky one by one.',
  "You receive a mysterious message that simply says, 'Meet me where the sun kisses the ocean at dawn.'",
  'The old radio crackles to life, broadcasting a station that vanished decades ago.',
  'A single door appears in the middle of the forest, pulsing with a faint glow.',
  "Every painting you touch comes alive, and they're all trying to tell you something urgent.",
  "You wake up to discover that gravity has reversed, and you're floating toward the sky.",
  'A stray cat crosses your path, but when you look into its eyes, you see entire galaxies swirling within.',
  "Time freezes except for you and a stranger who says, 'I've been looking for you across lifetimes.'",
]
