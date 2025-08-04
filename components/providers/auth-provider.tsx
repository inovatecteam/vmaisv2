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

  const refreshUser = async () => {
    console.log('🔄 AuthProvider: Iniciando refreshUser...')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('📋 AuthProvider: Sessão obtida:', session ? 'Existe' : 'Não existe')
      console.log('👤 AuthProvider: Usuário da sessão:', session?.user ? session.user.email : 'Nenhum')
      
      if (session?.user) {
        setSupabaseUser(session.user)
        console.log('🔍 AuthProvider: Buscando perfil do usuário no banco...')
        
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        
        console.log('📊 AuthProvider: Perfil encontrado:', profile ? profile.nome : 'Nenhum perfil')
        console.log('📊 AuthProvider: Dados do perfil:', profile)
        console.log('📊 AuthProvider: Status onboarded:', profile?.onboarded)
        setUser(profile)
      } else {
        console.log('❌ AuthProvider: Nenhuma sessão ativa, limpando usuário')
        setSupabaseUser(null)
        setUser(null)
      }
    } catch (error) {
      console.error('❌ AuthProvider: Erro ao carregar usuário:', error)
      setSupabaseUser(null)
      setUser(null)
    } finally {
      console.log('✅ AuthProvider: refreshUser finalizado, loading = false')
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
      async (event, session) => {
        console.log('🔄 AuthProvider: Auth state changed:', event)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await refreshUser()
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 AuthProvider: User signed out')
          setUser(null)
          setSupabaseUser(null)
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