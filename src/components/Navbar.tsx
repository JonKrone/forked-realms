'use server'

import { LogoutButton } from '@/components/LogoutButton.client'
import { UsernameField } from '@/components/UsernameField.client'
import { User } from '@/lib/supabase/user'

export async function Navbar() {
  const user = await User.get()
  const username = user?.user_metadata.username

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2">
      <UsernameField username={username} />
      <LogoutButton />
    </div>
  )
}
