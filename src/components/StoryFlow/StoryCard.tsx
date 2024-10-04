import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Handle, NodeProps, Position } from '@xyflow/react'
import Image from 'next/image'
import { FC, memo } from 'react'

import { Node } from '@xyflow/react'

export type StoryCardData = {
  label: string
  ephemeral: boolean
  root: boolean
  leaf: boolean
  imageUrl?: string
  imagePrompt?: string
}

export type StoryCardNode = Node<StoryCardData>

export const StoryCard: FC<NodeProps<StoryCardNode>> = memo(({ data }) => {
  const { root, leaf, label, imagePrompt, imageUrl } = data

  const handleStyle = {
    border: 'none',
    backgroundColor: 'rgb(71 85 105)',
  }

  return (
    <Card
      className={cn(
        'bg-transparent border-none shadow-xl shadow-slate-700 overflow-hidden transition-colors duration-200',
        leaf &&
          'border-2 border-dashed border-gray-500 hover:bg-slate-600 hover:bg-opacity-80 hover:border-gray-500 hover:cursor-pointer active:bg-slate-500 hover:shadow-[0_0_15px_rgba(100,149,237,0.5)] transition-all duration-300'
      )}
      style={{ width: '32rem' }}
    >
      <div className="relative grid grid-cols-2">
        <div>
          <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-lg" />
          <div
            className={cn(
              'text-white rounded-l-lg shadow-lg w-full h-full flex items-center justify-center relative',
              leaf
                ? 'bg-slate-700 bg-opacity-70'
                : 'bg-slate-800 border border-slate-700'
            )}
          >
            {!root && (
              <Handle
                type="target"
                position={Position.Top}
                style={handleStyle}
              />
            )}
            <div
              className={cn(
                'font-semibold text-lg leading-tight p-5',
                root && 'text-center'
              )}
            >
              {label}
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
        {imageUrl && (
          <div className="relative h-full">
            <Image
              src={imageUrl}
              alt={imagePrompt || label}
              fill
              className="rounded-r-lg"
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>
    </Card>
  )
})

// 1274
