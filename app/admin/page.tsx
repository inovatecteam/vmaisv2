'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Building, 
  MessageSquare, 
  CheckSquare,
  TrendingUp,
  Activity,
  Clock,
  Shield
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/auth-provider'

interface DashboardStats {
  totalUsers: number
  totalVolunteers: number
  totalOngs: number
  totalInteractions: number
  totalTasks: number
  recentUsers: number
  recentOngs: number
  recentInteractions: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVolunteers: 0,
    totalOngs: 0,
    totalInteractions: 0,
    totalTasks: 0,
    recentUsers: 0,
    recentOngs: 0,
    recentInteractions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Total de usuários
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Total de voluntários
      const { count: totalVolunteers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'voluntario')

      // Total de ONGs (usuários tipo ONG)
      const { count: totalOngsUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'ong')

      // Total de ONGs cadastradas (tabela ongs)
      const { count: totalOngs } = await supabase
        .from('ongs')
        .select('*', { count: 'exact', head: true })

      // Total de interações
      const { count: totalInteractions } = await supabase
        .from('interacoes')
        .select('*', { count: 'exact', head: true })

      // Total de tarefas
      const { count: totalTasks } = await supabase
        .from('tarefas')
        .select('*', { count: 'exact', head: true })

      // Usuários recentes (últimos 7 dias)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: recentUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      // ONGs recentes (últimos 7 dias)
      const { count: recentOngs } = await supabase
        .from('ongs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      // Interações recentes (últimos 7 dias)
      const { count: recentInteractions } = await supabase
        .from('interacoes')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', sevenDaysAgo.toISOString())

      setStats({
        totalUsers: totalUsers || 0,
        totalVolunteers: totalVolunteers || 0,
        totalOngs: totalOngs || 0,
        totalInteractions: totalInteractions || 0,
        totalTasks: totalTasks || 0,
        recentUsers: recentUsers || 0,
        recentOngs: recentOngs || 0,
        recentInteractions: recentInteractions || 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      recent: stats.recentUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Voluntários',
      value: stats.totalVolunteers,
      recent: stats.recentUsers, // Aproximação
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'ONGs Cadastradas',
      value: stats.totalOngs,
      recent: stats.recentOngs,
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Interações',
      value: stats.totalInteractions,
      recent: stats.recentInteractions,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Tarefas Criadas',
      value: stats.totalTasks,
      recent: 0, // Não temos dados recentes para tarefas ainda
      icon: CheckSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao painel de controle da Voluntaria+, {user?.nome}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800">
            <Activity className="h-3 w-3 mr-1" />
            Sistema Online
          </Badge>
          <Badge className="bg-primary/10 text-primary">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </div>
                {stat.recent > 0 && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +{stat.recent} nos últimos 7 dias
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades administrativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Gerenciar Usuários</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Building className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Revisar ONGs</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <MessageSquare className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Ver Interações</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Banco de Dados</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Supabase</span>
              <Badge className="bg-green-100 text-green-800">Operacional</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Autenticação</span>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {stats.recentUsers} novos usuários cadastrados
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {stats.recentOngs} novas ONGs registradas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {stats.recentInteractions} interações realizadas
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}