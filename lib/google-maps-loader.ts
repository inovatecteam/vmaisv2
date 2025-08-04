import { Loader } from '@googlemaps/js-api-loader'

let googleMapsPromise: Promise<typeof google> | null = null

export const loadGoogleMaps = async (apiKey: string): Promise<typeof google> => {
  // Se já estamos carregando ou já carregamos, retorna a promise existente
  if (googleMapsPromise) {
    return googleMapsPromise
  }

  // Se o Google Maps já está carregado globalmente
  if (typeof window !== 'undefined' && window.google?.maps) {
    return Promise.resolve(window.google)
  }

  // Carrega o Google Maps usando o Loader
  googleMapsPromise = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry']
  }).load()

  return googleMapsPromise
}

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.google?.maps
}