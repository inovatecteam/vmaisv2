'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUpAction } from './actions'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Heart, ArrowLeft, User, Building } from 'lucide-react'
import { formatPhone } from '@/lib/utils'

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  tipo: z.enum(['voluntario', 'ong']),
  telefone: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterData = z.infer<typeof registerSchema>

export default function CadastrarPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipo: 'voluntario'
    }
  })

  // Handler para mudança no campo telefone
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    form.setValue('telefone', formatted, { shouldDirty: true })
  }, [form])

  const handleSubmit = async (data: RegisterData) => {
    setLoading(true)
    const { confirmPassword, password, ...userData } = data
    const result = await signUpAction(data.email, password, userData)
    // Em sucesso, a action redireciona e o código abaixo não executa.
    if (result?.error) {
      if (result.error.includes('User already registered')) {
        toast.error('Este email já possui uma conta. Tente fazer login.')
      } else {
        toast.error(result.error)
      }
      setLoading(false)
    }
  }

  const tipoSelecionado = form.watch('tipo')

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Voluntaria<span className="text-primary">+</span></span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Junte-se a nós!</h1>
          <p className="text-gray-600">Crie sua conta e comece a fazer a diferença hoje mesmo</p>
        </div>

        {/* Register Form */}
        <Card className="rounded-2xl shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Criar Nova Conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Tipo de Conta */}
              <div className="space-y-3">
                <Label>Tipo de conta</Label>
                <RadioGroup
                  value={form.watch('tipo')}
                  onValueChange={(value) => form.setValue('tipo', value as 'voluntario' | 'ong')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="group" data-state={form.watch('tipo') === 'voluntario' ? 'checked' : 'unchecked'}>
                    <RadioGroupItem value="voluntario" id="voluntario" className="sr-only" />
                    <Label 
                      htmlFor="voluntario" 
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary/10"
                    >
                      <User className="h-8 w-8 mb-2 text-gray-600 group-data-[state=checked]:text-primary" />
                      <span className="font-medium text-gray-700 group-data-[state=checked]:text-primary">Voluntário</span>
                    </Label>
                  </div>
                  <div className="group" data-state={form.watch('tipo') === 'ong' ? 'checked' : 'unchecked'}>
                    <RadioGroupItem value="ong" id="ong" className="sr-only" />
                    <Label 
                      htmlFor="ong" 
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary/10"
                    >
                      <Building className="h-8 w-8 mb-2 text-gray-600 group-data-[state=checked]:text-primary" />
                      <span className="font-medium text-gray-700 group-data-[state=checked]:text-primary">ONG</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">
                  {tipoSelecionado === 'ong' ? 'Nome do responsável' : 'Nome completo'}
                </Label>
                <Input
                  id="nome"
                  placeholder={tipoSelecionado === 'ong' ? 'Nome do responsável pela ONG' : 'Seu nome completo'}
                  className="rounded-xl"
                  {...form.register('nome')}
                />
                {form.formState.errors.nome && (
                  <p className="text-sm text-red-500">{form.formState.errors.nome.message}</p>
                )}
              </div>

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
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  className="rounded-xl"
                  value={form.watch('telefone') || ''}
                  onChange={handlePhoneChange}
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {tipoSelecionado === 'ong' ? 'Sobre a organização (opcional)' : 'Sobre você (opcional)'}
                </Label>
                <Textarea
                  id="bio"
                  placeholder={tipoSelecionado === 'ong' ? 'Descreva brevemente sua organização...' : 'Conte um pouco sobre você...'}
                  className="rounded-xl resize-none"
                  rows={3}
                  {...form.register('bio')}
                />
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/entrar" className="text-primary hover:underline font-medium">
                  Faça login
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