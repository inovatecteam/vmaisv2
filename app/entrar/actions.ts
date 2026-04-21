'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export type SignInResult = { error?: string }

/**
 * Login server-side. Quando `redirectTo` é truthy (padrão: /onboarding),
 * redireciona depois do signInWithPassword — padrão oficial Next 15 +
 * @supabase/ssr que garante que os cookies de sessão cheguem ao browser.
 * Quando `redirectTo` é null (uso em modais, p.ex. AuthModal), retorna
 * { ok: true } e o cliente decide como navegar.
 */
export async function signInAction(
  email: string,
  password: string,
  redirectTo: string | null = '/onboarding'
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
  if (redirectTo) redirect(redirectTo)
  return {}
}
