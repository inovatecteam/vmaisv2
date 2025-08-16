'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Phone, ExternalLink, Filter, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ONG } from '@/types'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'
import { AuthModal } from '@/components/auth/auth-modal'
import { WhatsAppConfirmModal } from '@/components/whatsapp-confirm-modal'
import { sendContactEmail } from '@/lib/api'
import Footer from '@/components/layout/footer'
import { UcergsFundraisingCard } from '@/components/ucergs-fundraising-card'

export default function CatalogoPage() {
  const [ongs, setOngs] = useState<ONG[]>([])
  const [filteredOngs, setFilteredOngs] = useState<ONG[]>([])
  const [selectedOng, setSelectedOng] = useState<ONG | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [ongToOpenAfterAuth, setOngToOpenAfterAuth] = useState<ONG | null>(null)
  const [showWhatsappConfirmModal, setShowWhatsappConfirmModal] = useState(false)
  const [ongToConfirmWhatsapp, setOngToConfirmWhatsapp] = useState<ONG | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState<string>('all')
  const [selectedTipo, setSelectedTipo] = useState<string>('all')
  const [selectedLocalizacaoTipo, setSelectedLocalizacaoTipo] = useState<string>('all')
  const { user } = useAuth()

  useEffect(() => {
    loadOngs()
  }, [])

  useEffect(() => {
    filterOngs()
  }, [ongs, searchTerm, selectedEstado, selectedTipo, selectedLocalizacaoTipo])

  const loadOngs = async () => {
    try {
      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOngs(data || [])
    } catch (error) {
      console.error('Erro ao carregar ONGs:', error)
      toast.error('Erro ao carregar ONGs')
    } finally {
      setLoading(false)
    }
  }

  const filterOngs = () => {
    let filtered = ongs

    if (searchTerm) {
      filtered = filtered.filter(ong =>
        ong.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ong.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ong.cidade || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedEstado && selectedEstado !== 'all') {
      filtered = filtered.filter(ong => ong.estado === selectedEstado)
    }

    if (selectedTipo && selectedTipo !== 'all') {
      filtered = filtered.filter(ong => {
        const tipos = Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]
        return tipos.includes(selectedTipo)
      })
    }

    if (selectedLocalizacaoTipo && selectedLocalizacaoTipo !== 'all') {
      if (selectedLocalizacaoTipo === 'presencial') {
        filtered = filtered.filter(ong => ong.localizacao_tipo === 'presencial' || ong.localizacao_tipo === 'ambos')
      } else if (selectedLocalizacaoTipo === 'online') {
        filtered = filtered.filter(ong => ong.localizacao_tipo === 'online' || ong.localizacao_tipo === 'ambos')
      } else if (selectedLocalizacaoTipo === 'ambos') {
        filtered = filtered.filter(ong => ong.localizacao_tipo === 'ambos')
      }
    }

    setFilteredOngs(filtered)
  }

  const handleInteraction = async (ongId: string) => {
    if (!user) return

    try {
      await supabase
        .from('interacoes')
        .insert({
          user_id: user.id,
          ong_id: ongId,
        })
    } catch (error) {
      console.error('Erro ao registrar interação:', error)
    }
  }

  const handleWhatsAppClick = (ong: ONG) => {
    if (!user) {
      setOngToOpenAfterAuth(ong)
      setShowAuthModal(true)
      return
    }

    if (ong.whatsapp) {
      setOngToConfirmWhatsapp(ong)
      setShowWhatsappConfirmModal(true)
    }
  }

  const handleWhatsappConfirmed = async (observation: string) => {
    if (!ongToConfirmWhatsapp || !user) return

    try {
      // Send contact email
      await sendContactEmail({
        user_id: user.id,
        ong_id: ongToConfirmWhatsapp.id,
        observation_message: observation
      })

      // Register interaction
      await handleInteraction(ongToConfirmWhatsapp.id)

      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/${ongToConfirmWhatsapp.whatsapp!.replace(/\D/g, '')}?text=Olá! Encontrei vocês na plataforma Voluntaria%2B e gostaria de saber como posso ajudar como voluntário.`
      window.open(whatsappUrl, '_blank')

      toast.success('Informações enviadas! Redirecionando para WhatsApp...')
      setShowWhatsappConfirmModal(false)
      setOngToConfirmWhatsapp(null)
    } catch (error: any) {
      console.error('Erro ao enviar informações:', error)
      toast.error('Erro ao enviar informações. Tente novamente.')
    }
  }

  const handleOngClick = (ong: ONG) => {
    if (!user) {
      setOngToOpenAfterAuth(ong)
      setShowAuthModal(true)
    } else {
      setSelectedOng(ong)
    }
  }

  const handleAuthSuccess = () => {
    if (ongToOpenAfterAuth) {
      setSelectedOng(ongToOpenAfterAuth)
      setOngToOpenAfterAuth(null)
    }
  }
  const estados = [...new Set(ongs.map(ong => ong.estado).filter(Boolean))].sort()
  const tipos = [...new Set(ongs.flatMap(ong => 
    Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]
  ).filter(Boolean))].sort()
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando ONGs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Oportunidades</span> de Voluntariado
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra oportunidades incríveis de voluntariado na sua região e conecte-se com causas que fazem sentido para você.
            </p>
          </div>

          {/* Card de Arrecadação UCERGS */}
          <div className="mb-8 max-w-2xl mx-auto">
            <UcergsFundraisingCard />
          </div>

           {/* Filtros */}
              <Card className="rounded-2xl shadow-lg flex-shrink-0 w-full">
  <CardContent className="p-4">
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search Bar (Left, ~50% width) */}
      <div className="relative md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar ONGs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl text-sm w-full"
        />
      </div>

      {/* Right Side (Selects and Button in a row) */}
      <div className="flex flex-col md:flex-row md:w-1/2 gap-3">
        <Select value={selectedTipo} onValueChange={setSelectedTipo}>
          <SelectTrigger className="rounded-xl text-sm w-full">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {tipos.map((tipo) => (
              <SelectItem key={tipo} value={tipo as string}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocalizacaoTipo} onValueChange={setSelectedLocalizacaoTipo}>
          <SelectTrigger className="rounded-xl text-sm w-full">
            <SelectValue placeholder="Localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Presencial e Online</SelectItem>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearchTerm('');
            setSelectedEstado('all');
            setSelectedTipo('all');
            setSelectedLocalizacaoTipo('all');
          }}
          className="rounded-xl text-sm w-full md:w-auto"
          size="sm"
        >
          <Filter className="h-3 w-3 mr-2" />
          Limpar filtros
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
     {/* Resultados */}
          <div className="mb-6 mt-6">
            <p className="text-gray-600">
              {filteredOngs.length} ONG{filteredOngs.length !== 1 ? 's' : ''} encontrada{filteredOngs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid de ONGs */}
          {filteredOngs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOngs.map((ong) => (
                <Card 
                  key={ong.id} 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
                  onClick={() => handleOngClick(ong)}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                    {ong.thumbnail_url ? (
                      <img 
                        src={ong.thumbnail_url} 
                        alt={ong.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-16 w-16 text-primary/30 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {ong.nome}
                        </CardTitle>
                        <div className="flex items-center text-gray-500 mt-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {ong.localizacao_tipo === 'online' ? (
                              'Online'
                            ) : ong.localizacao_tipo === 'ambos' ? (
                              'Online e Presencial'
                            ) : (
                              `${ong.cidade}, ${ong.estado}`
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]).slice(0, 2).map((tipo, index) => (
                          <Badge key={index} variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {tipo}
                          </Badge>
                        ))}
                        {(Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]).length > 2 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                            +{(Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]).length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="line-clamp-3 text-gray-600">
                      {ong.descricao}
                    </CardDescription>
                    
                    {ong.horarios_funcionamento && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Horários</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{ong.horarios_funcionamento}</p>
                      </div>
                    )}
                    
                    {ong.necessidades && ong.necessidades.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {ong.necessidades.slice(0, 3).map((necessidade, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {necessidade}
                            </Badge>
                          ))}
                          {ong.necessidades.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{ong.necessidades.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 rounded-2xl">
              <CardContent>
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <CardTitle className="text-2xl mb-2">Nenhuma ONG encontrada</CardTitle>
                <CardDescription>
                  Tente ajustar os filtros ou buscar por outros termos.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedOng} onOpenChange={() => setSelectedOng(null)}>
        <DialogContent className="max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedOng && (
            <>
              {/* Top section: Image + Name/Type/Location + Short Description */}
              <div className="p-6 pb-0">
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  {/* Image on left */}
                  <div className="flex-shrink-0 w-full lg:w-64 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl overflow-hidden">
                    {selectedOng.thumbnail_url ? (
                      <img 
                        src={selectedOng.thumbnail_url} 
                        alt={selectedOng.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-16 w-16 text-primary/30 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Text content on right */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-2xl font-bold">{selectedOng.nome}</DialogTitle>
                      <div className="flex flex-wrap gap-2 ml-4">
                        {(Array.isArray(selectedOng.tipo) ? selectedOng.tipo : [selectedOng.tipo]).map((tipo, index) => (
                          <Badge key={index} className="bg-primary/10 text-primary">
                            {tipo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {selectedOng.localizacao_tipo === 'online' ? (
                          'Online'
                        ) : selectedOng.localizacao_tipo === 'ambos' ? (
                          'Online e Presencial'
                        ) : (
                          `${selectedOng.cidade}, ${selectedOng.estado}`
                        )}
                      </span>
                    </div>
                    
                    {/* Short description */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Sobre a organização</h4>
                      <p className="text-gray-600 leading-relaxed text-sm line-clamp-4 whitespace-pre-wrap">
                        {selectedOng.short_description || selectedOng.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remaining content (full info, extra fields, buttons) */}
              <div className="space-y-6 p-6 pt-0 border-t border-gray-100">
                {selectedOng.short_description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Descrição completa</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedOng.descricao}</p>
                  </div>
                )}

                {selectedOng.additional_categories && selectedOng.additional_categories.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Categorias adicionais</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOng.additional_categories.map((categoria, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {categoria}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOng.how_to_help && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Como você pode ajudar</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedOng.how_to_help}</p>
                  </div>
                )}

                {selectedOng.endereco_online && selectedOng.endereco_online.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      {selectedOng.endereco_online.length === 1 ? 'Endereço Online' : 'Endereços Online'}
                    </h3>
                    <div className="space-y-2">
                      {selectedOng.endereco_online.map((endereco, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <a 
                            href={endereco.startsWith('http') ? endereco : `https://${endereco}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {endereco}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOng.horarios_funcionamento && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Horários de funcionamento</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedOng.horarios_funcionamento}</p>
                  </div>
                )}

                {selectedOng.necessidades && selectedOng.necessidades.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Tipos de ajuda</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOng.necessidades.map((necessidade, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {necessidade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                  {selectedOng.whatsapp && (
                    <Button 
                      onClick={() => handleWhatsAppClick(selectedOng)}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Conversar no WhatsApp
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleInteraction(selectedOng.id)
                      setSelectedOng(null)
                    }}
                    className="rounded-xl sm:w-auto w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Autenticação */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
      
      {/* Modal de Confirmação do WhatsApp */}
      <WhatsAppConfirmModal
        open={showWhatsappConfirmModal}
        onOpenChange={setShowWhatsappConfirmModal}
        ong={ongToConfirmWhatsapp}
        user={user}
        onConfirm={handleWhatsappConfirmed}
      />
      
      <Footer />
    </div>
  )
}