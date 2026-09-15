import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { EmailOtpType } from '@supabase/supabase-js'
import {
  reasonFromExchangeError,
  reasonFromSupabaseError,
  safeNextPath,
  type AuthErrorReason,
} from '@/lib/auth-errors'

const OTP_TYPES: EmailOtpType[] = ['recovery', 'signup', 'invite', 'magiclink', 'email_change', 'email']

function parseOtpType(value: string | null): EmailOtpType | null {
  return OTP_TYPES.includes(value as EmailOtpType) ? (value as EmailOtpType) : null
}

/**
 * Para onde mandar o usuário quando o link falha.
 *
 * Num fluxo de recuperação, `/redefinir-senha` já tem o card com o botão
 * "Pedir novo email" — é bem mais útil que jogar no login sem contexto.
 */
function destinoDeErro(origin: string, next: string, motivo: AuthErrorReason) {
  const ehRecuperacao = next.startsWith('/redefinir-senha')
  const destino = ehRecuperacao
    ? new URL('/redefinir-senha', origin)
    : new URL('/entrar', origin)

  destino.searchParams.set(ehRecuperacao ? 'motivo' : 'error', motivo)
  return NextResponse.redirect(destino)
}

/**
 * Handler único do callback de email do Supabase. Aceita os três formatos que
 * os templates podem gerar:
 *
 * 1. `?token_hash=...&type=recovery` — verifyOtp no servidor. É o único que
 *    funciona quando o email é aberto em outro navegador/aparelho, porque não
 *    depende de nenhum code verifier guardado localmente.
 * 2. `?code=...` — PKCE (template padrão `{{ .ConfirmationURL }}`). Só funciona
 *    no mesmo navegador que pediu a recuperação.
 * 3. `?error=...&error_code=...` — o próprio Supabase recusou o token.
 *
 * O fragmento `#access_token=...` (flow implícito) não chega ao servidor e é
 * tratado no cliente por `RecoveryHashFallback`.
 */
export async function handleAuthCallback(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const next = safeNextPath(searchParams.get('next'))

  // 3. Supabase já devolveu erro — não há o que trocar.
  const erroSupabase = searchParams.get('error')
  if (erroSupabase) {
    const motivo = reasonFromSupabaseError(searchParams.get('error_code'), erroSupabase)
    return destinoDeErro(origin, next, motivo)
  }

  const tokenHash = searchParams.get('token_hash')
  const type = parseOtpType(searchParams.get('type'))
  const code = searchParams.get('code')

  if (!tokenHash && !code) {
    return destinoDeErro(origin, next, 'link-invalido')
  }

  const supabase = await createClient()

  // 1. token_hash — preferido, funciona em qualquer navegador.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) {
      return destinoDeErro(origin, next, reasonFromExchangeError(error.message))
    }
    return NextResponse.redirect(new URL(next, origin))
  }

  // 2. PKCE.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return destinoDeErro(origin, next, reasonFromExchangeError(error.message))
    }
    return NextResponse.redirect(new URL(next, origin))
  }

  return destinoDeErro(origin, next, 'link-invalido')
}
