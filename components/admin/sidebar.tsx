'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Heart,
  Home
} from 'lucide-react'

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Visão geral da plataforma'
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users,
    description: 'Gestão de voluntários e ONGs'
  },
  {
    title: 'ONGs',
    href: '/admin/ongs',
    icon: Building,
    description: 'Organizações cadastradas'
  },
  {
    title: 'Interações',
    href: '/admin/interacoes',
    icon: MessageSquare,
    description: 'Conexões entre usuários'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Métricas e relatórios'
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configurações do sistema'
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Voluntaria<span className="text-primary">+</span></h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30">
          InovaTec Dashboard
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  isActive 
                    ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70 mt-0.5">{item.description}</div>
                  </div>
                </div>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <Home className="h-4 w-4 mr-2" />
            Voltar ao Site
          </Button>
        </Link>
      </div>
    </div>
  )
}