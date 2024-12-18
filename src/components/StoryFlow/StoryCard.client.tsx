'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Handle, NodeProps, Position } from '@xyflow/react'

import { SmartImage } from '@/components/StoryFlow/SmartImage.client'
import { Skeleton } from '@/components/ui/skeleton'
import { Node } from '@xyflow/react'

export type StoryCardData = {
  id?: string
  text: string
  root: boolean
  leaf: boolean
  characterDescriptions: string
  imageUrl: string | null
  imagePrompt: string | null
}

export type StoryCardNode = Node<StoryCardData>

const handleStyle = {
  border: 'none',
  backgroundColor: 'rgb(71 85 105)',
}

export const StoryCard = ({ data }: NodeProps<StoryCardNode>) => {
  const { root, leaf, text, imagePrompt, imageUrl } = data

  // Once an image has been generated, make the card clickable
  const clickable = !!imageUrl
  return (
    <Card
      className={cn(
        'bg-transparent border-none shadow-xl shadow-slate-700 overflow-hidden transition-colors duration-200',
        leaf &&
          'border-2 border-dashed border-gray-500  transition-all duration-300',
        clickable &&
          'hover:bg-slate-600 hover:bg-opacity-80 hover:border-gray-500 hover:cursor-pointer active:bg-slate-500 hover:shadow-[0_0_15px_rgba(100,149,237,0.5)]'
      )}
      style={{ width: '32rem' }}
    >
      <div className="relative grid grid-cols-2 min-h-56">
        {!root && (
          <Handle type="target" position={Position.Top} style={handleStyle} />
        )}
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
            {text ? (
              <div
                className={cn(
                  'font-semibold text-lg leading-tight p-5',
                  root && 'text-center'
                )}
              >
                {text}
              </div>
            ) : (
              <div className="w-full h-full space-y-2 p-5">
                <Skeleton className="h-6 bg-secondary/10" />
                <Skeleton className="h-6 bg-secondary/10" />
                <Skeleton className="h-6 bg-secondary/10" />
                <Skeleton className="h-6 bg-secondary/10" />
              </div>
            )}
          </div>
        </div>
        <SmartImage
          imageUrl={imageUrl}
          imagePrompt={imagePrompt}
          label={text}
        />
        {!leaf && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={handleStyle}
          />
        )}
      </div>
    </Card>
  )
}
