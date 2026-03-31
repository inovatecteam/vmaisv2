import { Loader } from '@googlemaps/js-api-loader'

let googleMapsPromise: Promise<typeof google> | null = null

export const loadGoogleMaps = async (apiKey: string): Promise<typeof google> => {
  if (googleMapsPromise) {
    return googleMapsPromise
  }

  if (typeof window !== 'undefined' && window.google?.maps) {
    return Promise.resolve(window.google)
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Google Maps API key não fornecida')
  }

  googleMapsPromise = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry']
  }).load().catch((error) => {
    // Reset promise so retry is possible
    googleMapsPromise = null
    throw error
  })

  return googleMapsPromise
}

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.google?.maps
}
