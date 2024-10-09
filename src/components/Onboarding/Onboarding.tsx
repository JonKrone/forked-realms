'use server'

import { OnboardingContent } from '@/components/Onboarding/OnboardingContent.client'
import { serverSupabase } from '@/lib/supabase/server'

export async function Onboarding() {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()

  if (user?.user_metadata.username) {
    return null
  }

  return <OnboardingContent />
}
