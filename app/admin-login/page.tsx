'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Shield, ArrowLeft, AlertTriangle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const handleSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      // Fazer login
      const result = await signIn(data.email, data.password)
      
      if (!result.session) {
        toast.error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email.')
        return
      }

      // Verificar se o usuário é admin
      const { data: profile, error } = await supabase
        .from('users')
        .select('is_admin, nome')
        .eq('id', result.user.id)
        .single()

      if (error) {
        console.error('Erro ao verificar permissões:', error)
        toast.error('Erro ao verificar permissões de acesso')
        return
      }

      if (!profile.is_admin) {
        toast.error('Acesso negado. Você não tem permissões de administrador.')
        // Fazer logout do usuário não-admin
        await supabase.auth.signOut()
        return
      }

      toast.success(`Bem-vindo ao painel administrativo, ${profile.nome}!`)
      router.push('/admin')
    } catch (error: any) {
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos.')
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Email não confirmado. Verifique sua caixa de entrada.')
      } else {
        toast.error(error.message || 'Erro ao fazer login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 group mb-6">
            <div className="p-3 bg-primary rounded-xl group-hover:scale-105 transition-transform shadow-lg">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white">Voluntaria<span className="text-primary">+</span></span>
              <p className="text-sm text-gray-400 font-medium">Painel Administrativo</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-gray-400">Entre com suas credenciais de administrador</p>
        </div>

        {/* Warning Card */}
        <Card className="rounded-2xl shadow-2xl border-0 bg-red-950/20 border border-red-500/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-300 text-sm font-medium">Área Restrita</p>
                <p className="text-red-400 text-xs">Apenas administradores autorizados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="rounded-2xl shadow-2xl border-0 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">Login Administrativo</CardTitle>
            <CardDescription className="text-gray-400">
              Use suas credenciais de administrador para acessar o painel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@voluntariaplus.com"
                  className="rounded-xl bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha de administrador"
                    className="rounded-xl bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary pr-10"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl py-3 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando credenciais...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Acessar Painel
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Problemas de acesso? Entre em contato com o suporte técnico
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao site principal
          </button>
        </div>
      </div>
    </div>
  )
}