'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export type SignUpUserData = {
  nome: string
  tipo: 'voluntario' | 'ong'
  telefone?: string
  bio?: string
}

export type SignUpResult = { error?: string }

/**
 * Cadastro server-side. Mesmo padrão do signInAction: autentica, garante o
 * perfil em `users` e RETORNA — sem redirecionar. A navegação é do cliente e
 * precisa ser "hard" (window.location) pro AuthProvider reler os cookies.
 */
export async function signUpAction(
  email: string,
  password: string,
  userData: SignUpUserData
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
  return {}
}
