'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react'

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Relatórios</h1>
          <p className="text-gray-600 mt-2">
            Insights detalhados sobre o desempenho da plataforma
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <BarChart3 className="h-3 w-3 mr-1" />
          Em Desenvolvimento
        </Badge>
      </div>

      {/* Analytics Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Crescimento</CardTitle>
            <CardDescription>
              Métricas de crescimento de usuários e ONGs
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Engajamento</CardTitle>
            <CardDescription>
              Análise de interações e atividade dos usuários
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Demografia</CardTitle>
            <CardDescription>
              Distribuição geográfica e demográfica
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <LineChart className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>
              Métricas de performance e conversão
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráficos de Crescimento</CardTitle>
            <CardDescription>
              Visualizações temporais do crescimento da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gráficos em Desenvolvimento
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Esta seção incluirá gráficos interativos com dados de crescimento, 
                engajamento e performance da plataforma.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Personalizados</CardTitle>
            <CardDescription>
              Geração de relatórios customizados para análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Relatórios em Desenvolvimento
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Ferramentas para gerar relatórios personalizados com 
                filtros avançados e exportação em múltiplos formatos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}