'use server'

import { actionClient } from '@/lib/safe-action'
import { serverSupabase } from '@/lib/supabase/server'
import { zfd } from 'zod-form-data'

export const updateUsername = actionClient
  .schema(
    zfd.formData({
      username: zfd.text(),
    })
  )
  .stateAction(async ({ parsedInput: { username } }) => {
    return serverSupabase().auth.updateUser({
      data: {
        username,
      },
    })
  })

export const logout = actionClient.stateAction(() => {
  return serverSupabase().auth.signOut()
})
