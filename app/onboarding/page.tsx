'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'
import { formatPhone } from '@/lib/utils'
import { LocationPickerMap } from '@/components/map/location-picker-map'
import { 
  Heart, 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Clock, 
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Globe
} from 'lucide-react'

// Schema para voluntários
const voluntarioSchema = z.object({
  interesses: z.string().min(1, 'Selecione pelo menos uma área de interesse'),
  disponibilidade: z.string().min(1, 'Informe sua disponibilidade'),
  localizacao: z.string().min(2, 'Informe sua localização'),
})

// Schema para ONGs
const ongSchema = z.object({
  nome: z.string().min(3, 'Nome da ONG deve ter pelo menos 3 caracteres'),
  tipo: z.string().min(1, 'Selecione pelo menos um tipo de organização'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  short_description: z.string().min(10, 'Descrição curta deve ter pelo menos 10 caracteres').max(200, 'Descrição curta deve ter no máximo 200 caracteres'),
  how_to_help: z.string().optional(),
  additional_categories: z.string().optional(),
  localizacao_tipo: z.enum(['presencial', 'online', 'ambos', 'sem_local'], {
    message: 'Selecione o tipo de localização'
  }),
  lat: z.number().optional(),
  lng: z.number().optional(),
  endereco_online: z.string().optional(),
  endereco_fisico: z.string().optional(),
  whatsapp: z.string().min(1, 'WhatsApp é obrigatório'),
  necessidades: z.string().optional(),
  doacoes: z.string().optional(),
}).refine((data) => {
  if (data.localizacao_tipo === 'presencial') {
    return data.lat && data.lng && data.endereco_fisico
  }
  if (data.localizacao_tipo === 'online') {
    return data.endereco_online
  }
  if (data.localizacao_tipo === 'ambos') {
    return data.lat && data.lng && data.endereco_fisico && data.endereco_online
  }
  // ONGs sem local fixo não precisam de localização fixa
  return true
}, {
  message: "Preencha os campos obrigatórios para o tipo de localização selecionado",
  path: ["localizacao_tipo"]
})

type VoluntarioData = z.infer<typeof voluntarioSchema>
type ONGData = z.infer<typeof ongSchema>

const interessesOptions = [
  'Educação', 'Saúde', 'Meio Ambiente', 'Assistência Social', 
  'Cultura', 'Esporte', 'Direitos Humanos', 'Proteção Animal',
  'Tecnologia', 'Arte', 'Música', 'Literatura'
]

const tiposOng = [
  'Educação', 'Saúde', 'Meio Ambiente', 'Assistência Social',
  'Cultura', 'Esporte', 'Direitos Humanos', 'Proteção Animal',
  'Desenvolvimento Comunitário', 'Outros'
]

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedInteresses, setSelectedInteresses] = useState<string[]>([])
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [selectedLat, setSelectedLat] = useState<number | null>(null)
  const [selectedLng, setSelectedLng] = useState<number | null>(null)

  const voluntarioForm = useForm<VoluntarioData>({
    resolver: zodResolver(voluntarioSchema)
  })

  const ongForm = useForm<ONGData>({
    resolver: zodResolver(ongSchema)
  })

  // Redirecionar se usuário já fez onboarding
  useEffect(() => {
    if (user && user.onboarded) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user && user.onboarded) {
    return null // Será redirecionado pelo useEffect
  }

  const isVoluntario = user.tipo === 'voluntario'
  const totalSteps = isVoluntario ? 2 : 3
  const progress = (currentStep / totalSteps) * 100

  const handleInteresseToggle = (interesse: string) => {
    setSelectedInteresses(prev => {
      const newInteresses = prev.includes(interesse)
        ? prev.filter(i => i !== interesse)
        : [...prev, interesse]
      
      voluntarioForm.setValue('interesses', newInteresses.join(', '))
      return newInteresses
    })
  }

  const handleTipoToggle = (tipo: string) => {
    setSelectedTipos(prev => {
      const newTipos = prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
      
      ongForm.setValue('tipo', newTipos.join(', '))
      return newTipos
    })
  }

  const handleVoluntarioSubmit = async (data: VoluntarioData) => {
    setLoading(true)
    try {
      // Validate all required fields before submission
      const isValid = await voluntarioForm.trigger()
      if (!isValid) {
        toast.error('Por favor, preencha todos os campos obrigatórios')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('users')
        .update({
          interesses: selectedInteresses,
          disponibilidade: data.disponibilidade,
          localizacao: data.localizacao,
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshUser()
      toast.success('Perfil configurado com sucesso!')
      router.push('/perfil')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleOngSubmit = async (data: ONGData) => {
    setLoading(true)
    try {
      // Validate all required fields before submission
      const isValid = await ongForm.trigger()
      if (!isValid) {
        toast.error('Por favor, preencha todos os campos obrigatórios')
        setLoading(false)
        return
      }

      // Atualizar dados do usuário
      const { error: userError } = await supabase
        .from('users')
        .update({
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Criar registro da ONG
      const ongData = {
        user_id: user.id,
        nome: data.nome,
        tipo: selectedTipos,
        descricao: data.descricao,
        short_description: data.short_description || null,
        how_to_help: data.how_to_help || null,
        doacoes: data.doacoes || null,
        localizacao_tipo: data.localizacao_tipo,
        endereco_fisico: data.endereco_fisico || null,
        endereco_online: data.endereco_online ? data.endereco_online.split(',').map(e => e.trim()).filter(Boolean) : null,
        whatsapp: data.whatsapp || null,
        necessidades: data.necessidades ? data.necessidades.split(',').map(n => n.trim()).filter(Boolean) : null,
        lat: selectedLat,
        lng: selectedLng,
        admin_approved: false,
      }

      const { error: ongError } = await supabase
        .from('ongs')
        .insert(ongData)

      if (ongError) throw ongError

      await refreshUser()
      toast.success('Organização cadastrada com sucesso!')
      router.push('/perfil')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar organização')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLat(lat)
    setSelectedLng(lng)
    ongForm.setValue('lat', lat, { shouldDirty: true })
    ongForm.setValue('lng', lng, { shouldDirty: true })
  }

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (isVoluntario) {
        if (currentStep === 1) {
          // Step 1: Check if interests are selected
          if (selectedInteresses.length === 0) {
            toast.error('Selecione pelo menos uma área de interesse')
            return
          }
        }
      } else {
        // ONG validation
        if (currentStep === 1) {
          // Step 1: Validate basic information using react-hook-form validation
          const isValid = await ongForm.trigger(['nome', 'descricao', 'short_description'])
          
          if (!isValid) {
            return // Form validation will show errors automatically
          }
          
          if (selectedTipos.length === 0) {
            toast.error('Selecione pelo menos um tipo de organização')
            return
          }
        } else if (currentStep === 2) {
          // Step 2: Validate location and contact
          const localizacaoTipo = ongForm.getValues('localizacao_tipo')
          
          if (!localizacaoTipo) {
            toast.error('Selecione o tipo de atuação')
            return
          }
          
          // Validate WhatsApp (required for all)
          if (!ongForm.getValues('whatsapp') || (ongForm.getValues('whatsapp') || '').trim().length === 0) {
            toast.error('WhatsApp é obrigatório')
            return
          }
          
          if (localizacaoTipo === 'presencial' || localizacaoTipo === 'ambos') {
            if (!selectedLat || !selectedLng) {
              toast.error('Selecione a localização no mapa')
              return
            }
            
            if (!ongForm.getValues('endereco_fisico') || (ongForm.getValues('endereco_fisico') || '').trim().length === 0) {
              toast.error('Endereço físico é obrigatório para organizações presenciais')
              return
            }
          }
          
          if (localizacaoTipo === 'online') {
            const enderecoOnline = ongForm.getValues('endereco_online')
            if (!enderecoOnline || (ongForm.getValues('endereco_online') || '').trim().length === 0) {
              toast.error('Informe pelo menos um endereço online')
              return
            }
          }
          
          if (localizacaoTipo === 'ambos') {
            const enderecoOnline = ongForm.getValues('endereco_online')
            if (!enderecoOnline || (ongForm.getValues('endereco_online') || '').trim().length === 0) {
              toast.error('Informe pelo menos um endereço online')
              return
            }
          }
        }
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderVoluntarioStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Áreas de Interesse</h2>
              <p className="text-gray-600">Selecione as causas que mais te motivam</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interessesOptions.map((interesse) => (
                <button
                  key={interesse}
                  type="button"
                  onClick={() => handleInteresseToggle(interesse)}
                  disabled={loading}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    selectedInteresses.includes(interesse)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-primary/50 text-gray-700'
                  }`}
                >
                  {interesse}
                </button>
              ))}
            </div>

            {selectedInteresses.length > 0 && (
              <div className="bg-primary/5 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Selecionados:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedInteresses.map((interesse) => (
                    <Badge key={interesse} className="bg-primary/10 text-primary">
                      {interesse}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                onClick={() => nextStep()}
                disabled={loading || selectedInteresses.length === 0}
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <form onSubmit={voluntarioForm.handleSubmit(handleVoluntarioSubmit)} className="space-y-6">
            <div className="text-center mb-8">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Disponibilidade</h2>
              <p className="text-gray-600">Quando você pode contribuir?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disponibilidade">Quando você está disponível?</Label>
                <Select
                  value={voluntarioForm.watch('disponibilidade') || ''}
                  onValueChange={(value) => {
                    voluntarioForm.setValue('disponibilidade', value)
                    voluntarioForm.trigger('disponibilidade')
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione sua disponibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhãs">Manhãs</SelectItem>
                    <SelectItem value="Tardes">Tardes</SelectItem>
                    <SelectItem value="Noites">Noites</SelectItem>
                    <SelectItem value="Fins de semana">Fins de semana</SelectItem>
                    <SelectItem value="Dias úteis">Dias úteis</SelectItem>
                    <SelectItem value="Flexível">Horário flexível</SelectItem>
                  </SelectContent>
                </Select>
                {voluntarioForm.formState.errors.disponibilidade && (
                  <p className="text-sm text-red-500">{voluntarioForm.formState.errors.disponibilidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Sua localização</Label>
                <Input
                  id="localizacao"
                  placeholder="Ex: Porto Alegre, RS"
                  className="rounded-xl"
                  disabled={loading}
                  {...voluntarioForm.register('localizacao', {
                    onBlur: () => voluntarioForm.trigger('localizacao')
                  })}
                />
                {voluntarioForm.formState.errors.localizacao && (
                  <p className="text-sm text-red-500">{voluntarioForm.formState.errors.localizacao.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={loading}
                className="rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !voluntarioForm.getValues('disponibilidade') ||
                  !voluntarioForm.getValues('localizacao') ||
                  voluntarioForm.getValues('localizacao').length < 2
                }
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    Finalizar
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  const renderOngStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Informações Básicas</h2>
              <p className="text-gray-600">Conte-nos sobre sua organização</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da organização</Label>
                <Input
                  id="nome"
                  placeholder="Nome da sua ONG"
                  className="rounded-xl"
                  disabled={loading}
                  {...ongForm.register('nome', {
                    onBlur: () => ongForm.trigger('nome')
                  })}
                />
                {ongForm.formState.errors.nome && (
                  <p className="text-sm text-red-500">{ongForm.formState.errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tipos de organização</Label>
                <p className="text-sm text-gray-600 mb-3">Selecione todos os tipos que se aplicam à sua organização</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tiposOng.map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => handleTipoToggle(tipo)}
                      disabled={loading}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        selectedTipos.includes(tipo)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-primary/50 text-gray-700'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>

                {selectedTipos.length > 0 && (
                  <div className="bg-primary/5 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Selecionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTipos.map((tipo) => (
                        <Badge key={tipo} className="bg-primary/10 text-primary">
                          {tipo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {ongForm.formState.errors.tipo && (
                  <p className="text-sm text-red-500">{ongForm.formState.errors.tipo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Completa (máx. 1000 caracteres)</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva os objetivos e atividades da sua organização..."
                  className="rounded-xl resize-none"
                  rows={4}
                  maxLength={1000}
                  disabled={loading}
                  {...ongForm.register('descricao', {
                    onBlur: () => ongForm.trigger('descricao')
                  })}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {ongForm.formState.errors.descricao && (
                      <span className="text-red-500">{ongForm.formState.errors.descricao.message}</span>
                    )}
                  </span>
                  <span>{(ongForm.watch('descricao') || '').length}/1000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Descrição curta (mín. 10, máx. 200 caracteres)</Label>
                <Textarea
                  id="short_description"
                  placeholder="Resumo breve da organização..."
                  className="rounded-xl resize-none"
                  rows={2}
                  maxLength={200}
                  disabled={loading}
                  {...ongForm.register('short_description', {
                    onBlur: () => ongForm.trigger('short_description')
                  })}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {ongForm.formState.errors.short_description && (
                      <span className="text-red-500">{ongForm.formState.errors.short_description.message}</span>
                    )}
                  </span>
                  <span>{(ongForm.watch('short_description') || '').length}/200</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => nextStep()}
                disabled={
                  loading ||
                  selectedTipos.length === 0 ||
                  !ongForm.getValues('nome') ||
                  ongForm.getValues('nome').length < 3 ||
                  !ongForm.getValues('descricao') ||
                  ongForm.getValues('descricao').length < 10 ||
                  ongForm.getValues('descricao').length > 1000 ||
                  !ongForm.getValues('short_description') ||
                  ongForm.getValues('short_description').length < 10 ||
                  ongForm.getValues('short_description').length > 200
                }
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Localização e Contato</h2>
              <p className="text-gray-600">Como vocês atuam e como entrar em contato?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="localizacao_tipo">Tipo de atuação</Label>
                <Select
                  value={ongForm.watch('localizacao_tipo') || ''}
                  onValueChange={(value) => {
                    ongForm.setValue('localizacao_tipo', value as 'presencial' | 'online' | 'ambos')
                    ongForm.trigger('localizacao_tipo')
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Como sua organização atua?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="ambos">Presencial e Online</SelectItem>
                    <SelectItem value="sem_local">Sem local (sem sede fixa)</SelectItem>
                  </SelectContent>
                </Select>
                {ongForm.formState.errors.localizacao_tipo && (
                  <p className="text-sm text-red-500">{ongForm.formState.errors.localizacao_tipo.message}</p>
                )}
              </div>



              {/* Endereço Físico - Required for presencial and ambos */}
              {(ongForm.watch('localizacao_tipo') === 'presencial' || ongForm.watch('localizacao_tipo') === 'ambos') && (
                <div className="space-y-2">
                  <Label htmlFor="endereco_fisico">Endereço Físico *</Label>
                  <Input
                    id="endereco_fisico"
                    placeholder="Rua, número, bairro, cidade - estado"
                    className="rounded-xl"
                    disabled={loading}
                    {...ongForm.register('endereco_fisico', {
                      onBlur: () => ongForm.trigger('endereco_fisico')
                    })}
                  />
                  <p className="text-xs text-gray-500">
                    Endereço completo da sede da organização
                  </p>
                  {ongForm.formState.errors.endereco_fisico && (
                    <p className="text-sm text-red-500">{ongForm.formState.errors.endereco_fisico.message}</p>
                  )}
                </div>
              )}

              {/* Endereços Online - Required for online and ambos, optional for sem_local */}
              {(ongForm.watch('localizacao_tipo') === 'online' || ongForm.watch('localizacao_tipo') === 'ambos' || ongForm.watch('localizacao_tipo') === 'sem_local') && (
                <div className="space-y-2">
                  <Label htmlFor="endereco_online">
                    Endereços Online
                    {(ongForm.watch('localizacao_tipo') === 'online' || ongForm.watch('localizacao_tipo') === 'ambos') && ' *'}
                  </Label>
                  <Input
                    id="endereco_online"
                    placeholder="https://site.com, https://instagram.com/perfil, https://facebook.com/pagina"
                    className="rounded-xl"
                    disabled={loading}
                    {...ongForm.register('endereco_online', {
                      onBlur: () => ongForm.trigger('endereco_online')
                    })}
                  />
                  <p className="text-xs text-gray-500">
                    Adicione múltiplos links separados por vírgula (site, Instagram, Facebook, etc.)
                  </p>
                  {ongForm.formState.errors.endereco_online && (
                    <p className="text-sm text-red-500">{ongForm.formState.errors.endereco_online.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp para contato *</Label>
                <Input
                  id="whatsapp"
                  placeholder="(11) 99999-9999"
                  className="rounded-xl"
                  maxLength={15}
                  disabled={loading}
                  {...ongForm.register('whatsapp', {
                    onChange: (e) => {
                      const formatted = formatPhone(e.target.value)
                      ongForm.setValue('whatsapp', formatted, { shouldDirty: true })
                    },
                    onBlur: () => ongForm.trigger('whatsapp')
                  })}
                />
                {ongForm.formState.errors.whatsapp && (
                  <p className="text-sm text-red-500">{ongForm.formState.errors.whatsapp.message}</p>
                )}
              </div>

              {/* Mapa de localização para ONGs presenciais e ambos (não sem_local) */}
              {(ongForm.watch('localizacao_tipo') === 'presencial' || ongForm.watch('localizacao_tipo') === 'ambos') && ongForm.watch('localizacao_tipo') !== 'sem_local' && (
                <div className="space-y-2">
                  <Label>Localização no Mapa</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Clique no mapa para marcar a localização exata da sua organização
                  </p>
                  <LocationPickerMap
                    initialLat={selectedLat}
                    initialLng={selectedLng}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={() => nextStep()}
                className="bg-primary hover:bg-primary/90 rounded-xl"
                disabled={
                  loading ||
                  !ongForm.getValues('localizacao_tipo') ||
                  !ongForm.getValues('whatsapp') ||
                  (ongForm.getValues('whatsapp') || '').trim().length === 0 ||
                  (ongForm.getValues('localizacao_tipo') === 'presencial' || ongForm.getValues('localizacao_tipo') === 'ambos') && (!selectedLat || !selectedLng || !ongForm.getValues('endereco_fisico') || (ongForm.getValues('endereco_fisico') || '').trim().length === 0) ||
                  (ongForm.getValues('localizacao_tipo') === 'online') && (!ongForm.getValues('endereco_online') || (ongForm.getValues('endereco_online') || '').trim().length === 0) ||
                  (ongForm.getValues('localizacao_tipo') === 'ambos') && (!ongForm.getValues('endereco_online') || (ongForm.getValues('endereco_online') || '').trim().length === 0)
                }
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <form onSubmit={ongForm.handleSubmit(handleOngSubmit)} className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4 fill-current" />
              <h2 className="text-2xl font-bold mb-2">Detalhes Finais</h2>
              <p className="text-gray-600">Como os voluntários podem ajudar?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="necessidades">Como voluntários podem ajudar? (opcional)</Label>
                <Textarea
                  id="necessidades"
                  placeholder="Ex: Aulas de reforço, Arrecadação de doações, Eventos (separados por vírgula)"
                  className="rounded-xl resize-none"
                  rows={3}
                  disabled={loading}
                  {...ongForm.register('necessidades')}
                />
                <p className="text-xs text-gray-500">
                  Tags rápidas para categorizar tipos de ajuda
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="how_to_help">Detalhes sobre como ajudar (opcional)</Label>
                <Textarea
                  id="how_to_help"
                  placeholder="Descreva como voluntários podem contribuir, que tipo de doações são necessárias, etc..."
                  className="rounded-xl resize-none"
                  rows={4}
                  disabled={loading}
                  {...ongForm.register('how_to_help')}
                />
              </div>

            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={loading}
                className="rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    Finalizar Cadastro
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="p-2 bg-primary rounded-md">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Voluntaria<span className="text-primary">+</span></span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, <span className="text-primary">{user.nome}</span>!
          </h1>
          <p className="text-gray-600">
            Vamos configurar seu perfil para conectar você com as melhores oportunidades
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Passo {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content Card */}
        <Card className="rounded-2xl shadow-xl border-0">
          <CardContent className="p-8">
            {isVoluntario ? renderVoluntarioStep() : renderOngStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Suas informações são seguras e podem ser alteradas a qualquer momento no seu perfil.
          </p>
        </div>
      </div>
    </div>
  )
}