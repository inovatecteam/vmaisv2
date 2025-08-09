import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

function Footer() {
  const pathname = usePathname()

  // Hide footer on auth pages and onboarding
  if (
    pathname === '/entrar' || 
    pathname === '/cadastrar' || 
    pathname === '/esqueci-senha' ||
    pathname === '/onboarding' ||
    pathname === '/admin/login'
  ) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-md">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Voluntaria<span className="text-primary">+</span></span>
            </div>
            <p className="text-gray-400">
              Conectando pessoas que querem ajudar com organizações que precisam de voluntários.
            </p>
            
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/oportunidades" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Oportunidades
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Mapa Interativo
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ajuda" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-500" />
                <a className="text-gray-400" href="mailto:voluntariamaisrs@gmail.com">voluntariamaisrs@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <Instagram className="h-5 w-5 text-yellow-500" />
                <a 
                  href="https://instagram.com/voluntariamais" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  @voluntariamais
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-400">Porto Alegre, RS</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy;2025 Voluntaria+ | Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer