'use server'

import { LogoutButton } from '@/components/LogoutButton.client'
import { UserControlClient } from '@/components/UserControl.client'
import { serverSupabase } from '@/lib/supabase/server'

interface UserControlProps {}

export async function UserControl({}: UserControlProps) {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()

  const username = user?.user_metadata.username

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2">
      <UserControlClient username={username} />
      <LogoutButton />
    </div>
  )
}
