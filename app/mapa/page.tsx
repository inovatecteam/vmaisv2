'use client'

import { useState, useEffect, useRef } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Phone, Filter, Heart, Loader2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ONG } from '@/types'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'
import { AuthModal } from '@/components/auth/auth-modal'
import { WhatsAppConfirmModal } from '@/components/whatsapp-confirm-modal'
import { sendContactEmail } from '@/lib/api'
import Footer from '@/components/layout/footer'
import { loadGoogleMaps } from '@/lib/google-maps-loader'

export default function MapaPage() {
  const [ongs, setOngs] = useState<ONG[]>([])
  const [filteredOngs, setFilteredOngs] = useState<ONG[]>([])
  const [selectedOng, setSelectedOng] = useState<ONG | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [ongToOpenAfterAuth, setOngToOpenAfterAuth] = useState<ONG | null>(null)
  const [showWhatsappConfirmModal, setShowWhatsappConfirmModal] = useState(false)
  const [ongToConfirmWhatsapp, setOngToConfirmWhatsapp] = useState<ONG | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapLoading, setMapLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState<string>('all')
  const [selectedTipo, setSelectedTipo] = useState<string>('all')
  const [selectedLocalizacaoTipo, setSelectedLocalizacaoTipo] = useState<string>('all')
  const { user } = useAuth()

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    loadOngs()
  }, [])

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      initializeGoogleMaps()
    }
  }, [mapRef.current])

  useEffect(() => {
    filterOngs()
  }, [ongs, searchTerm, selectedEstado, selectedTipo, selectedLocalizacaoTipo])

  useEffect(() => {
    // Este efeito garante que os marcadores sejam atualizados sempre que:
    // 1. A instância do mapa estiver disponível (mapInstanceRef.current)
    // 2. A lista de ONGs filtradas (filteredOngs) for alterada
    if (mapInstanceRef.current) {
      updateMapMarkers()
    }
  }, [filteredOngs, mapInstanceRef.current])

  const loadOngs = async () => {
    try {
      const { data, error } = await supabase
        .from('ongs')
        .select('*')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
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

  const initializeGoogleMaps = async () => {
    console.log('🗺️ initializeGoogleMaps: Iniciando...')
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        console.warn('⚠️ Google Maps API key não encontrada')
        showMapPlaceholder()
        return
      }

      console.log('🔑 initializeGoogleMaps: API Key encontrada. Carregando Google Maps script...')
      // Carregar a API do Google Maps
      await loadGoogleMaps(apiKey)
      console.log('✅ initializeGoogleMaps: Google Maps script carregado.')
      
      if (!mapRef.current) {
        console.error('❌ initializeGoogleMaps: mapRef.current é null. Não foi possível inicializar o mapa.')
        showMapPlaceholder()
        return
      }
      console.log('📍 initializeGoogleMaps: mapRef.current está disponível:', mapRef.current)

      // Inicializar o mapa
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -15.7942, lng: -47.8822 }, // Centro do Brasil (Brasília)
        zoom: 5,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      mapInstanceRef.current = map
      setMapLoading(false)
      console.log('🎉 initializeGoogleMaps: Mapa inicializado com sucesso.')
      
    } catch (error) {
      console.error('Erro ao carregar Google Maps:', error)
      showMapPlaceholder()
    }
  }

  const showMapPlaceholder = () => {
    if (!mapRef.current) return
    
    mapRef.current.innerHTML = `
      <div class="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
        <div class="text-center">
          <div class="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
            <svg class="h-16 w-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p class="text-gray-600 mb-2">Mapa Interativo</p>
          <p class="text-sm text-gray-500">Configure a Google Maps API para visualizar o mapa</p>
        </div>
      </div>
    `
    setMapLoading(false)
  }

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current) return

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => {
      marker.setMap(null)
    })
    markersRef.current = []

    // Criar novos marcadores para ONGs com coordenadas
    const ongsWithCoords = filteredOngs.filter(ong => ong.lat && ong.lng)
    
    if (ongsWithCoords.length === 0) return

    const bounds = new window.google.maps.LatLngBounds()

    ongsWithCoords.forEach(ong => {
      const position = { lat: Number(ong.lat), lng: Number(ong.lng) }
      
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: ong.nome,
        label: {
          text: ong.nome,
          color: '#1F2937', // Cor escura para boa visibilidade
          fontSize: '12px',
          fontWeight: 'bold'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FBBF24', // Cor primária (amarelo)
          fillOpacity: 1,
          strokeColor: '#F59E0B',
          strokeWeight: 2
        }
      })

      // Adicionar listener de clique
      marker.addListener('click', () => {
        handleOngClick(ong)
      })

      markersRef.current.push(marker)
      bounds.extend(position)
    })

    // Ajustar o zoom e centro do mapa para mostrar todos os marcadores
    if (ongsWithCoords.length > 1) {
      mapInstanceRef.current.fitBounds(bounds)
    } else if (ongsWithCoords.length === 1) {
      mapInstanceRef.current.setCenter({ lat: Number(ongsWithCoords[0].lat), lng: Number(ongsWithCoords[0].lng) })
      mapInstanceRef.current.setZoom(12)
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
      filtered = filtered.filter(ong => ong.tipo.includes(selectedTipo))
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
  const tipos = [...new Set(ongs.flatMap(ong => ong.tipo).filter(Boolean))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-32 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mapa de <span className="text-primary">ONGs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore visualmente as ONGs próximas de você e descubra oportunidades de voluntariado na sua região.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left side - Filters and ONGs list (1/3 width) */}
            <div className="lg:col-span-1 order-1 lg:order-1 space-y-4 flex flex-col h-96 lg:h-[600px]">
              {/* Filtros */}
              <Card className="rounded-2xl shadow-xl shadow-gray-200/50 flex-shrink-0">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar ONGs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl text-sm"
                      />
                    </div>

                    <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                      <SelectTrigger className="rounded-xl text-sm">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        {tipos.map(tipo => (
                          <SelectItem key={tipo} value={tipo as string}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedLocalizacaoTipo} onValueChange={setSelectedLocalizacaoTipo}>
                      <SelectTrigger className="rounded-xl text-sm">
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
                        setSearchTerm('')
                        setSelectedEstado('all')
                        setSelectedTipo('all')
                        setSelectedLocalizacaoTipo('all')
                      }}
                      className="w-full rounded-xl text-sm"
                      size="sm"
                    >
                      <Filter className="h-3 w-3 mr-2" />
                      Limpar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de ONGs - Scrollable container with fixed height */}
              <Card className="rounded-2xl shadow-xl shadow-gray-200/50 flex-1 flex flex-col min-h-0">
                <CardHeader className="pb-3 flex-shrink-0">
                  <CardTitle className="text-lg">
                    ONGs Encontradas ({filteredOngs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto px-4 pb-4">
                    {filteredOngs.length > 0 ? (
                      <div className="space-y-3">
                        {filteredOngs.map((ong) => (
                          <Card 
                            key={ong.id}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl p-3"
                            onClick={() => handleOngClick(ong)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Heart className="h-5 w-5 text-primary fill-current" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{ong.nome}</h3>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="text-sm truncate">
                                    {ong.localizacao_tipo === 'online' ? (
                                      'Online'
                                    ) : ong.localizacao_tipo === 'ambos' ? (
                                      'Online e Presencial'
                                    ) : (
                                      `${ong.cidade}, ${ong.estado}`
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {(Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]).map((tipo, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                      {tipo}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Nenhuma ONG encontrada</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Map (2/3 width) */}
            <div className="lg:col-span-2 order-2 lg:order-2">
              <Card className="h-96 lg:h-[600px] rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="relative w-full h-full">
                    <div 
                      ref={mapRef} 
                      className="w-full h-full bg-gray-50" 
                    />
                    {mapLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                          <p className="text-gray-600">Carregando mapa...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile-only ONGs list - appears below map on mobile */}
            <div className="lg:hidden order-3">
              <Card className="rounded-2xl shadow-xl shadow-gray-200/50 h-80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    ONGs Encontradas ({filteredOngs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full overflow-hidden">
                  <div className="h-full overflow-y-auto px-4 pb-4">
                    {filteredOngs.length > 0 ? (
                      <div className="space-y-3">
                        {filteredOngs.map((ong) => (
                          <Card 
                            key={ong.id}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl p-3"
                            onClick={() => handleOngClick(ong)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Heart className="h-5 w-5 text-primary fill-current" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{ong.nome}</h3>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="text-sm truncate">
                                    {ong.localizacao_tipo === 'online' ? (
                                      'Online'
                                    ) : ong.localizacao_tipo === 'ambos' ? (
                                      'Online e Presencial'
                                    ) : (
                                      `${ong.cidade}, ${ong.estado}`
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {(Array.isArray(ong.tipo) ? ong.tipo : [ong.tipo]).map((tipo, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                      {tipo}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Nenhuma ONG encontrada</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                    
                    <div className="flex items-center text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
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
