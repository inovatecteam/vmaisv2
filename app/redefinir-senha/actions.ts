'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export type UpdatePasswordResult = { error?: string }

/**
 * Atualiza a senha do usuário autenticado. Exige sessão ativa (estabelecida
 * pelo /auth/callback depois do PKCE do email de recuperação).
 */
export async function updatePasswordAction(password: string): Promise<UpdatePasswordResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Sessão expirou. Peça um novo email de recuperação.' }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return {}
}
