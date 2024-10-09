'use server'

import { actionClient } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'
import { zfd } from 'zod-form-data'

export const updateUsername = actionClient
  .schema(
    zfd.formData({
      username: zfd.text(),
    })
  )
  .stateAction(async ({ parsedInput: { username } }) => {
    return createClient().auth.updateUser({
      data: {
        username,
      },
    })
  })

export const logout = actionClient.stateAction(() => {
  return createClient().auth.signOut()
})
