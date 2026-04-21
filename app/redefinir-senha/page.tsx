'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

function RedefinirSenhaContent() {
  const [exchanging, setExchanging] = useState(true)
  const [exchangeError, setExchangeError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setExchangeError('Link inválido. Peça um novo email de recuperação.')
      setExchanging(false)
      return
    }
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setExchangeError(
            'Link expirado ou já utilizado. Peça um novo email de recuperação.'
          )
        }
        setExchanging(false)
      })
  }, [searchParams])

  const handleSubmit = async (data: ResetPasswordData) => {
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) throw error

      await refreshUser()
      toast.success('Senha redefinida com sucesso!')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao redefinir senha')
    } finally {
      setSubmitting(false)
    }
  }

  if (exchanging) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Validando link de recuperação...</p>
        </div>
      </div>
    )
  }

  if (exchangeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
              <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Voluntaria<span className="text-primary">+</span>
              </span>
            </Link>
          </div>
          <Card className="rounded-2xl shadow-xl border-0">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Não foi possível validar o link</h2>
              <p className="text-gray-600">{exchangeError}</p>
              <Link href="/esqueci-senha">
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl">
                  Pedir novo email
                </Button>
              </Link>
              <Link href="/entrar" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Voluntaria<span className="text-primary">+</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Redefinir senha</h1>
          <p className="text-gray-600">Escolha uma nova senha para a sua conta</p>
        </div>

        <Card className="rounded-2xl shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Nova senha</CardTitle>
            <CardDescription>Mínimo de 6 caracteres</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    className="rounded-xl pr-10"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  className="rounded-xl"
                  {...form.register('confirmPassword')}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl py-3"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Redefinir senha'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/entrar" className="text-sm text-gray-600 hover:text-primary transition-colors inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  )
}
