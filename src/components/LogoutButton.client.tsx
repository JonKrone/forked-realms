'use client'

import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useStateAction } from 'next-safe-action/stateful-hooks'

export function LogoutButton() {
  // TODO look into this type error
  // @ts-expect-error TODO
  const { execute } = useStateAction(logout)

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Logout"
      onClick={() => execute()}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  )
}
