'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

type AuthContextType = {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (authUserId: string) => {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .maybeSingle()

    setUser(profile)
  }

  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        setSupabaseUser(authUser)
        await loadProfile(authUser.id)
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
    } catch (error) {
      console.error('AuthProvider: erro ao carregar usuário:', error instanceof Error ? error.message : error)
      setSupabaseUser(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  useEffect(() => {
    refreshUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // IMPORTANTE: não chamar getSession/getUser (nem queries) de forma
        // síncrona aqui — isso pode causar deadlock no lock interno do
        // GoTrue. Usamos a `session` do próprio evento e adiamos qualquer
        // chamada ao Supabase com setTimeout(0). (Recomendação oficial.)
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setSupabaseUser(null)
          return
        }

        if (session?.user) {
          setSupabaseUser(session.user)
          const userId = session.user.id
          setTimeout(() => {
            loadProfile(userId).catch((error) =>
              console.error('AuthProvider: erro ao carregar perfil:', error)
            )
          }, 0)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
