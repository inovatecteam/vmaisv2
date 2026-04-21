'use server'

import { createClient } from '@/lib/supabase-server'

export type SignInResult = { error?: string }

export async function signInAction(email: string, password: string): Promise<SignInResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: error.message }
  }

  // Cria perfil na tabela users se ainda não existe (primeiro login)
  if (data.user) {
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!profile) {
      const meta = (data.user.user_metadata || {}) as Record<string, any>
      const nome = meta.nome || data.user.email?.split('@')[0] || 'Usuário'
      const tipo = meta.tipo === 'ong' ? 'ong' : 'voluntario'

      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        nome,
        tipo,
        telefone: meta.telefone || null,
        bio: meta.bio || null,
        onboarded: false,
      })

      if (insertError) {
        console.error('Erro ao criar perfil (signInAction):', insertError.message)
        return { error: 'Erro ao criar perfil do usuário' }
      }
    }
  }

  return {}
}
