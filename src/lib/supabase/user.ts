import { createClient } from '@/lib/supabase/server'

export const User = {
  get: async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    return data.user
  },
}
