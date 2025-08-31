import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não estiver autenticado, redirecionar para login
  if (!session) {
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se usuário está autenticado, verificar onboarding
  const { data: profile, error } = await supabase
    .from('users')
    .select('onboarded')
    .eq('id', session.user.id)
    .maybeSingle()

  if (error) {
    console.error('Middleware: Erro ao buscar perfil do usuário:', error)
  }

  // Determinar se precisa de onboarding
  const needsOnboarding = !profile || profile.onboarded !== true

  // Se precisa de onboarding e não está na página de onboarding
  if (needsOnboarding && !request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }
  
  // Se já fez onboarding e está tentando acessar /onboarding
  if (!needsOnboarding && request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/perfil', request.url))
  }

  return response
 }

export const config = {
  matcher: [
    /*
     * Protege apenas as rotas que requerem autenticação
     */
    '/dashboard',
    '/perfil',
    '/mapa',
    '/oportunidades',
    '/configuracoes',
    '/onboarding'
  ]
}
