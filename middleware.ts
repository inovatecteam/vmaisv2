import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware: Executando para:', request.nextUrl.pathname)
  
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  console.log('🔍 Middleware: Sessão encontrada:', session ? 'Sim' : 'Não')

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/entrar', '/cadastrar', '/esqueci-senha', '/redefinir-senha', '/404', '/sobre', '/privacidade', '/termos', '/ajuda']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Redirecionar para login se não estiver autenticado em rota não-pública
  if (!isPublicRoute && !session) {
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se usuário está autenticado
  if (session) {
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
    
    console.log('🔍 Middleware: Perfil encontrado:', profile ? 'Sim' : 'Não')
    console.log('🔍 Middleware: Status onboarded:', profile?.onboarded)
    console.log('🔍 Middleware: Precisa de onboarding:', needsOnboarding)
    console.log('🔍 Middleware: Rota atual:', request.nextUrl.pathname)
    console.log('🔍 Middleware: É rota de onboarding:', request.nextUrl.pathname.startsWith('/onboarding'))

    // Se precisa de onboarding e não está na página de onboarding
    if (needsOnboarding && !request.nextUrl.pathname.startsWith('/onboarding')) {
      console.log('🔄 Middleware: Redirecionando para /onboarding')
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    
    // Se já fez onboarding e está tentando acessar /onboarding
    if (!needsOnboarding && request.nextUrl.pathname.startsWith('/onboarding')) {
      console.log('🔄 Middleware: Redirecionando para /perfil')
      return NextResponse.redirect(new URL('/perfil', request.url))
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
     * 
     * Nota: /onboarding é tratado pelo middleware para usuários autenticados
     */
    '/((?!api|_next/static|_next/image|favicon.ico|entrar|cadastrar|esqueci-senha|404|sobre|privacidade|termos|ajuda).*)',
    // Adicionar rota específica para garantir que o middleware execute em todas as páginas principais
    '/dashboard',
    '/perfil',
    '/mapa',
    '/oportunidades',
    '/configuracoes',
    '/onboarding'
  ]
}
