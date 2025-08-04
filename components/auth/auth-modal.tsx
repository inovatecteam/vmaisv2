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
import { signUp, signIn } from '@/lib/auth'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { formatPhone } from '@/lib/utils'

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

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { refreshUser } = useAuth()
  const router = useRouter()

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipo: 'voluntario'
    }
  })

  const handleLogin = async (data: LoginData) => {
    setLoading(true)
    try {
      const result = await signIn(data.email, data.password)
      
      if (!result.session) {
        toast.error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email.')
        return
      }
      
      await refreshUser()
      toast.success('Login realizado com sucesso!')
      onOpenChange(false)
      router.push('/')
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
      loginForm.reset()
    }
  }

  const handleRegister = async (data: RegisterData) => {
    setLoading(true)
    try {
      const { confirmPassword, password, ...userData } = data
      const result = await signUp(data.email, password, userData)
      
      // Se chegou até aqui, o cadastro foi bem-sucedido
      if (!result.session) {
        // Email de confirmação necessário
        toast.success('Conta criada! Verifique seu email para confirmar o cadastro.')
        onOpenChange(false)
      } else {
        // Sessão estabelecida imediatamente
        await refreshUser()
        toast.success('Conta criada com sucesso!')
        onOpenChange(false)
        router.push('/')
      }
    } catch (error: any) {
      if (error.message?.includes('User already registered')) {
        toast.error('Este email já possui uma conta. Tente fazer login.')
      } else {
        toast.error(error.message || 'Erro ao criar conta')
      }
    } finally {
      setLoading(false)
      registerForm.reset()
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    loginForm.reset()
    registerForm.reset()
    setShowPassword(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
          </DialogTitle>
        </DialogHeader>

        {isLogin ? (
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