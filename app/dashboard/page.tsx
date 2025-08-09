'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Users, 
  MapPin, 
  Search,
  MessageCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'
import Link from 'next/link'
import Footer from '@/components/layout/footer'

interface DashboardStats {
  totalInteracoes: number
  ongsSalvas: number
  interacoesRecentes: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInteracoes: 0,
    ongsSalvas: 0,
    interacoesRecentes: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  // Show login message for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Faça login para acessar sua dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const loadDashboardData = async () => {
    if (!user) return

    try {
      // Carregar interações
      const { data: interacoes, error: interacoesError } = await supabase
        .from('interacoes')
        .select(`
          *,
          ongs (nome, cidade, estado, tipo)
        `)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })

      if (interacoesError) throw interacoesError

      // Calcular estatísticas
      const ongsUnicas = new Set(interacoes?.map(i => i.ong_id))

      setStats({
        totalInteracoes: interacoes?.length || 0,
        ongsSalvas: ongsUnicas.size,
        interacoesRecentes: interacoes?.slice(0, 5) || [],
      })

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Olá, <span className="text-primary">{user?.nome}</span>! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Aqui está um resumo da sua atividade voluntária.
            </p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total de Interações</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.totalInteracoes}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">ONGs Conectadas</p>
                    <p className="text-3xl font-bold text-green-700">{stats.ongsSalvas}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">Atividades</p>
                    <p className="text-3xl font-bold text-yellow-700">Em Breve</p>
                  </div>
                  <div className="p-3 bg-yellow-500 rounded-xl">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Impacto</p>
                    <p className="text-3xl font-bold text-purple-700">Crescendo</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-xl">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl shadow-lg flex-grow">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/oportunidades">
                    <Button className="w-full justify-start bg-primary hover:bg-primary/90 rounded-xl">
                      <Search className="h-4 w-4 mr-2" />
                      Explorar Oportunidades
                    </Button>
                  </Link>
                  <Link href="/mapa">
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver no Mapa
                    </Button>
                  </Link>
                  <Link href="/perfil">
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <Users className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Atividades Recentes */}
            <div className="lg:col-span-2">
              {/* Interações Recentes */}
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-primary mr-2" />
                    Interações Recentes
                  </CardTitle>
                  <CardDescription>
                    Suas últimas conexões com ONGs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.interacoesRecentes.length > 0 ? (
                    <div className="space-y-4">
                      {stats.interacoesRecentes.map((interacao) => (
                        <div key={interacao.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Heart className="h-6 w-6 text-primary fill-current" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{interacao.ongs?.nome}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{interacao.ongs?.cidade}, {interacao.ongs?.estado}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {interacao.ongs?.tipo}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(interacao.timestamp).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">Nenhuma interação ainda</p>
                      <Link href="/oportunidades">
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl">
                          Explorar Oportunidades
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
