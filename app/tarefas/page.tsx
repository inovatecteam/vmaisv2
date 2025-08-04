'use client'

import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckSquare, Clock, Calendar, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'
import Footer from '@/components/layout/footer'

export default function TarefasPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Faça login para acessar suas tarefas.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
              <CheckSquare className="h-5 w-5 text-primary mr-2" />
              <span className="text-primary font-medium">Gerenciamento de Tarefas</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Suas <span className="text-primary">Tarefas</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organize e acompanhe suas atividades de voluntariado de forma eficiente.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-12 w-12 text-primary" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Em Breve
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Estamos desenvolvendo uma ferramenta completa para você gerenciar suas tarefas de voluntariado, 
                definir metas, acompanhar progresso e muito mais!
              </p>

              {/* Features Preview */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/50 p-6 rounded-xl">
                  <CheckSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Criar Tarefas</h3>
                  <p className="text-sm text-gray-600">Organize suas atividades de voluntariado</p>
                </div>
                
                <div className="bg-white/50 p-6 rounded-xl">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Agendar</h3>
                  <p className="text-sm text-gray-600">Defina datas e lembretes</p>
                </div>
                
                <div className="bg-white/50 p-6 rounded-xl">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Acompanhar</h3>
                  <p className="text-sm text-gray-600">Monitore seu progresso</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8">
                    Ir para Dashboard
                  </Button>
                </Link>
                
                <Link href="/catalogo">
                  <Button variant="outline" className="rounded-xl px-8">
                    Explorar ONGs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}