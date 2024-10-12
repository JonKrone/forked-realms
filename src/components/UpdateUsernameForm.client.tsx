'use client'

import { updateUsername } from '@/app/actions/auth'
import { useStateAction } from 'next-safe-action/stateful-hooks'
import { FC } from 'react'

interface UpdateUsernameFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  // TODO: request a type like InferStateActionOptions<typeof updateUsername> from next-safe-action
  actionOptions?: any
}

export const UpdateUsernameForm: FC<UpdateUsernameFormProps> = ({
  children,
  actionOptions,
}) => {
  const { execute } = useStateAction(updateUsername, actionOptions)

  return <form action={execute}>{children}</form>
}
