import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/perfil', '/configuracoes', '/onboarding']
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Create response and Supabase client with cookie handling
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — MUST happen before any auth checks
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // For non-protected routes, just return with refreshed cookies
  if (!isProtectedRoute) {
    return supabaseResponse
  }

  // Protected route: redirect if not authenticated
  if (!user) {
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check onboarding status
  const { data: profile, error } = await supabase
    .from('users')
    .select('onboarded')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Middleware: erro ao buscar perfil:', error.message)
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('error', 'session')
    return NextResponse.redirect(redirectUrl)
  }

  const needsOnboarding = !profile || profile.onboarded !== true

  // Redirect to onboarding if needed
  if (needsOnboarding && !request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Redirect away from onboarding if already completed
  if (!needsOnboarding && request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/perfil', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all routes except static files and images.
     * This ensures session cookies are always refreshed.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
