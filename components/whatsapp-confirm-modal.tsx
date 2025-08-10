'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, MessageCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { User, ONG } from '@/types'

const confirmationSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os Termos de Uso e Voluntariado'
  }),
  confirmProfile: z.boolean().refine(val => val === true, {
    message: 'Você deve confirmar a veracidade das informações do seu perfil'
  }),
  observation: z.string().optional(),
})

type ConfirmationData = z.infer<typeof confirmationSchema>

interface WhatsAppConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ong: ONG | null
  user: User | null
  onConfirm: (observation: string) => Promise<void>
}

export function WhatsAppConfirmModal({ 
  open, 
  onOpenChange, 
  ong, 
  user, 
  onConfirm 
}: WhatsAppConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ConfirmationData>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      acceptTerms: false,
      confirmProfile: false,
      observation: '',
    }
  })

  const handleSubmit = async (data: ConfirmationData) => {
    if (!ong || !user) return

    setLoading(true)
    try {
      await onConfirm(data.observation || '')
      form.reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  if (!ong || !user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Confirmar Contato</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Contato com <span className="font-medium">{ong.nome}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Informações do usuário */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              Suas informações que serão enviadas:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Nome:</strong> {user.nome}</div>
              <div><strong>Email:</strong> {user.email}</div>
              {user.telefone && <div><strong>Telefone:</strong> {user.telefone}</div>}
              {user.localizacao && <div><strong>Localização:</strong> {user.localizacao}</div>}
              {user.disponibilidade && <div><strong>Disponibilidade:</strong> {user.disponibilidade}</div>}
              {user.interesses && user.interesses.length > 0 && (
                <div><strong>Interesses:</strong> {user.interesses.join(', ')}</div>
              )}
            </div>
          </div>

          {/* Checkboxes de confirmação */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptTerms"
                checked={form.watch('acceptTerms')}
                onCheckedChange={(checked) => form.setValue('acceptTerms', checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer">
                  Li e aceito os Termos de Uso e Voluntariado
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Ao marcar esta opção, você confirma que leu e concorda com nossos termos.
                </p>
              </div>
            </div>
            {form.formState.errors.acceptTerms && (
              <p className="text-sm text-red-500 ml-6">{form.formState.errors.acceptTerms.message}</p>
            )}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="confirmProfile"
                checked={form.watch('confirmProfile')}
                onCheckedChange={(checked) => form.setValue('confirmProfile', checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="confirmProfile" className="text-sm font-medium cursor-pointer">
                  Confirmo a veracidade das informações do meu perfil
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Suas informações de perfil serão compartilhadas com a ONG.
                </p>
              </div>
            </div>
            {form.formState.errors.confirmProfile && (
              <p className="text-sm text-red-500 ml-6">{form.formState.errors.confirmProfile.message}</p>
            )}
          </div>

          {/* Campo de observação */}
          <div className="space-y-2">
            <Label htmlFor="observation">Mensagem para a ONG (opcional)</Label>
            <Textarea
              id="observation"
              placeholder="Conte um pouco sobre sua motivação, experiência ou como gostaria de ajudar..."
              className="rounded-xl resize-none"
              rows={4}
              {...form.register('observation')}
            />
            <p className="text-xs text-gray-500">
              Esta mensagem será enviada junto com suas informações de perfil.
            </p>
          </div>

          {/* Aviso importante */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Importante:</p>
                <p className="text-yellow-700">
                  Suas informações serão enviadas por email para a ONG e para nossa equipe. 
                  Após confirmar, você será redirecionado para o WhatsApp da organização.
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl sm:w-auto w-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.watch('acceptTerms') || !form.watch('confirmProfile')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar e Ir para WhatsApp
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}