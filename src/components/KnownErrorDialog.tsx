'use server'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { FC } from 'react'

const fallbackError = (
  <>
    Something went wrong. Please try again.
    <br />
    If this persists, please reach out to me at jonathankrone@gmail.com.
  </>
)

export const KnownErrorDialog: FC<{ code: string; onClose: () => void }> = ({
  code,
  onClose,
}) => {
  const content = {
    'rate-limit-exceeded': (
      <>
        This project has exceeded its monthly API limits.
        <br />
        Please reach out to me at jonathankrone@gmail.com to talk about this
        small experiment.
      </>
    ),
    'something-went-wrong': fallbackError,
  }[code]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle>Whoops!</DialogTitle>
        <DialogDescription>{content || fallbackError}</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
