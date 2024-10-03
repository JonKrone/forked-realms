'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { FC } from 'react'

import { Node } from '@xyflow/react'

export type StoryCardNode = Node<{
  label: string
  ephemeral: boolean
  root: boolean
  leaf: boolean
}>

const StoryCard: FC<NodeProps<StoryCardNode>> = ({ data }) => {
  const { root, leaf, ephemeral } = data

  const handleStyle = {
    border: 'none',
    backgroundColor: 'rgb(71 85 105)',
  }

  return (
    <Card className="bg-transparent border-none shadow-xl shadow-slate-700">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-lg"></div>
        <div
          className={cn(
            'text-white p-4 rounded-lg shadow-lg w-full h-full flex items-center justify-center relative',
            ephemeral
              ? 'bg-slate-700 bg-opacity-70 border-2 border-dashed border-gray-500'
              : 'bg-slate-800 border border-slate-700'
          )}
        >
          {!root && (
            <Handle type="target" position={Position.Top} style={handleStyle} />
          )}
          <div className="font-semibold text-center text-lg leading-tight">
            {data.label}
          </div>
          {!leaf && (
            <Handle
              type="source"
              position={Position.Bottom}
              style={handleStyle}
            />
          )}
        </div>
      </div>
    </Card>
  )
}

export default StoryCard
