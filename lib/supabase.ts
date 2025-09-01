import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

// Simple client initialization - avoid complex proxy patterns that can cause issues
export const supabase = createClientComponentClient<Database>()