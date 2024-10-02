import { Button } from '@/components/ui/button'
import { UserControlClient } from '@/components/UserControl.client'
import { serverSupabase } from '@/lib/supabase/server'
import { LogOut } from 'lucide-react'

interface UserControlProps {}

export async function UserControl({}: UserControlProps) {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()
  const username = user?.user_metadata.username
  console.log('user control user', user)

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2">
      <UserControlClient username={username} />
      <Button variant="ghost" size="icon" aria-label="Logout">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
