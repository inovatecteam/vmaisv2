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
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft, Heart, CheckCircle } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

export default function EsqueciSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const router = useRouter()

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const handleSubmit = async (data: ForgotPasswordData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) throw error

      setSentEmail(data.email)
      setEmailSent(true)
      toast.success('Email de recuperação enviado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
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
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email enviado!</h1>
            <p className="text-gray-600">Verifique sua caixa de entrada para redefinir sua senha</p>
          </div>

          {/* Success Card */}
          <Card className="rounded-2xl shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 mb-1">
                        Email de recuperação enviado
                      </p>
                      <p className="text-sm text-green-700 break-words">
                        Enviamos um link de redefinição para:
                      </p>
                      <p className="text-sm font-medium text-green-800 mt-1 break-words">
                        {sentEmail}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-primary flex-shrink-0">1.</span>
                    <span>Verifique sua caixa de entrada (e spam/lixo eletrônico)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-primary flex-shrink-0">2.</span>
                    <span>Clique no link "Redefinir senha" no email</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-primary flex-shrink-0">3.</span>
                    <span>Crie uma nova senha segura</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-primary flex-shrink-0">4.</span>
                    <span>Faça login com sua nova senha</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Importante:</strong> O link de redefinição expira em 1 hora. 
                    Se não receber o email em alguns minutos, verifique sua pasta de spam.
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3 pt-4">
                  <Button 
                    onClick={() => {
                      setEmailSent(false)
                      form.reset()
                    }}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Enviar para outro email
                  </Button>
                  
                  <Link href="/entrar">
                    <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl">
                      Voltar ao Login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h1>
          <p className="text-gray-600">Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="rounded-2xl shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Recuperar Senha</CardTitle>
            <CardDescription>
              Digite o email da sua conta para receber o link de recuperação
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

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Link de Recuperação
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Lembrou da senha?{' '}
                <Link href="/entrar" className="text-primary hover:underline font-medium">
                  Fazer login
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