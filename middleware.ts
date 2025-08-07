import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from '@/types'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  let userProfile = null

  if (session?.user) {
    const { data: profile, error } = await supabase
      .from('users')
      .select('onboarded')
      .eq('id', session.user.id)
      .maybeSingle()
    userProfile = profile
    if (error) {
      console.error('Middleware: Erro ao buscar perfil do usuário:', error)
    }
  }

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/entrar', '/cadastrar', '/esqueci-senha', '/404', '/sobre', '/privacidade', '/termos', '/ajuda']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Verificar se é uma rota admin
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Redirecionar para login se não estiver autenticado em rota não-pública
  if (!isPublicRoute && !session) {
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se usuário está autenticado
  if (session) {
    // Determinar se precisa de onboarding
    const needsOnboarding = !userProfile || userProfile.onboarded !== true

    // Se precisa de onboarding e não está na página de onboarding
    if (needsOnboarding && !request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    
    // Se já fez onboarding e está tentando acessar /onboarding
    if (!needsOnboarding && request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Verificar acesso admin
    if (isAdminRoute) {
      if (!userProfile || !userProfile.is_admin) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de requisição, exceto aqueles que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico (ícone do site)
     * - entrar (página de login)
     * - cadastrar (página de cadastro)
     * - esqueci-senha (página de recuperação)
     * - 404 (página de erro)
     * - sobre (página sobre)
     * - privacidade (página de privacidade)
     * - termos (página de termos)
     * - ajuda (página de ajuda)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|entrar|cadastrar|esqueci-senha|404|sobre|privacidade|termos|ajuda).*)',
  ]
}
