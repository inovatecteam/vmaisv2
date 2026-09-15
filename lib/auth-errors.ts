/**
 * Mensagens e helpers compartilhados pelos fluxos de autenticação
 * (/auth/callback, /auth/confirm, /entrar, /redefinir-senha).
 *
 * O callback e o middleware redirecionam com `?error=<motivo>`; as páginas
 * traduzem esse motivo para uma mensagem em português. Antes disso o
 * parâmetro era ignorado e o usuário caía no login sem nenhuma explicação.
 */

export type AuthErrorReason =
  | 'link-expirado'
  | 'link-usado'
  | 'navegador-diferente'
  | 'link-invalido'
  | 'sessao'
  | 'auth'

type AuthErrorCopy = { titulo: string; descricao: string }

export const AUTH_ERROR_MESSAGES: Record<AuthErrorReason, AuthErrorCopy> = {
  'link-expirado': {
    titulo: 'Link expirado',
    descricao:
      'O link de recuperação vale por 1 hora e o seu já passou do prazo. Peça um novo email para continuar.',
  },
  'link-usado': {
    titulo: 'Link já utilizado',
    descricao:
      'Cada link de recuperação só funciona uma vez. Peça um novo email para redefinir sua senha.',
  },
  'navegador-diferente': {
    titulo: 'Abra o link no mesmo navegador',
    descricao:
      'Este link precisa ser aberto no mesmo navegador onde você pediu a recuperação. Peça um novo email e abra o link neste aparelho.',
  },
  'link-invalido': {
    titulo: 'Link inválido',
    descricao:
      'Não conseguimos validar este link de recuperação. Peça um novo email para redefinir sua senha.',
  },
  sessao: {
    titulo: 'Sessão encerrada',
    descricao: 'Sua sessão expirou. Entre novamente para continuar.',
  },
  auth: {
    titulo: 'Não foi possível concluir',
    descricao: 'Algo deu errado ao validar seu acesso. Tente novamente.',
  },
}

export function isAuthErrorReason(value: unknown): value is AuthErrorReason {
  return typeof value === 'string' && value in AUTH_ERROR_MESSAGES
}

export function getAuthErrorCopy(value: unknown): AuthErrorCopy | null {
  return isAuthErrorReason(value) ? AUTH_ERROR_MESSAGES[value] : null
}

/**
 * Traduz o erro que o próprio Supabase devolve na querystring
 * (`error`, `error_code`) para um dos nossos motivos.
 */
export function reasonFromSupabaseError(
  errorCode: string | null,
  error: string | null
): AuthErrorReason {
  const code = (errorCode ?? '').toLowerCase()

  if (code.includes('expired')) return 'link-expirado'
  if (code.includes('already') || code.includes('used')) return 'link-usado'
  if (error === 'access_denied') return 'link-invalido'

  return 'link-invalido'
}

/**
 * Traduz a falha do `exchangeCodeForSession` / `verifyOtp`.
 * O erro mais comum do PKCE é o code verifier ausente — acontece quando o
 * usuário pede a recuperação no desktop e abre o email no celular.
 */
export function reasonFromExchangeError(message: string | undefined): AuthErrorReason {
  const msg = (message ?? '').toLowerCase()

  if (msg.includes('code verifier') || msg.includes('code_verifier')) {
    return 'navegador-diferente'
  }
  if (msg.includes('expired')) return 'link-expirado'
  if (msg.includes('already') || msg.includes('used')) return 'link-usado'

  return 'link-invalido'
}

/**
 * Só aceita caminho interno — evita open redirect via `//host` ou URL absoluta
 * no parâmetro `next` do callback.
 */
export function safeNextPath(next: string | null, fallback = '/'): string {
  if (!next) return fallback
  if (!next.startsWith('/')) return fallback
  if (next.startsWith('//')) return fallback
  return next
}

/**
 * Traduz a falha do `resetPasswordForEmail`. O Supabase devolve essas
 * mensagens em inglês e o usuário final não lê inglês.
 * Compartilhado por /esqueci-senha e pelo AuthModal.
 */
export function traduzErroEnvioRecuperacao(message?: string): string {
  const msg = (message ?? '').toLowerCase()

  if (msg.includes('rate limit') || msg.includes('too many') || msg.includes('for security purposes')) {
    return 'Muitas tentativas seguidas. Aguarde alguns minutos antes de pedir outro email.'
  }
  if (msg.includes('invalid') && msg.includes('email')) {
    return 'Email inválido. Confira o endereço digitado.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
  }

  return 'Não foi possível enviar o email de recuperação. Tente novamente em instantes.'
}
