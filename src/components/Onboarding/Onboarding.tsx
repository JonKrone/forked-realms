'use server'

import { OnboardingContent } from '@/components/Onboarding/OnboardingContent.client'
import { User } from '@/lib/supabase/user'

export async function Onboarding() {
  const user = await User.get()

  if (user?.user_metadata.username) {
    return null
  }

  return <OnboardingContent />
}
