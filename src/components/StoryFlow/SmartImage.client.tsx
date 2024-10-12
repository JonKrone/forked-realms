'use client'

import Image from 'next/image'
import { FC, useState } from 'react'

interface SmartImageProps {
  imageUrl: string | null
  imagePrompt: string | null
  label: string
}

export const SmartImage: FC<SmartImageProps> = ({
  imageUrl,
  imagePrompt,
  label,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative h-full">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imagePrompt || label}
          fill
          priority
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
          style={{
            objectFit: 'cover',
          }}
          onLoad={() => {
            setImageLoaded(true)
          }}
        />
      )}
      {!imageLoaded && (
        <div className="relative h-full rounded-r-lg overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              animation: 'gradientWave 750ms linear alternate infinite',
              backgroundImage:
                'linear-gradient(0deg, rgba(115, 100, 217, 0.3), rgba(32, 142, 162, 0.4))',
              backgroundSize: '100% 500%',
            }}
          />
        </div>
      )}
    </div>
  )
}
