'use client'

import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useStateAction } from 'next-safe-action/stateful-hooks'

export function LogoutButton() {
  // @ts-expect-error TODO look into this type error
  const { execute } = useStateAction(logout)

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Logout"
      onClick={() => execute()}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  )
}
