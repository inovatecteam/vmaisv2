import { supabase } from './supabase'
import { User } from '@/types'

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome: userData.nome,
        tipo: userData.tipo,
        telefone: userData.telefone || null,
        bio: userData.bio || null,
      }
    }
  })

  if (authError) throw authError

  return {
    user: authData.user,
    profile: null,
    session: authData.session
  }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Verificar se o perfil do usuário existe na tabela users
  if (data.user) {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle()

    // Se o perfil não existir, criar um perfil básico
    if (!profile && !profileError) {
      const userMetadata = data.user.user_metadata || {}
      const nomeBasico = userMetadata.nome || data.user.email?.split('@')[0] || 'Usuário'
      const tipoBasico = userMetadata.tipo || 'voluntario'

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          nome: nomeBasico,
          tipo: tipoBasico,
          telefone: userMetadata.telefone || null,
          bio: userMetadata.bio || null,
          onboarded: false,
        })

      if (insertError) {
        console.error('Erro ao criar perfil:', insertError.message)
        throw new Error('Erro ao criar perfil do usuário')
      }
    } else if (profileError) {
      console.error('Erro ao buscar perfil:', profileError.message)
      throw profileError
    }
  }
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return profile
  } catch (error) {
    console.error('Erro ao buscar usuário:', error instanceof Error ? error.message : error)
    return null
  }
}
