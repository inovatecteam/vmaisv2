'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signInAction } from '@/app/entrar/actions'
import { signUpAction } from '@/app/cadastrar/actions'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle, KeyRound, Mail } from 'lucide-react'
import { formatPhone } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { traduzErroEnvioRecuperacao } from '@/lib/auth-errors'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

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

const recoverSchema = z.object({
  email: z.string().email('Email inválido'),
})

type LoginData = z.infer<typeof loginSchema>
type RecoverData = z.infer<typeof recoverSchema>
type RegisterData = z.infer<typeof registerSchema>

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Modo = 'login' | 'cadastro' | 'recuperar'

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [modo, setModo] = useState<Modo>('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailRecuperacaoEnviado, setEmailRecuperacaoEnviado] = useState('')

  const isLogin = modo === 'login'

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipo: 'voluntario'
    }
  })

  const recoverForm = useForm<RecoverData>({
    resolver: zodResolver(recoverSchema)
  })

  // Recuperação acontece DENTRO do modal em vez de mandar pra /esqueci-senha:
  // sair da página descartaria o contexto salvo pelo caller (ex.: o id da ONG
  // que o oportunidades-client guarda pra reabrir os detalhes depois do login).
  const handleRecover = async (data: RecoverData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
      })
      if (error) throw error

      setEmailRecuperacaoEnviado(data.email)
      toast.success('Email de recuperação enviado!')
    } catch (error: any) {
      toast.error(traduzErroEnvioRecuperacao(error?.message))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (data: LoginData) => {
    setLoading(true)
    const result = await signInAction(data.email, data.password)

    if (result?.error) {
      if (result.error.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos.')
      } else {
        toast.error(result.error)
      }
      setLoading(false)
      return
    }

    // Hard reload garante que AuthProvider + middleware peguem os cookies
    // novos. O caller pode ter salvado state em sessionStorage antes de
    // abrir o modal (ex.: oportunidades-client salva ong.id pra reabrir
    // o modal de detalhes depois do reload).
    onOpenChange(false)
    window.location.reload()
  }

  const handleRegister = async (data: RegisterData) => {
    setLoading(true)
    const { confirmPassword, password, ...userData } = data
    const result = await signUpAction(data.email, password, userData)

    if (result?.error) {
      if (result.error.includes('User already registered')) {
        toast.error('Este email já possui uma conta. Tente fazer login.')
      } else {
        toast.error(result.error)
      }
      setLoading(false)
      return
    }

    onOpenChange(false)
    window.location.reload()
  }

  const irParaModo = (proximo: Modo) => {
    setModo(proximo)
    loginForm.reset()
    registerForm.reset()
    recoverForm.reset()
    setShowPassword(false)
    setEmailRecuperacaoEnviado('')
  }

  const toggleMode = () => irParaModo(isLogin ? 'cadastro' : 'login')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {modo === 'recuperar'
              ? 'Recuperar senha'
              : isLogin
                ? 'Entrar na Plataforma'
                : 'Criar Conta'}
          </DialogTitle>
        </DialogHeader>

        {modo === 'recuperar' ? (
          emailRecuperacaoEnviado ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-left">
                <div className="flex items-start space-x-3">
                  <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div className="min-w-0">
                    <p className="font-medium text-green-800">Email de recuperação enviado</p>
                    <p className="text-sm text-green-700">Enviamos um link de redefinição para:</p>
                    <p className="mt-1 break-words text-sm font-medium text-green-800">
                      {emailRecuperacaoEnviado}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Abra o link <strong>neste mesmo navegador</strong>. Ele vale por 1 hora. Confira
                também a caixa de spam.
              </p>
              <Button
                type="button"
                onClick={() => irParaModo('login')}
                className="w-full rounded-xl bg-primary font-semibold hover:bg-primary/90"
              >
                Voltar ao login
              </Button>
            </div>
          ) : (
            <form onSubmit={recoverForm.handleSubmit(handleRecover)} className="space-y-4">
              <p className="text-sm text-gray-600">
                Digite o email da sua conta e enviaremos um link para criar uma nova senha.
              </p>

              <div className="space-y-2">
                <Label htmlFor="email-recover">Email</Label>
                <Input
                  id="email-recover"
                  type="email"
                  placeholder="seu@email.com"
                  className="rounded-xl"
                  {...recoverForm.register('email')}
                />
                {recoverForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {recoverForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-primary font-semibold hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Enviar link de recuperação
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => irParaModo('login')}
                  className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao login
                </button>
              </div>
            </form>
          )
        ) : isLogin ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="rounded-xl"
                {...loginForm.register('email')}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
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
                  {...loginForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => irParaModo('recuperar')}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                <KeyRound className="mr-1.5 h-4 w-4" />
                Esqueci minha senha
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline"
              >
                Não tem conta? Criar uma agora
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                className="rounded-xl"
                {...registerForm.register('nome')}
              />
              {registerForm.formState.errors.nome && (
                <p className="text-sm text-red-500">{registerForm.formState.errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-register">Email</Label>
              <Input
                id="email-register"
                type="email"
                placeholder="seu@email.com"
                className="rounded-xl"
                {...registerForm.register('email')}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (opcional)</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                className="rounded-xl"
                value={registerForm.watch('telefone') || ''}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  registerForm.setValue('telefone', formatted, { shouldDirty: true })
                }}
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de conta</Label>
              <RadioGroup
                value={registerForm.watch('tipo')}
                onValueChange={(value) => registerForm.setValue('tipo', value as 'voluntario' | 'ong')}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="voluntario" id="voluntario" />
                  <Label htmlFor="voluntario">Voluntário</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ong" id="ong" />
                  <Label htmlFor="ong">ONG</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia (opcional)</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                className="rounded-xl resize-none"
                rows={3}
                {...registerForm.register('bio')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-register">Senha</Label>
              <div className="relative">
                <Input
                  id="password-register"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  className="rounded-xl pr-10"
                  {...registerForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                className="rounded-xl"
                {...registerForm.register('confirmPassword')}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar Conta
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline"
              >
                Já tem conta? Fazer login
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}