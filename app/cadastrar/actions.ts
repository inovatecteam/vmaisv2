'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export type SignUpUserData = {
  nome: string
  tipo: 'voluntario' | 'ong'
  telefone?: string
  bio?: string
}

export type SignUpResult = { error?: string }

/**
 * Cadastro server-side. Mesmo padrão do signInAction: redireciona por
 * padrão (Next 15 propaga cookies em redirect response); `redirectTo: null`
 * desativa o redirect para uso em modais.
 */
export async function signUpAction(
  email: string,
  password: string,
  userData: SignUpUserData,
  redirectTo: string | null = '/onboarding'
): Promise<SignUpResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome: userData.nome,
        tipo: userData.tipo,
        telefone: userData.telefone || null,
        bio: userData.bio || null,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Com email confirmation desligado no Supabase, signUp retorna sessão ativa
  // e um trigger/gatilho no DB (ou esse insert explícito) cria o perfil.
  if (data.user) {
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!profile) {
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        nome: userData.nome,
        tipo: userData.tipo,
        telefone: userData.telefone || null,
        bio: userData.bio || null,
        onboarded: false,
      })

      if (insertError) {
        console.error('Erro ao criar perfil (signUpAction):', insertError.message)
        return { error: 'Erro ao criar perfil do usuário' }
      }
    }
  }

  revalidatePath('/', 'layout')
  if (redirectTo) redirect(redirectTo)
  return {}
}
