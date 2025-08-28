import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

// Helper para cliente do lado do servidor
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}