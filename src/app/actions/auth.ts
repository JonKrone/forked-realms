import { serverSupabase } from '@/lib/supabase/server'

export async function updateUsername(formData: FormData) {
  const supabase = serverSupabase()
  const username = formData.get('username')

  const { data, error } = await supabase.auth.updateUser({
    data: {
      username,
    },
  })

  return { data, error }
}
