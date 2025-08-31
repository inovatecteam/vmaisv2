import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Lazy initialization for static export compatibility
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Force fresh authentication on each session
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Clear any stale sessions on initialization
      flowType: 'pkce',
    },
    // Add better error handling and retry logic
    global: {
      headers: {
        'X-Client-Info': 'vmais-v2-web',
      },
    },
  })
  
  return supabaseClient
}

// Export a function that gets the client when needed
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(target, prop) {
    const client = getSupabaseClient()
    return client[prop as keyof typeof client]
  }
})

// Helper para cliente do lado do servidor
export const createServerClient = () => {
  return getSupabaseClient()
}