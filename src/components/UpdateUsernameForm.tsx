'use client'

import { updateUsername } from '@/app/actions/auth'
import { useStateAction } from 'next-safe-action/stateful-hooks'
import { FC } from 'react'

interface UpdateUsernameFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  // TODO: next-safe-action request a type like InferStateActionOptions<typeof updateUsername>
  actionOptions?: any
}

export const UpdateUsernameForm: FC<UpdateUsernameFormProps> = ({
  children,
  actionOptions,
}) => {
  const { execute } = useStateAction(updateUsername, actionOptions)

  return <form action={execute}>{children}</form>
}
