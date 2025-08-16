'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Settings, Lock, Mail, Trash2, Eye, EyeOff } from 'lucide-react'
import Footer from '@/components/layout/footer'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual deve ter pelo menos 6 caracteres'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

const emailSchema = z.object({
  newEmail: z.string().email('Email inválido'),
})

type PasswordData = z.infer<typeof passwordSchema>
type EmailData = z.infer<typeof emailSchema>

export default function ConfiguracoesPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema)
  })

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: user?.email || ''
    }
  })

    const handlePasswordChange = async (data: PasswordData) => {
    setLoadingPassword(true)
    try {
      // Primeiro, tentar re-autenticar com a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.currentPassword
      })

      if (signInError) {
        toast.error('Senha atual incorreta')
        return
      }

      // Se a re-autenticação foi bem-sucedida, atualizar a senha
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (error) throw error

      // Se tudo deu certo, primeiro desativa o loading, depois mostra o toast e reseta o formulário
      setLoadingPassword(false) // <--- Mover para cá
      toast.success('Senha alterada com sucesso!')
      passwordForm.reset()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar senha')
    } finally {
      // Este finally atua como uma salvaguarda, caso o setLoadingPassword(false) acima não seja alcançado por algum motivo inesperado.
      // Se o código acima for executado, esta linha será redundante, mas inofensiva.
      setLoadingPassword(false)
    }
  }


  const handleEmailChange = async (data: EmailData) => {
    setLoadingEmail(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.newEmail
      })

      if (error) throw error

      toast.success('Email de confirmação enviado! Verifique sua caixa de entrada.')
      emailForm.reset({ newEmail: data.newEmail })
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar email')
    } finally {
      setLoadingEmail(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoadingDelete(true)
    try {
      // Primeiro, deletar o perfil do usuário (que cascateará para ONGs devido ao ON DELETE CASCADE)
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id)

      if (profileError) throw profileError

      toast.success('Conta excluída com sucesso')
      await signOut()
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir conta')
    } finally {
      setLoadingDelete(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Faça login para acessar as configurações.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-36 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
              <Settings className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm sm:text-base md:text-lg text-primary font-medium">Configurações da Conta</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary">Configurações</span>
            </h1>
            <p className="text-xl text-gray-600">
              Gerencie suas configurações de conta e privacidade
            </p>
          </div>

          <div className="space-y-8">
            {/* Alteração de Senha */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 text-primary mr-3" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura alterando sua senha regularmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha atual"
                        className="rounded-xl pr-10"
                        {...passwordForm.register('currentPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Digite sua nova senha"
                        className="rounded-xl pr-10"
                        {...passwordForm.register('newPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua nova senha"
                      className="rounded-xl"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loadingPassword}
                      className="bg-primary hover:bg-primary/90 rounded-xl"
                    >
                      {loadingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Alterando...
                        </>
                      ) : (
                        'Alterar Senha'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            {/* Exclusão de Conta */}
            <Card className="rounded-2xl shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Trash2 className="h-5 w-5 mr-3" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription>
                  Ações irreversíveis relacionadas à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-xl mb-4">
                  <h3 className="font-semibold text-red-800 mb-2">Excluir minha conta</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos, 
                    incluindo seu perfil, interações e, se aplicável, dados da sua organização.
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Seu perfil será removido permanentemente</li>
                    <li>• Todas as suas interações serão excluídas</li>
                    {user.tipo === 'ong' && <li>• Os dados da sua organização serão removidos</li>}
                    <li>• Esta ação não pode ser desfeita</li>
                  </ul>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-xl">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Minha Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                        e removerá todos os seus dados de nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={loadingDelete}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                      >
                        {loadingDelete ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Excluindo...
                          </>
                        ) : (
                          'Sim, excluir conta'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}