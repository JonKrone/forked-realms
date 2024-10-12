'use client'

import {
  ClientDelta,
  ClientErrors,
  generateContinuations,
  generateImage,
} from '@/app/actions/stories'
import { KnownErrorDialog } from '@/components/KnownErrorDialog'
import { RotatingStarryBackground } from '@/components/StoryFlow/RotatingStarryBackground'
import {
  Background,
  Edge,
  Node,
  NodeMouseHandler,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { generateId } from 'ai'
import { readStreamableValue } from 'ai/rsc'
import { useEffect, useState } from 'react'
import { getLayoutedElements } from '../../lib/node-flow-layout'
import { StoryCard, StoryCardData, StoryCardNode } from './StoryCard.client'

const NodeTypes = {
  storyCard: StoryCard,
}

export interface NodesAndEdges {
  nodes: StoryCardNode[]
  edges: Edge[]
}

interface StoryFlowProps {
  initialNodes: StoryCardNode[]
  initialEdges: Edge[]
}

export function StoryFlow({ initialNodes, initialEdges }: StoryFlowProps) {
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [{ nodes, edges }, setState] = useState<NodesAndEdges>({
    nodes: initialNodes,
    edges: initialEdges,
  })

  // initial generations
  useEffect(() => {
    // TODO: Figure out how to avoid re-generating the image for the root node
    const generateImageForRoot = async () => {
      const rootNode = nodes[0]
      const imagePrompt = `Create a scene inspired by the beginning line of this story: '${rootNode.data.text}'. The image should capture a sense of intrigue and wonder, with hints of the unknown. The lighting should be dramatic and subtle highlights suggest hidden elements in the background. The environment can feel surreal or slightly otherworldly, with textures and objects that invite curiosity.`
      const image = await generateImage({ prompt: imagePrompt })
      if (!image) return

      rootNode.data.imageUrl = image.data?.imageUrl || null
      rootNode.data.imagePrompt = imagePrompt
      setState((state) => ({ ...state, nodes: [...state.nodes] }))
    }

    generateImageForRoot()
    // only generate new story steps if we the root node does not have any children
    if (initialNodes.every((n) => n.data.root)) {
      imagineStorySteps(nodes)
    }
  }, [])

  const handleNewNodeSubmit: NodeMouseHandler<StoryCardNode> = async (
    _evt,
    node
  ) => {
    if (!node.data.leaf) return

    // generate next story steps for the user to select from
    imagineStorySteps(getPathToRoot(nodes, edges, node.id) as StoryCardNode[])
  }

  // Spooky to not memoize this, but React Compiler should do it for us
  const imagineStorySteps = async (steps: StoryCardNode[]) => {
    const leafNode = steps.find((n) => n.data.leaf)
    if (!leafNode) {
      throw new Error('No leaf node found') // shouldn't happen
    }

    // Generate 3 new skeleton nodes for the story
    const newNodes = Array.from({ length: 3 }, () =>
      createNode({
        text: '',
        root: false,
        leaf: true,
        characterDescriptions: '',
      })
    )
    const newEdges = newNodes.map((n, i) => ({
      id: `${leafNode.id}-${n.id}`,
      source: leafNode.id,
      target: n.id,
    }))

    // Update the state with these skeletons while we generate the continuations
    setState((state) => {
      // Update the clicked node to no longer be a leaf
      const thisLeaf = state.nodes.find((n) => n.id === leafNode.id)
      if (!thisLeaf) return state
      thisLeaf.data.leaf = false

      return {
        nodes: [...state.nodes, ...newNodes],
        edges: [...state.edges, ...newEdges],
      }
    })

    // Begin generating continuations
    const result = await generateContinuations({
      parentId: leafNode.id,
      storyNodes: steps.map((s) => s.data),
    })
    if (!result?.data) return

    try {
      for await (const delta of readStreamableValue(result.data.stream)) {
        if (!delta) continue // empty string is the first value fed to the stream

        let parsedDelta: ClientDelta
        try {
          parsedDelta = JSON.parse(delta || '')
        } catch (e) {
          console.error('Error parsing story continuations', e)
          continue
        }

        // We're doing all of this inside of a setState to access the current state without directly
        // depending on it, which would make this imagineStorySteps callback to not be memoizable.
        setState((state) => buildNextNodes(newNodes, state, parsedDelta))
      }
    } catch (e) {
      console.error('Error generating story continuations', e)
      const error = (e as ClientErrors).error
      if (error === 'rate-limit-exceeded') {
        setErrorCode('rate-limit-exceeded')
      } else {
        setErrorCode('something-went-wrong')
      }
    }
  }

  // Spooky to not memoize this, but React Compiler should do it for us
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    nodes,
    edges
  )

  return (
    <>
      {errorCode && (
        <KnownErrorDialog code={errorCode} onClose={() => setErrorCode(null)} />
      )}
      <ReactFlow
        nodes={layoutedNodes as StoryCardNode[]}
        edges={layoutedEdges}
        proOptions={{ hideAttribution: true }}
        nodeTypes={NodeTypes}
        onNodeClick={handleNewNodeSubmit}
        panOnScroll
        zoomOnPinch
        minZoom={0.1}
        onInit={(reactFlowInstance) => {
          reactFlowInstance.fitView({ duration: 0 })
        }}
      />
      <Background
        gap={48}
        size={3}
        color="#475569"
        style={{ backgroundColor: '#0f172a' }}
      />
      {/* Fun little 3d background experiment */}
      <RotatingStarryBackground />
    </>
  )
}

