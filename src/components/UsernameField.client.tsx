'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpdateUsernameForm } from '@/components/UpdateUsernameForm.client'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'

interface UsernameFieldProps {
  username: string | undefined
}

export function UsernameField({ username }: UsernameFieldProps) {
  const btnMotionRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <UpdateUsernameForm
      actionOptions={{ onSuccess: () => setIsEditing(false) }}
    >
      <AnimatePresence initial={false} mode="wait">
        {isEditing ? (
          <motion.div
            key="input"
            initial={{ width: btnMotionRef.current?.offsetWidth }}
            animate={{ width: 'auto' }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              defaultValue={username}
              name="username"
              className="pr-20 bg-white"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="button"
            ref={btnMotionRef}
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            exit={{ width: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="outline" onMouseEnter={() => setIsEditing(true)}>
              {username}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </UpdateUsernameForm>
  )
}
