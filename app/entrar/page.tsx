'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '@/lib/auth'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginData = z.infer<typeof loginSchema>

export default function EntrarPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { refreshUser } = useAuth()
  const router = useRouter()

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const handleSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      const result = await signIn(data.email, data.password)
      
      if (!result.session) {
        toast.error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email.')
        return
      }
      
      await refreshUser()
      toast.success('Login realizado com sucesso!')
      router.push('/onboarding')
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
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Voluntaria<span className="text-primary">+</span></span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Entre na sua conta para continuar fazendo a diferença</p>
        </div>

        {/* Login Form */}
        <Card className="rounded-2xl shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Entrar na Plataforma</CardTitle>
            <CardDescription>
              Use suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="rounded-xl"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="rounded-xl pr-10"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/esqueci-senha" className="text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/cadastrar" className="text-primary hover:underline font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}