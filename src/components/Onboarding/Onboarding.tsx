'use server'

import { OnboardingContent } from '@/components/Onboarding/OnboardingContent.client'
import { createClient } from '@/lib/supabase/server'

export async function Onboarding() {
  const {
    data: { user },
  } = await createClient().auth.getUser()

  if (user?.user_metadata.username) {
    return null
  }

  return <OnboardingContent />
}
