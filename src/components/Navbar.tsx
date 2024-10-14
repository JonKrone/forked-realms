'use server'

import { LogoutButton } from '@/components/LogoutButton.client'
import { Button } from '@/components/ui/button'
import { UsernameField } from '@/components/UsernameField.client'
import { User } from '@/lib/supabase/user'
import { generateId } from 'ai'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'

export async function Navbar() {
  const user = await User.get()
  const username = user?.user_metadata.username

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2">
      <Button variant="outline" asChild>
        <Link href={`/story/${generateId(6)}`}>
          <RefreshCw className="w-4 h-4 mr-2" />
          New Story
        </Link>
      </Button>
      <UsernameField username={username} />
      <LogoutButton />
    </div>
  )
}
