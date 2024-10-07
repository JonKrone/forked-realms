'use client'

import { generateContinuations, generateImage } from '@/app/actions/stories'
import {
  Background,
  Edge,
  Node,
  NodeMouseHandler,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { generateId } from 'ai'
import { readStreamableValue } from 'ai/rsc'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getLayoutedElements } from '../../lib/node-flow-layout'
import { StoryCard, StoryCardData, StoryCardNode } from './StoryCard'

const StartingStories = [
  "In a world where shadows have their own secrets, you find a key that doesn't fit any lock you've ever seen.",
  'Just as the clock strikes midnight, the stars begin to fall from the sky one by one.',
  "You receive a mysterious message that simply says, 'Meet me where the sun kisses the ocean at dawn.'",
  'The old radio crackles to life, broadcasting a station that vanished decades ago.',
  'A single door appears in the middle of the forest, pulsing with a faint glow.',
  "Every painting you touch comes alive, and they're all trying to tell you something urgent.",
  "You wake up to discover that gravity has reversed, and you're floating toward the sky.",
  /** a fun one **/ 'An ancient tree in the park starts whispering your name whenever you walk by.',
  'A stray cat crosses your path, but when you look into its eyes, you see entire galaxies swirling within.',
  "Time freezes except for you and a stranger who says, 'I've been looking for you across lifetimes.'",
]

const NodeTypes = {
  storyCard: StoryCard,
}

export default function StoryFlow() {
  const { fitView } = useReactFlow()
  const [{ nodes, edges }, setState] = useState<{
    nodes: StoryCardNode[]
    edges: Edge[]
  }>({
    nodes: [
      createNode({
        label:
          StartingStories[Math.floor(Math.random() * StartingStories.length)],
        ephemeral: false,
        root: true,
        leaf: true, // initially, the root is also a leaf
      }),
    ],
    edges: [],
  })

  // initial generation
  useEffect(() => {
    const generateImageForRoot = async () => {
      const rootNode = nodes[0]
      const imagePrompt = `Create an atmospheric and mysterious scene inspired by the beginning line of this story: '${rootNode.data.label}'. The image should capture a sense of intrigue and wonder, with hints of the unknown. The lighting should be dramatic, with deep shadows and subtle highlights that suggest hidden elements in the background. The environment can feel surreal or slightly otherworldly, with textures and objects that invite curiosity.`
      const image = await generateImage({ prompt: imagePrompt })
      if (!image) return

      rootNode.data.imageUrl = image.data?.imageUrl
      rootNode.data.imagePrompt = imagePrompt
      setState((state) => ({ ...state, nodes: [...state.nodes] }))
    }

    generateImageForRoot()

    imagineStorySteps(nodes)
  }, [])

  const handleNewNodeSubmit: NodeMouseHandler<StoryCardNode> = async (
    _evt,
    node
  ) => {
    if (!node.data.ephemeral) return

    // generate new nodes
    imagineStorySteps(
      getPathToRoot(layoutedNodes, layoutedEdges, node.id) as StoryCardNode[]
    )
  }

  const imagineStorySteps = useCallback(async (steps: StoryCardNode[]) => {
    const leafNode = steps.find((n) => n.data.leaf)
    if (!leafNode) {
      throw new Error('No leaf node found') // shouldn't happen
    }
    // mark the leaf node as a part of a story.
    // and generate 3 new template nodes for the story
    const newNodes = [
      createNode({
        label: '',
        ephemeral: true,
        root: false,
        leaf: true,
      }),
      createNode({
        label: '',
        ephemeral: true,
        root: false,
        leaf: true,
      }),
      createNode({
        label: '',
        ephemeral: true,
        root: false,
        leaf: true,
      }),
    ]
    const newEdges = newNodes.map((n, i) => ({
      id: `${leafNode.id}-${n.id}`,
      source: leafNode.id,
      target: n.id,
    }))

    setState((state) => {
      const thisLeaf = state.nodes.find((n) => n.id === leafNode.id)
      if (!thisLeaf) return state
      thisLeaf.data.ephemeral = false
      thisLeaf.data.leaf = false

      return {
        nodes: [...state.nodes, ...newNodes],
        edges: [...state.edges, ...newEdges],
      }
    })

    // begin generating continuations
    const result = await generateContinuations({
      storySteps: getStorySteps(steps),
    })
    if (!result?.data) return

    // listen for streamed continuations and images
    for await (const delta of readStreamableValue(result.data.stream)) {
      if (!delta) continue // empty string is the first value fed to the stream

      try {
        const parsedDelta = JSON.parse(delta || '') as {
          nextPartOfTheStory: string
          imagePrompt: string
          imageUrl: string
        }

        setState((state) => {
          // If the new data contains an imageUrl, update the existing node with the imageUrl
          if (parsedDelta.imageUrl) {
            const nodeToChange = state.nodes.find(
              (n) => n.data.label === parsedDelta.nextPartOfTheStory
            )
            if (nodeToChange) {
              nodeToChange.data.imageUrl = parsedDelta.imageUrl
              nodeToChange.data.imagePrompt = parsedDelta.imagePrompt
            }

            return {
              ...state,
              nodes: [...state.nodes],
            }
          } else {
            // StrictMode invokes setState callbacks twice, so the node we're editing is either empty
            // or already has this story step.
            const nodeToChange = newNodes.find(
              (n) =>
                n.data.label === parsedDelta.nextPartOfTheStory ||
                n.data.label === ''
            )
            if (nodeToChange) {
              nodeToChange.data.label = parsedDelta.nextPartOfTheStory
            }

            return {
              ...state,
              nodes: [...state.nodes],
            }
          }
        })
      } catch (e) {
        console.error('Error parsing story continuations', e)
      }
    }
  }, [])

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(nodes, edges),
    [nodes, edges]
  )

  return (
    <>
      <ReactFlow
        nodes={layoutedNodes as StoryCardNode[]}
        edges={layoutedEdges}
        // fitView
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
      <div className="fixed inset-0 overflow-hidden perspective-[1000px] z-[-1]">
        <div
          className="absolute top-1/2 left-1/2 w-full h-full z-[-1] opacity-30 bg-cover bg-center min-w-[200%] min-h-[200%] preserve-3d"
          style={{
            backgroundImage: 'url(/bg2.webp)',
            animation: 'rotateBackground 80s linear infinite alternate',
          }}
        />
      </div>
    </>
  )
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

/**
 * Returns a string of all the story steps in the order they appear in the story
 */
function getStorySteps(nodes: StoryCardNode[]) {
  return nodes.map((n) => `<story-step>${n.data.label}</story-step>`).join('\n')
}

/** Simple helper to create a new story card node */
function createNode({
  label,
  ephemeral,
  root,
  leaf,
  imageUrl,
  imagePrompt,
}: StoryCardData): StoryCardNode {
  return {
    id: generateId(6),
    type: 'storyCard',
    data: {
      label,
      ephemeral,
      root,
      leaf,
      imageUrl,
      imagePrompt,
    },
    position: { x: 0, y: 0 },
  }
}
