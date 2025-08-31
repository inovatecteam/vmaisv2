import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

// Create a browser client that syncs auth state to cookies (compatible with middleware)
let browserSupabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

const getBrowserSupabaseClient = () => {
  if (browserSupabaseClient) return browserSupabaseClient

  // Ensure we only create this on the client
  if (typeof window === 'undefined') {
    throw new Error('Supabase client cannot be created on the server side')
  }

  browserSupabaseClient = createClientComponentClient<Database>()
  return browserSupabaseClient
}

// Lazy proxy to the browser client
export const supabase = new Proxy({} as ReturnType<typeof createClientComponentClient<Database>>, {
  get(_target, prop) {
    const client = getBrowserSupabaseClient()
    return (client as any)[prop]
  }
})

// Server-side helpers should use auth-helpers directly in route handlers or middleware.
// Keeping this export for compatibility, but it will throw to prevent misuse.
export const createServerClient = () => {
  throw new Error('Use @supabase/auth-helpers-nextjs server helpers in server contexts')
}