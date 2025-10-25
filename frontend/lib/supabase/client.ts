import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in Client Components
 * This client uses cookies for session management
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
