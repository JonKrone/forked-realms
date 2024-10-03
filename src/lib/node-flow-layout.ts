import { StoryCardNode } from '@/components/StoryFlow/StoryCard'
import { Edge, Node, Position } from '@xyflow/react'
import dagre from 'dagre'

const nodeWidth = 375
const nodeHeight = 187

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

export function getLayoutedElements(
  nodes: StoryCardNode[],
  edges: Edge[],
  direction: 'top-to-bottom' | 'left-to-right' = 'top-to-bottom'
) {
  const isHorizontal = direction === 'left-to-right'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
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
