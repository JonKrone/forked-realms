import { OnboardingDialog } from '@/components/OnboardingDialog'
import { serverSupabase } from '@/lib/supabase/server'

export async function OnboardingDialogGuard() {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()

  if (!user || user.user_metadata.username) {
    return null
  }

  return <OnboardingDialog />
}
