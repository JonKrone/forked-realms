'use client'

import { updateUsername } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { useStateAction } from 'next-safe-action/stateful-hooks'
import { useRef, useState } from 'react'

interface UserControlClientProps {
  username: string | undefined
}

export function UserControlClient({ username }: UserControlClientProps) {
  const btnMotionRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { execute } = useStateAction(updateUsername, {
    onSuccess: () => {
      setIsEditing(false)
    },
  })

  return (
    <form action={execute} className="relative">
      <AnimatePresence initial={false} mode="wait">
        {isEditing ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, width: btnMotionRef.current?.offsetWidth }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              defaultValue={username}
              name="username"
              className="pr-20"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="button"
            ref={btnMotionRef}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="outline" onMouseEnter={() => setIsEditing(true)}>
              {username}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
