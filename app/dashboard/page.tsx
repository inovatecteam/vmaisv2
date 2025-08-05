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
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Search,
  MessageCircle,
  Plus
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'
import Link from 'next/link'
import Footer from '@/components/layout/footer'

interface DashboardStats {
  totalInteracoes: number
  ongsSalvas: number
  tarefasPendentes: number
  tarefasConcluidas: number
  interacoesRecentes: any[]
  tarefasRecentes: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInteracoes: 0,
    ongsSalvas: 0,
    tarefasPendentes: 0,
    tarefasConcluidas: 0,
    interacoesRecentes: [],
    tarefasRecentes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

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

      // Carregar tarefas
      const { data: tarefas, error: tarefasError } = await supabase
        .from('tarefas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (tarefasError) throw tarefasError

      // Calcular estatísticas
      const tarefasPendentes = tarefas?.filter(t => t.status === 'pendente').length || 0
      const tarefasConcluidas = tarefas?.filter(t => t.status === 'concluida').length || 0
      const ongsUnicas = new Set(interacoes?.map(i => i.ong_id))

      setStats({
        totalInteracoes: interacoes?.length || 0,
        ongsSalvas: ongsUnicas.size,
        tarefasPendentes,
        tarefasConcluidas,
        interacoesRecentes: interacoes?.slice(0, 5) || [],
        tarefasRecentes: tarefas?.slice(0, 5) || []
      })

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = () => {
    const total = stats.tarefasPendentes + stats.tarefasConcluidas
    return total > 0 ? (stats.tarefasConcluidas / total) * 100 : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-500'
      case 'em_andamento': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return CheckCircle
      case 'em_andamento': return Clock
      default: return AlertCircle
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
      
      
      
      <Footer />
    </div>
  )
}
