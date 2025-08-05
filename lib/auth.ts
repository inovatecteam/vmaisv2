import { supabase } from './supabase'
import { User } from '@/types'

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
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

    // Profile will be created on first login via signIn function
    // This avoids RLS issues during signup
    return { 
      user: authData.user, 
      profile: null,
      session: authData.session 
    }
  } catch (error: any) {
    console.error('Erro no cadastro:', error)
    console.error('Detalhes do erro:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      status: error?.status
    })
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  try {
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

      // Se o perfil não existir (profile é null), criar um perfil básico
      if (!profile && !profileError) {
        console.log('🔧 Perfil não encontrado, criando perfil básico...')
        
        // Usar dados do user_metadata se disponíveis, senão usar dados básicos
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
          console.error('❌ Erro ao criar perfil básico:', insertError)
          throw new Error('Erro ao criar perfil do usuário')
        }
        
        console.log('✅ Perfil básico criado com sucesso')
      } else if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError)
        throw profileError
      }
    }
    return data
  } catch (error: any) {
    console.error('Erro no login:', error)
    console.error('Detalhes do erro:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      status: error?.status
    })
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error: any) {
    console.error('Erro no logout:', error)
    console.error('Detalhes do erro:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      status: error?.status
    })
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) return null

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) throw error

    return profile
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error)
    console.error('Detalhes do erro:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      status: error?.status
    })
    return null
  }
}