'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signInAction } from './actions'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, ArrowLeft, AlertTriangle, KeyRound } from 'lucide-react'
import { LogoVMais } from '@/components/brand/logo-vmais'
import { AtadosBadge } from '@/components/partnership/atados-badge'
import { getAuthErrorCopy } from '@/lib/auth-errors'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginData = z.infer<typeof loginSchema>

export default function EntrarPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [credenciaisInvalidas, setCredenciaisInvalidas] = useState(false)
  const [avisoAuth, setAvisoAuth] = useState<{ titulo: string; descricao: string } | null>(null)

  // O middleware e o /auth/callback redirecionam para cá com `?error=<motivo>`.
  // Esse parametro era simplesmente ignorado: quem caia aqui por link de
  // recuperacao expirado nao recebia explicacao nenhuma.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const copy = getAuthErrorCopy(params.get('error'))
    if (!copy) return

    setAvisoAuth(copy)
    params.delete('error')
    const qs = params.toString()
    history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''))
  }, [])

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const handleSubmit = async (data: LoginData) => {
    setLoading(true)
    const result = await signInAction(data.email, data.password)

    if (result?.error) {
      if (result.error.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos.')
        setCredenciaisInvalidas(true)
      } else {
        toast.error(result.error)
      }
      setLoading(false)
      return
    }

    setCredenciaisInvalidas(false)

    // Navegação HARD (não router.push): a action setou os cookies de sessão no
    // servidor, mas o AuthProvider (client) só relê os cookies quando a página
    // recarrega de verdade. Um redirect soft deixaria a navbar/destino ainda
    // "deslogados" — era exatamente o bug do login "recarrega e nada acontece".
    // Só aceita caminho interno (evita open-redirect via `//host` ou URL absoluta).
    const redirectParam = new URLSearchParams(window.location.search).get('redirect')
    const destino =
      redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
        ? redirectParam
        : '/onboarding'
    window.location.assign(destino)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <LogoVMais className="h-7" />
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
            {avisoAuth && (
              <div
                role="alert"
                className="mb-4 flex items-start space-x-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
              >
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">{avisoAuth.titulo}</p>
                  <p className="text-amber-800">{avisoAuth.descricao}</p>
                  <Link
                    href="/esqueci-senha"
                    className="mt-1 inline-block font-medium text-amber-900 underline"
                  >
                    Pedir novo link de recuperação
                  </Link>
                </div>
              </div>
            )}

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

              <div className="flex justify-end">
                <Link
                  href="/esqueci-senha"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  <KeyRound className="mr-1.5 h-4 w-4" />
                  Esqueci minha senha
                </Link>
              </div>

              {credenciaisInvalidas && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  Não lembra a senha?{' '}
                  <Link href="/esqueci-senha" className="font-medium text-primary underline">
                    Enviar link de recuperação por email
                  </Link>
                </div>
              )}

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

        {/* Selo da parceria — inline porque o Footer nao renderiza em /entrar */}
        <AtadosBadge variant="inline" className="mt-8" />

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