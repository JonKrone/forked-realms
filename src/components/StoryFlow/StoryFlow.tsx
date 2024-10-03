'use client'

import { Background, Edge, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo } from 'react'
import { getLayoutedElements } from '../../lib/node-flow-layout'
import StoryCard, { StoryCardNode } from './StoryCard'

const NodeTypes = {
  storyCard: StoryCard,
}

export default function StoryFlow() {
  const initialNodes: StoryCardNode[] = useMemo(
    () => [
      {
        id: '1',
        type: 'storyCard',
        data: {
          label: 'And thus, the universe was created.',
          ephemeral: false,
          root: true,
          leaf: false,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: '2',
        type: 'storyCard',
        data: {
          label: 'You are a wizard',
          ephemeral: true,
          root: false,
          leaf: true,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: '3',
        type: 'storyCard',
        data: {
          label: 'You are a particle of light',
          ephemeral: true,
          root: false,
          leaf: true,
        },
        position: { x: 0, y: 0 },
      },
    ],
    []
  )

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: '1-2',
        source: '1',
        target: '2',
      },
      {
        id: '1-3',
        source: '1',
        target: '3',
      },
    ],
    []
  )

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [initialNodes, initialEdges]
  )

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodeTypes={NodeTypes}
      />
      <Background
        gap={48}
        size={2}
        color="#475569"
        style={{ backgroundColor: '#0f172a' }}
      />
    </ReactFlowProvider>
  )
}
