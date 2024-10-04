import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not set')
}

if (!process.env.SUPABASE_API_KEY) {
  throw new Error('SUPABASE_API_KEY is not set')
}

export const serverSupabase = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch (error) {
            // The `setAll` method was called from a Server Component. This can be ignored if you
            // have middleware refreshing user sessions
          }
        },
      },
    }
  )
}
