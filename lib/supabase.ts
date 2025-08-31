import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Only create the client on the client side
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient
  
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    throw new Error('Supabase client cannot be created on the server side')
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}