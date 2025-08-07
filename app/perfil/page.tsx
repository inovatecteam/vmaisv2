'use client'

import { useState, useEffect, useRef } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Building, MapPin, Phone, Mail, Save, X, Camera, Image, Upload } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatPhone } from '@/lib/utils'
import Footer from '@/components/layout/footer'

const profileSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().optional(),
  bio: z.string().optional(),
  localizacao: z.string().optional(),
  disponibilidade: z.string().optional(),
  interesses: z.string().optional(),
  foto: z.string().optional(),
})

const ongSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  tipo: z.string().min(1, 'Selecione pelo menos um tipo'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  short_description: z.string().max(200, 'Descrição curta deve ter no máximo 200 caracteres').optional(),
  how_to_help: z.string().optional(),
  additional_categories: z.string().optional(),
  localizacao_tipo: z.enum(['presencial', 'online', 'ambos'], { 
    message: 'Selecione o tipo de localização'
  }),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  endereco_online: z.string().optional(),
  whatsapp: z.string().optional(),
  necessidades: z.string().optional(),
  horarios_funcionamento: z.string().optional(),
  thumbnail_url: z.string().optional(),
}).refine((data) => {
  if (data.localizacao_tipo === 'presencial') {
    return data.cidade && data.estado
  }
  if (data.localizacao_tipo === 'online') {
    return data.endereco_online
  }
  if (data.localizacao_tipo === 'ambos') {
    return (data.cidade && data.estado) || data.endereco_online
  }
  return true
}, {
  message: "Preencha os campos obrigatórios para o tipo de localização selecionado",
  path: ["localizacao_tipo"]
})

type ProfileData = z.infer<typeof profileSchema>
type ONGData = z.infer<typeof ongSchema>

