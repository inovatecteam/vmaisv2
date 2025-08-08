'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2, CheckCircle } from 'lucide-react'
import { loadGoogleMaps } from '@/lib/google-maps-loader'

interface LocationPickerMapProps {
  initialLat?: number | null
  initialLng?: number | null
  onLocationSelect: (lat: number, lng: number) => void
  className?: string
}

export function LocationPickerMap({ 
  initialLat, 
  initialLng, 
  onLocationSelect, 
  className = '' 
}: LocationPickerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [])

  const initializeMap = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        console.warn('Google Maps API key não encontrada')
        setMapError(true)
        setLoading(false)
        return
      }

      // Carregar a API do Google Maps
      await loadGoogleMaps(apiKey)
      
      if (!mapRef.current) {
        setMapError(true)
        setLoading(false)
        return
      }

      // Coordenadas padrão: Porto Alegre, RS
      const defaultCenter = { lat: -30.0346, lng: -51.2177 }
      const center = (initialLat && initialLng) 
        ? { lat: initialLat, lng: initialLng }
        : defaultCenter

      // Inicializar o mapa
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: initialLat && initialLng ? 15 : 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      })

      mapInstanceRef.current = map

      // Criar marcador inicial se houver coordenadas
      if (initialLat && initialLng) {
        createMarker(initialLat, initialLng)
      }

      // Adicionar listener de clique no mapa
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        
        // Remover marcador anterior
        if (markerRef.current) {
          markerRef.current.setMap(null)
        }
        
        // Criar novo marcador
        createMarker(lat, lng)
        
        // Atualizar estado e notificar componente pai
        setSelectedLocation({ lat, lng })
        onLocationSelect(lat, lng)
      })

      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar Google Maps:', error)
      setMapError(true)
      setLoading(false)
    }
  }

  const createMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: 'Localização da ONG',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FBBF24',
        fillOpacity: 1,
        strokeColor: '#F59E0B',
        strokeWeight: 3
      },
      animation: window.google.maps.Animation.DROP
    })

    markerRef.current = marker
  }

  const handleCenterOnPortoAlegre = () => {
    if (mapInstanceRef.current) {
      const portoAlegreCenter = { lat: -30.0346, lng: -51.2177 }
      mapInstanceRef.current.setCenter(portoAlegreCenter)
      mapInstanceRef.current.setZoom(12)
    }
  }

  if (mapError) {
    return (
      <Card className={`rounded-2xl ${className}`}>
        <CardContent className="p-8">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mapa não disponível
            </h3>
            <p className="text-gray-600 mb-4">
              Configure a Google Maps API para usar o seletor de localização
            </p>
            <p className="text-sm text-gray-500">
              Por enquanto, você pode preencher manualmente as coordenadas ou deixar em branco
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <div ref={mapRef} className="w-full h-80 rounded-2xl" />
            
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                  <p className="text-gray-600">Carregando mapa...</p>
                </div>
              </div>
            )}

            {!loading && (
              <div className="absolute top-4 right-4">
                <Button
                  onClick={handleCenterOnPortoAlegre}
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white shadow-md"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Porto Alegre
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback da localização selecionada */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3">
          {selectedLocation ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Localização selecionada</p>
                <p className="text-xs text-gray-600">
                  Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Clique no mapa para selecionar a localização</p>
                <p className="text-xs text-gray-500">
                  Escolha o ponto exato onde sua organização está localizada
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}