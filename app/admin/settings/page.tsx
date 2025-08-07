'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Database, Shield, Bell, Globe, Palette } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600 mt-2">
            Gerencie configurações globais da plataforma Voluntaria+
          </p>
        </div>
        <Badge className="bg-gray-100 text-gray-800">
          <Settings className="h-3 w-3 mr-1" />
          Em Desenvolvimento
        </Badge>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Banco de Dados</CardTitle>
                <CardDescription>Configurações do Supabase</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status da Conexão</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">RLS Habilitado</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Gerenciar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Segurança</CardTitle>
                <CardDescription>Configurações de segurança</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Autenticação 2FA</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rate Limiting</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Configurar Segurança
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Notificações</CardTitle>
                <CardDescription>Sistema de notificações</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email Notifications</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Push Notifications</span>
                <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Gerenciar Notificações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Integração Vercel</CardTitle>
                <CardDescription>Configurações de deploy</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status do Deploy</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Auto Deploy</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Configurar Vercel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Aparência</CardTitle>
                <CardDescription>Temas e personalização</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tema Atual</span>
                <Badge className="bg-yellow-100 text-yellow-800">Amarelo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Modo Escuro</span>
                <Badge className="bg-gray-100 text-gray-800">Disponível</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Personalizar Tema
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Sistema</CardTitle>
                <CardDescription>Configurações gerais</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Versão</span>
                <Badge className="bg-blue-100 text-blue-800">v2.0.0</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Manutenção</span>
                <Badge className="bg-green-100 text-green-800">Normal</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Configurações Gerais
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>
            Detalhes técnicos e status da infraestrutura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Configurações em Desenvolvimento
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Esta seção incluirá configurações avançadas do sistema, 
              logs de atividade e ferramentas de manutenção.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}