export default function PerfilPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [ongData, setOngData] = useState<any>(null)
  const [loadingOng, setLoadingOng] = useState(true)
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  
  // Estados para upload de imagens
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  
  // Refs para inputs de arquivo
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      bio: '',
      localizacao: '',
      disponibilidade: '',
      interesses: '',
      foto: '',
    }
  })

  const ongForm = useForm<ONGData>({
    resolver: zodResolver(ongSchema),
    defaultValues: {
      nome: '',
      tipo: '',
      descricao: '',
      cidade: '',
      estado: '',
      whatsapp: '',
      necessidades: '',
      horarios_funcionamento: '',
      thumbnail_url: '',
    }
  })

  useEffect(() => {
    if (user) {
      // Resetar o formulário do perfil quando o usuário mudar
      profileForm.reset({
        nome: user.nome || '',
        telefone: user.telefone || '',
        bio: user.bio || '',
        localizacao: user.localizacao || '',
        disponibilidade: user.disponibilidade || '',
        interesses: user.interesses?.join(', ') || '',
        foto: user.foto || '',
      })

      // Carregar dados da ONG se for uma ONG
      if (user.tipo === 'ong') {
        loadOngData()
      } else {
        setLoadingOng(false)
      }
    }
  }, [user])

  const loadOngData = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
        throw error
      }

      if (data) {
        setOngData(data)
        const tipos = Array.isArray(data.tipo) ? data.tipo : [data.tipo]
        setSelectedTipos(tipos)
        ongForm.reset({
          nome: data.nome || '',
          tipo: tipos.join(', '),
          descricao: data.descricao || '',
          short_description: data.short_description || '',
          how_to_help: data.how_to_help || '',
          additional_categories: ongData.additional_categories?.join(', ') || '',
          localizacao_tipo: data.localizacao_tipo || 'presencial',
          cidade: data.cidade || '',
          estado: data.estado || '',
          endereco_online: data.endereco_online ? data.endereco_online.join(', ') : '',
          whatsapp: data.whatsapp || '',
          necessidades: data.necessidades?.join(', ') || '',
          horarios_funcionamento: data.horarios_funcionamento || '',
          thumbnail_url: data.thumbnail_url || '',
        })
      } else {
        // Se não há dados da ONG, manter valores vazios
        setSelectedTipos([])
        ongForm.reset({
          nome: '',
          tipo: '',
          descricao: '',
          short_description: '',
          how_to_help: '',
          additional_categories: '',
          localizacao_tipo: 'presencial',
          cidade: '',
          estado: '',
          endereco_online: '',
          whatsapp: '',
          necessidades: '',
          horarios_funcionamento: '',
          thumbnail_url: '',
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados da ONG:', error)
    } finally {
      setLoadingOng(false)
    }
  }

  // Função para upload de imagem
  const uploadImage = async (file: File, bucket: string, fileName: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const filePath = `${fileName}-${timestamp}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: false 
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedAvatarFile(file)
      // Criar preview local
      const reader = new FileReader()
      reader.onload = (e) => {
        profileForm.setValue('foto', e.target?.result as string, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedThumbnailFile(file)
      // Criar preview local
      const reader = new FileReader()
      reader.onload = (e) => {
        ongForm.setValue('thumbnail_url', e.target?.result as string, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTipoToggle = (tipo: string) => {
    setSelectedTipos(prev => {
      const newTipos = prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
      
      ongForm.setValue('tipo', newTipos.join(', '), { shouldDirty: true })
      return newTipos
    })
  }

  const handleProfileSubmit = async (data: ProfileData) => {
    if (!user) return

    setLoading(true)
    try {
      let fotoUrl = data.foto

      // Se há um arquivo selecionado, fazer upload
      if (selectedAvatarFile) {
        setUploadingAvatar(true)
        fotoUrl = await uploadImage(selectedAvatarFile, 'avatars', `avatar-${user.id}`)
        setUploadingAvatar(false)
      }

      const updateData = {
        ...data,
        interesses: data.interesses ? data.interesses.split(',').map(i => i.trim()).filter(Boolean) : null,
        foto: fotoUrl || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      await refreshUser()
      setSelectedAvatarFile(null)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
      setUploadingAvatar(false)
    }
  }

  const handleOngSubmit = async (data: ONGData) => {
    if (!user) return

    setLoading(true)
    try {
      let thumbnailUrl = data.thumbnail_url

      // Se há um arquivo selecionado, fazer upload
      if (selectedThumbnailFile) {
        setUploadingThumbnail(true)
        thumbnailUrl = await uploadImage(selectedThumbnailFile, 'ongs', `thumbnail-${user.id}`)
        setUploadingThumbnail(false)
      }

      const ongUpdateData = {
        user_id: user.id,
        ...data,
        tipo: selectedTipos,
        short_description: data.short_description || null,
        how_to_help: data.how_to_help || null,
        additional_categories: data.additional_categories ? data.additional_categories.split(',').map(c => c.trim()).filter(Boolean) : null,
        localizacao_tipo: data.localizacao_tipo,
        cidade: data.cidade || null,
        estado: data.estado || null,
        endereco_online: data.endereco_online ? data.endereco_online.split(',').map(e => e.trim()).filter(Boolean) : null,
        whatsapp: data.whatsapp || null,
        necessidades: data.necessidades ? data.necessidades.split(',').map(n => n.trim()).filter(Boolean) : null,
        thumbnail_url: thumbnailUrl || null,
        updated_at: new Date().toISOString(),
      }

      if (ongData) {
        // Atualizar ONG existente
        const { error } = await supabase
          .from('ongs')
          .update(ongUpdateData)
          .eq('id', ongData.id)

        if (error) throw error
      } else {
        // Criar nova ONG
        const { data: newOng, error } = await supabase
          .from('ongs')
          .insert(ongUpdateData)
          .select()
          .single()

        if (error) throw error
        setOngData(newOng)
      }

      toast.success('Dados da ONG atualizados com sucesso!')
      setSelectedThumbnailFile(null)
      await loadOngData()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar dados da ONG')
    } finally {
      setLoading(false)
      setUploadingThumbnail(false)
    }
  }

  const handleProfileCancel = () => {
    if (user) {
      profileForm.reset({
        nome: user.nome || '',
        telefone: user.telefone || '',
        bio: user.bio || '',
        localizacao: user.localizacao || '',
        disponibilidade: user.disponibilidade || '',
        interesses: user.interesses?.join(', ') || '',
        foto: user.foto || '',
      })
      setSelectedAvatarFile(null)
    }
  }

  const handleOngCancel = () => {
    if (ongData) {
      const tipos = Array.isArray(ongData.tipo) ? ongData.tipo : [ongData.tipo]
      setSelectedTipos(tipos)
      ongForm.reset({
        nome: ongData.nome || '',
        tipo: tipos.join(', '),
        descricao: ongData.descricao || '',
        localizacao_tipo: ongData.localizacao_tipo || 'presencial',
        cidade: ongData.cidade || '',
        estado: ongData.estado || '',
        endereco_online: ongData.endereco_online ? ongData.endereco_online.join(', ') : '',
        whatsapp: ongData.whatsapp || '',
        necessidades: ongData.necessidades?.join(', ') || '',
        horarios_funcionamento: ongData.horarios_funcionamento || '',
        thumbnail_url: ongData.thumbnail_url || '',
      })
    } else {
      setSelectedTipos([])
      ongForm.reset({
        nome: '',
        tipo: '',
        descricao: '',
        localizacao_tipo: 'presencial',
        cidade: '',
        estado: '',
        endereco_online: '',
        whatsapp: '',
        necessidades: '',
        horarios_funcionamento: '',
        thumbnail_url: '',
      })
    }
    setSelectedThumbnailFile(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Faça login para acessar seu perfil.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Meu <span className="text-primary">Perfil</span>
            </h1>
            <p className="text-xl text-gray-600">
              Gerencie suas informações pessoais e de organização
            </p>
          </div>

          <div className="space-y-8">
            {/* Perfil do Usuário */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-primary/20">
                      <AvatarImage src={profileForm.watch('foto') || user.foto || ''} alt={user.nome} />
                      <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                        {user.nome.split(' ').map(n => n).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors"
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="h-4 w-4 text-white" />
                      )}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.nome}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Badge className="bg-primary/10 text-primary capitalize">
                        {user.tipo === 'ong' ? 'Organização' : 'Voluntário'}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input
                        id="nome"
                        placeholder="Seu nome completo"
                        className="rounded-xl"
                        {...profileForm.register('nome')}
                      />
                      {profileForm.formState.errors.nome && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.nome.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        placeholder="(11) 99999-9999"
                        className="rounded-xl"
                        value={profileForm.watch('telefone') || ''}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value)
                          profileForm.setValue('telefone', formatted, { shouldDirty: true })
                        }}
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="rounded-xl bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">O email não pode ser alterado aqui. Use as configurações da conta.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      placeholder="Conte um pouco sobre você..."
                      className="rounded-xl resize-none"
                      rows={4}
                      {...profileForm.register('bio')}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        placeholder="Cidade, Estado"
                        className="rounded-xl"
                        {...profileForm.register('localizacao')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="disponibilidade">Disponibilidade</Label>
                      <Input
                        id="disponibilidade"
                        placeholder="Ex: Fins de semana, Manhãs"
                        className="rounded-xl"
                        {...profileForm.register('disponibilidade')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interesses">Áreas de interesse</Label>
                    <Input
                      id="interesses"
                      placeholder="Ex: Educação, Meio Ambiente, Saúde (separados por vírgula)"
                      className="rounded-xl"
                      {...profileForm.register('interesses')}
                    />
                  </div>

                  {/* Botões condicionais */}
                  {profileForm.formState.isDirty && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleProfileCancel}
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 rounded-xl"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Perfil
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Dados da ONG (apenas para usuários tipo ONG) */}
            {user.tipo === 'ong' && (
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Building className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>Dados da Organização</CardTitle>
                      <CardDescription>
                        Informações que aparecerão no catálogo público
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {loadingOng ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                      <p className="text-gray-600">Carregando dados da organização...</p>
                    </div>
                  ) : (
                    <form onSubmit={ongForm.handleSubmit(handleOngSubmit)} className="space-y-6">
                      {/* Upload de thumbnail */}
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Image className="h-4 w-4 mr-2" />
                          Imagem da organização
                        </Label>
                        <div className="flex items-center space-x-4">
                          {ongForm.watch('thumbnail_url') && (
                            <img 
                              src={ongForm.watch('thumbnail_url')} 
                              alt="Preview da imagem da ONG"
                              className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => thumbnailInputRef.current?.click()}
                            disabled={uploadingThumbnail}
                            className="rounded-xl"
                          >
                            {uploadingThumbnail ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Escolher Imagem
                              </>
                            )}
                          </Button>
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="ong-localizacao-tipo">Tipo de atuação</Label>
                          <Select
                            value={ongForm.watch('localizacao_tipo') || ''}
                            onValueChange={(value) => ongForm.setValue('localizacao_tipo', value as 'presencial' | 'online' | 'ambos', { shouldDirty: true })}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Como sua organização atua?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="presencial">Presencial</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="ambos">Presencial e Online</SelectItem>
                            </SelectContent>
                          </Select>
                          {ongForm.formState.errors.localizacao_tipo && (
                            <p className="text-sm text-red-500">{ongForm.formState.errors.localizacao_tipo.message}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="ong-nome">Nome da ONG</Label>
                            <Input
                              id="ong-nome"
                              placeholder="Nome da organização"
                              className="rounded-xl"
                              {...ongForm.register('nome')}
                            />
                            {ongForm.formState.errors.nome && (
                              <p className="text-sm text-red-500">{ongForm.formState.errors.nome.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Tipos de organização</Label>
                            <p className="text-sm text-gray-600 mb-3">Selecione todos os tipos que se aplicam à sua organização</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {['Educação', 'Saúde', 'Meio Ambiente', 'Assistência Social', 'Cultura', 'Esporte', 'Direitos Humanos', 'Proteção Animal', 'Desenvolvimento Comunitário', 'Outros'].map((tipo) => (
                                <button
                                  key={tipo}
                                  type="button"
                                  onClick={() => handleTipoToggle(tipo)}
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
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ong-short-description">Descrição curta (máx. 200 caracteres)</Label>
                        <Textarea
                          id="ong-short-description"
                          placeholder="Resumo breve da organização..."
                          className="rounded-xl resize-none"
                          rows={2}
                          maxLength={200}
                          {...ongForm.register('short_description')}
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

                      <div className="space-y-2">
                        <Label htmlFor="ong-descricao">Descrição</Label>
                        <Textarea
                          id="ong-descricao"
                          placeholder="Descreva os objetivos e atividades da organização..."
                          className="rounded-xl resize-none"
                          rows={4}
                          {...ongForm.register('descricao')}
                        />
                        {ongForm.formState.errors.descricao && (
                          <p className="text-sm text-red-500">{ongForm.formState.errors.descricao.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ong-additional-categories">Categorias adicionais</Label>
                        <Input
                          id="ong-additional-categories"
                          placeholder="Ex: Tecnologia, Arte, Música (separados por vírgula)"
                          className="rounded-xl"
                          {...ongForm.register('additional_categories')}
                        />
                        <p className="text-xs text-gray-500">
                          Adicione categorias extras além do tipo principal
                        </p>
                      </div>

                      {(ongForm.watch('localizacao_tipo') === 'presencial' || ongForm.watch('localizacao_tipo') === 'ambos') && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="ong-cidade">Cidade</Label>
                            <Input
                              id="ong-cidade"
                              placeholder="Cidade onde atua"
                              className="rounded-xl"
                              {...ongForm.register('cidade')}
                            />
                            {ongForm.formState.errors.cidade && (
                              <p className="text-sm text-red-500">{ongForm.formState.errors.cidade.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ong-estado">Estado</Label>
                            <Input
                              id="ong-estado"
                              placeholder="Estado"
                              className="rounded-xl"
                              {...ongForm.register('estado')}
                            />
                            {ongForm.formState.errors.estado && (
                              <p className="text-sm text-red-500">{ongForm.formState.errors.estado.message}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {(ongForm.watch('localizacao_tipo') === 'online' || ongForm.watch('localizacao_tipo') === 'ambos') && (
                        <div className="space-y-2">
                          <Label htmlFor="ong-endereco-online">Endereços Online</Label>
                          <Input
                            id="ong-endereco-online"
                            placeholder="https://site.com, https://instagram.com/perfil, https://facebook.com/pagina"
                            className="rounded-xl"
                            {...ongForm.register('endereco_online')}
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
                        <Label htmlFor="ong-whatsapp">WhatsApp para contato</Label>
                        <Input
                          id="ong-whatsapp"
                          placeholder="(11) 99999-9999"
                          className="rounded-xl"
                          value={ongForm.watch('whatsapp') || ''}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value)
                            ongForm.setValue('whatsapp', formatted, { shouldDirty: true })
                          }}
                          maxLength={15}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ong-how-to-help">Como voluntários podem ajudar</Label>
                        <Textarea
                          id="ong-how-to-help"
                          placeholder="Descreva como voluntários podem contribuir, que tipo de doações são necessárias, etc..."
                          className="rounded-xl resize-none"
                          rows={4}
                          {...ongForm.register('how_to_help')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ong-necessidades">Como voluntários podem ajudar</Label>
                        <Textarea
                          id="ong-necessidades"
                          placeholder="Ex: Aulas de reforço, Arrecadação de doações, Eventos (separados por vírgula)"
                          className="rounded-xl resize-none"
                          rows={3}
                          {...ongForm.register('necessidades')}
                        />
                        <p className="text-xs text-gray-500">
                          Tags rápidas para categorizar tipos de ajuda (separadas por vírgula)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ong-horarios">Horários de funcionamento</Label>
                        <Textarea
                          id="ong-horarios"
                          placeholder="Ex: Segunda a Sexta: 8h às 17h, Sábados: 8h às 12h"
                          className="rounded-xl resize-none"
                          rows={3}
                          {...ongForm.register('horarios_funcionamento')}
                        />
                      </div>

                      {/* Botões condicionais */}
                      {ongForm.formState.isDirty && (
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleOngCancel}
                            className="rounded-xl"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-black rounded-xl"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                Salvando...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Organização
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}