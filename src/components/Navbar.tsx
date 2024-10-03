'use server'

import { LogoutButton } from '@/components/LogoutButton.client'
import { UsernameField } from '@/components/UsernameField.client'
import { serverSupabase } from '@/lib/supabase/server'

interface NavbarProps {}

export async function Navbar({}: NavbarProps) {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()

  const username = user?.user_metadata.username

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2">
      <UsernameField username={username} />
      <LogoutButton />
    </div>
  )
}
