import { createClient } from '@/lib/supabase-server'
import { RedefinirSenhaForm } from './form'
import { LinkInvalido } from './link-invalido'
import { isAuthErrorReason, type AuthErrorReason } from '@/lib/auth-errors'

export const dynamic = 'force-dynamic'

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>
}) {
  // A troca do token acontece em /auth/callback (ou /auth/confirm). Quando o
  // usuário chega aqui ele já deveria ter sessão; se não tem, o callback nos
  // manda o motivo pela querystring.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const { motivo } = await searchParams
    const motivoInicial: AuthErrorReason = isAuthErrorReason(motivo) ? motivo : 'link-invalido'
    return <LinkInvalido motivoInicial={motivoInicial} />
  }

  return <RedefinirSenhaForm />
}
