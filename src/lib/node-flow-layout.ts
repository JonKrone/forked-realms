'use client'

import { StoryCardNode } from '@/components/StoryFlow/StoryCard'
import { Edge, Node, Position } from '@xyflow/react'
import dagre from 'dagre'

const nodeWidth = 440
const nodeHeight = 220

export function getLayoutedElements(
  nodes: StoryCardNode[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction, nodesep: 90, ranksep: 40 })

  nodes.forEach((node) => {
    const { height } = getNodeDimensions(node)
    dagreGraph.setNode(node.id, { width: nodeWidth, height })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    } as Node
  })

  return { nodes: newNodes, edges }
}

const getNodeDimensions = (node: StoryCardNode) => {
  if (typeof document === 'undefined') {
    return { width: nodeWidth, height: nodeHeight }
  }

  const domEl = document.querySelector(`[data-id="${node.id}"]`) as HTMLElement
  if (!domEl) {
    return { width: nodeWidth, height: nodeHeight }
  }

  return { width: domEl.clientWidth, height: domEl.clientHeight }
}
