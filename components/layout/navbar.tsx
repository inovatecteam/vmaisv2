import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Heart, User, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, signOut } = useAuth()
  
  // Debug logs
  console.log('🔍 Navbar: user recebido do useAuth:', user)
  console.log('🔍 Navbar: user existe?', !!user)
  if (user) {
    console.log('🔍 Navbar: nome do usuário:', user.nome)
    console.log('🔍 Navbar: tipo do usuário:', user.tipo)
  }
  
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="triColorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#00FF00" }} /> {/* Verde */}
        <stop offset="33.33%" style={{ stopColor: "#00FF00" }} />
        <stop offset="33.33%" style={{ stopColor: "#FF0000" }} /> {/* Vermelho */}
        <stop offset="66.66%" style={{ stopColor: "#FF0000" }} />
        <stop offset="66.66%" style={{ stopColor: "#FFFF00" }} /> {/* Amarelo */}
        <stop offset="100%" style={{ stopColor: "#FFFF00" }} />
      </linearGradient>
    </defs>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="url(#triColorGradient)"
    />
  </svg>
</div>

          <span className="text-xl font-bold text-gray-900">Voluntaria<span className="text-primary">+</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link 
            href="/catalogo" 
            className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
          >
            Catálogo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link 
            href="/mapa" 
            className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
          >
            Mapa
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          {user && (
            <Link 
              href="/tarefas" 
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Tarefas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          )}
          {user ? (
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ) : (
            <Link 
              href="/sobre" 
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Sobre Nós
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-6">
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
      </div>
    </nav>
  )
}