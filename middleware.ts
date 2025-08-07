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
      .select('onboarded, is_admin')
      .eq('id', session.user.id)
      .maybeSingle()
    userProfile = profile
    if (error) {
      console.error('Middleware: Erro ao buscar perfil do usuário:', error)
    }
  }

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/entrar', '/cadastrar', '/esqueci-senha', '/404', '/sobre', '/privacidade', '/termos', '/ajuda', '/admin/login']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Verificar se é uma rota admin
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login'

  // Lógica específica para rotas admin
  if (isAdminRoute && !isAdminLoginRoute) {
    // Se não estiver autenticado, redirecionar para login admin
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Se estiver autenticado mas não for admin, redirecionar para dashboard
    if (!userProfile || !userProfile.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Redirecionar para login se não estiver autenticado em rota não-pública (exceto admin)
  if (!isPublicRoute && !isAdminRoute && !session) {
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se usuário está autenticado
  if (session) {
    // Determinar se precisa de onboarding
    const needsOnboarding = !userProfile || userProfile.onboarded !== true

    // Se precisa de onboarding e não está na página de onboarding (exceto rotas admin)
    if (needsOnboarding && !request.nextUrl.pathname.startsWith('/onboarding') && !isAdminRoute) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    
    // Se já fez onboarding e está tentando acessar /onboarding (exceto se for admin)
    if (!needsOnboarding && request.nextUrl.pathname.startsWith('/onboarding') && !userProfile?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Se admin logado tentar acessar página de login admin, redirecionar para painel
    if (isAdminLoginRoute && userProfile?.is_admin) {
      return NextResponse.redirect(new URL('/admin', request.url))
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
      * - admin/login (página de login admin)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|entrar|cadastrar|esqueci-senha|404|sobre|privacidade|termos|ajuda|admin/login).*)',
  ]
}