function buildNextNodes(
  newNodes: StoryCardNode[],
  state: { nodes: StoryCardNode[]; edges: Edge[] },
  delta: ClientDelta
) {
  // update an existing node with its new imageUrl
  if (delta.type === 'image-generated') {
    const { id, imageUrl, imagePrompt } = delta.payload

    const nodeToChange = state.nodes.find((n) => n.id === id)
    if (nodeToChange && !nodeToChange.data.imageUrl) {
      nodeToChange.data.imageUrl = imageUrl
      nodeToChange.data.imagePrompt = imagePrompt
    }

    return {
      nodes: state.nodes,
      edges: state.edges,
    }
  }

  const { id, text, characterDescriptions } = delta.payload

  // StrictMode invokes setState callbacks twice, so we may be editing an existing node
  const nodeExists = state.nodes.find((n) => n.data.text === text)
  if (nodeExists) return state

  // Otherwise, we're creating a new node
  const nextNewNode = newNodes.find((n) => n.data.text === '')
  if (nextNewNode) {
    // Because we're changing ids, we need to update all edges that point to the old id
    state.edges = state.edges.map((e) => {
      if (e.target === nextNewNode.id) {
        return { ...e, target: id }
      }
      return e
    })

    nextNewNode.id = id
    nextNewNode.data.text = text
    nextNewNode.data.characterDescriptions = characterDescriptions
  }

  return {
    nodes: state.nodes,
    edges: state.edges,
  }
}

/**
 * Returns a list of all nodes on the unique paths to the root node. Assumes each node has at most
 * one parent and there is only one root node.
 *
 * IMPORTANT: Returns the nodes in the story's order, from root to node
 */
function getPathToRoot(nodes: Node[], edges: Edge[], nodeId: string): Node[] {
  const nodesById = Object.fromEntries(nodes.map((n) => [n.id, n]))
  // Build a parent map: child ID -> parent ID
  const parentMap = Object.fromEntries(
    edges.map((edge) => [edge.target, edge.source])
  )

  function getPath(nodeId: string): Node[] {
    const node = nodesById[nodeId]
    if (node?.data?.root) {
      return [node] // base case: root node
    }
    const parentId = parentMap[nodeId]
    if (!parentId) {
      return [] // shouldn't happen; means the node is not connected to the root
    }
    const pathToRoot = getPath(parentId)

    return [node, ...pathToRoot]
  }

  return getPath(nodeId).reverse()
}

/** Simple helper to create a new story card node */
export function createNode({
  id,
  text,
  root,
  leaf,
  characterDescriptions,
  imageUrl,
  imagePrompt,
}: Partial<StoryCardData>): StoryCardNode {
  return {
    id: id || `temp-${generateId(6)}`,
    type: 'storyCard',
    data: {
      text: text || '',
      root: root || false,
      leaf: leaf || false,
      characterDescriptions: characterDescriptions || '',
      imageUrl: imageUrl || null,
      imagePrompt: imagePrompt || null,
    },
    position: { x: 0, y: 0 },
  }
}
