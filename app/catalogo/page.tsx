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
import Footer from '@/components/layout/footer'

export default function CatalogoPage() {
  const [ongs, setOngs] = useState<ONG[]>([])
  const [filteredOngs, setFilteredOngs] = useState<ONG[]>([])
  const [selectedOng, setSelectedOng] = useState<ONG | null>(null)
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
      filtered = filtered.filter(ong => ong.tipo === selectedTipo)
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
    if (ong.whatsapp) {
      handleInteraction(ong.id)
      const whatsappUrl = `https://wa.me/${ong.whatsapp.replace(/\D/g, '')}?text=Olá! Encontrei vocês na plataforma Voluntaria%2B e gostaria de saber como posso ajudar como voluntário.`
      window.open(whatsappUrl, '_blank')
    }
  }

  const estados = [...new Set(ongs.map(ong => ong.estado))].sort()
  const tipos = [...new Set(ongs.map(ong => ong.tipo))].sort()

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
              Catálogo de <span className="text-primary">ONGs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra organizações incríveis que fazem a diferença na sua região e conecte-se com causas que fazem sentido para você.
            </p>
          </div>

          {/* Filtros */}
          <Card className="mb-8 rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar por nome, cidade ou causa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger className="w-full lg:w-48 rounded-xl">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estados</SelectItem>
                    {estados.map(estado => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger className="w-full lg:w-48 rounded-xl">
                    <SelectValue placeholder="Tipo de ONG" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {tipos.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocalizacaoTipo} onValueChange={setSelectedLocalizacaoTipo}>
                  <SelectTrigger className="w-full lg:w-48 rounded-xl">
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
                  className="rounded-xl"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <div className="mb-6">
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
                  onClick={() => setSelectedOng(ong)}
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
                              ong.endereco_online ? 'Online' : 'Online'
                            ) : ong.localizacao_tipo === 'ambos' ? (
                              ong.endereco_online ? 'Online e Presencial' : `${ong.cidade}, ${ong.estado}`
                            ) : (
                              `${ong.cidade}, ${ong.estado}`
                            )}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {ong.tipo}
                      </Badge>
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
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedOng && (
            <>
              <DialogHeader>
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl mb-6 overflow-hidden">
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
                
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedOng.nome}</DialogTitle>
                    <div className="flex items-center text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {selectedOng.localizacao_tipo === 'online' ? (
                          selectedOng.endereco_online || 'Online'
                        ) : selectedOng.localizacao_tipo === 'ambos' ? (
                          <>
                            {selectedOng.endereco_online && (
                              <span className="mr-2">{selectedOng.endereco_online}</span>
                            )}
                            {selectedOng.cidade && selectedOng.estado && (
                              <span>{selectedOng.cidade}, {selectedOng.estado}</span>
                            )}
                          </>
                        ) : (
                          `${selectedOng.cidade}, ${selectedOng.estado}`
                        )}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    {selectedOng.tipo}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sobre a organização</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedOng.descricao}</p>
                </div>

                {selectedOng.endereco_online && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Endereço Online</h3>
                    <a 
                      href={selectedOng.endereco_online.startsWith('http') ? selectedOng.endereco_online : `https://${selectedOng.endereco_online}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedOng.endereco_online}
                    </a>
                  </div>
                )}

                {selectedOng.horarios_funcionamento && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Horários de funcionamento</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedOng.horarios_funcionamento}</p>
                  </div>
                )}

                {selectedOng.necessidades && selectedOng.necessidades.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Como você pode ajudar</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOng.necessidades.map((necessidade, index) => (
                        <Badge key={index} variant="outline">
                          {necessidade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                    className="rounded-xl"
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
      
      <Footer />
    </div>
  )
}