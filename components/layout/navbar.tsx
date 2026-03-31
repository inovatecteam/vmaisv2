import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Heart, User, Settings, LogOut, Menu } from 'lucide-react'

export function Navbar() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  

  
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide navbar on auth pages, onboarding, and admin login
  if (
    pathname === '/entrar' || 
    pathname === '/cadastrar' || 
    pathname === '/esqueci-senha' ||
    pathname === '/redefinir-senha' ||
    pathname === '/onboarding' ||
    pathname === '/admin/login'
  ) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Controla o background blur
      setIsScrolled(currentScrollY > 20)
      
      // Controla a visibilidade da navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo e passou de 100px
        setShowNavbar(false)
      } else if (currentScrollY < lastScrollY) {
        // Rolando para cima
        setShowNavbar(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] rounded-2xl border border-gray-200/50 z-50 transform transition-all duration-300 px-4 py-4 ${
      isScrolled ? 'backdrop-blur-md bg-white/90 shadow-lg' : 'bg-white/95'
    } ${showNavbar ? 'translate-y-0' : '-translate-y-[calc(100%+1rem)]'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-8 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group ml-2 md:ml-0">
          <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
            
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Voluntaria<span className="text-primary">+</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-10">
          <Link 
            href="/oportunidades"
            className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
          >
            Oportunidades
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link 
            href="/mapa" 
            className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
          >
            Mapa
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/sobre"
            className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
          >
            Sobre Nós
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          )}
        </div>

        {/* User Section */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.tipo}</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={user.foto || ''} alt={user.nome} />
                  <AvatarFallback className="bg-primary text-white font-semibold">
                    {user.nome.split(' ').map(n => n).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/perfil')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/configuracoes')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/entrar">
                <Button 
                  variant="ghost"
                  className="text-gray-700 hover:text-primary font-semibold rounded-lg px-4"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastrar">
                <Button className="bg-primary hover:bg-primary/90 font-semibold rounded-lg px-6">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary rounded-md">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      Voluntaria<span className="text-primary">+</span>
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 p-6">
                  <nav className="space-y-4">
                    <Link 
                      href="/oportunidades"
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Oportunidades
                    </Link>
                    <Link 
                      href="/mapa" 
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mapa
                    </Link>
                    <Link
                      href="/sobre"
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sobre Nós
                    </Link>
                    {user && (
                      <Link
                        href="/dashboard"
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                  </nav>
                </div>

                {/* User Section */}
                <div className="p-6 border-t bg-gray-50">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={user.foto || ''} alt={user.nome} />
                          <AvatarFallback className="bg-primary text-white font-semibold">
                            {user.nome.split(' ').map(n => n).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.nome}</p>
                          <p className="text-sm text-gray-500 capitalize">{user.tipo}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left"
                          onClick={() => {
                            router.push('/perfil')
                            setMobileMenuOpen(false)
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left"
                          onClick={() => {
                            router.push('/configuracoes')
                            setMobileMenuOpen(false)
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Configurações
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left text-red-600"
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/entrar" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="ghost"
                          className="w-full text-gray-700 hover:text-primary font-semibold"
                        >
                          Entrar
                        </Button>
                      </Link>
                      <Link href="/cadastrar" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90 font-semibold">
                          Cadastrar
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}