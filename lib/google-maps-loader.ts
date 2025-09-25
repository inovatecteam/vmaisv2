import { Loader } from '@googlemaps/js-api-loader'

let googleMapsPromise: Promise<typeof google> | null = null

export const loadGoogleMaps = async (apiKey: string): Promise<typeof google> => {
  console.log('🔧 Google Maps Loader: Starting...')
  
  // Se já estamos carregando ou já carregamos, retorna a promise existente
  if (googleMapsPromise) {
    console.log('🔧 Google Maps Loader: Using existing promise')
    return googleMapsPromise
  }

  // Se o Google Maps já está carregado globalmente
  if (typeof window !== 'undefined' && window.google?.maps) {
    console.log('🔧 Google Maps Loader: Already loaded globally')
    return Promise.resolve(window.google)
  }

  // Validar API key
  if (!apiKey || apiKey.trim() === '') {
    console.error('🔧 Google Maps Loader: API key not provided')
    throw new Error('Google Maps API key não fornecida')
  }

  console.log('🔧 Google Maps Loader: Creating new loader with API key')
  // Carrega o Google Maps usando o Loader
  googleMapsPromise = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry']
  }).load()

  console.log('🔧 Google Maps Loader: Loader created, waiting for load...')
  return googleMapsPromise
}

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.google?.maps
}