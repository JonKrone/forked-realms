import { createBrowserClient } from '@supabase/ssr'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_API_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_API_KEY is not set')
}

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
  )

export const clientSupabase = createClient()
