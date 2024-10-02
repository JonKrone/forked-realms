'use client'

import { updateUsername } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { useActionState, useState } from 'react'

interface UserControlClientProps {
  username: string | undefined
  handleSubmit: (formData: FormData) => Promise<void>
}

export function UserControlClient({
  username,
  handleSubmit,
}: UserControlClientProps) {
  const [isEditing, setIsEditing] = useState(false)

  const [error, action] = useActionState(async (_prev: any, form: FormData) => {
    const { error } = await updateUsername(form)
    if (error) {
      return error
    }
  }, null)

  return (
    <form action={action} className="relative">
      <AnimatePresence initial={false} mode="wait">
        {isEditing ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, width: 0 }}
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
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
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
