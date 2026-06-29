'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export type SignInResult = { error?: string }

/**
 * Login server-side. Autentica via signInWithPassword (que grava os cookies de
 * sessão na resposta), garante que o perfil em `users` exista, e RETORNA o
 * resultado — sem redirecionar.
 *
 * A navegação é responsabilidade do cliente, e DEVE ser uma navegação "hard"
 * (window.location), não router.push. O AuthProvider (client) só relê os
 * cookies de sessão num reload de verdade; um redirect soft (server-side ou
 * router.push) deixaria a navbar/destino renderizando o estado deslogado —
 * esse era o bug do "login recarrega e nada acontece".
 */
export async function signInAction(
  email: string,
  password: string
): Promise<SignInResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: error.message }
  }

  // Cria perfil em users se ainda não existe (primeiro login)
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

  revalidatePath('/', 'layout')
  return {}
}
