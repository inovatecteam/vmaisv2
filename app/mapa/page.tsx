import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { createClient } from '@/lib/supabase-server'
import { ONG } from '@/types'
import { MapaClient } from './mapa-client'

export const revalidate = 60

export default async function MapaPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ongs')
    .select('*')
    .eq('admin_approved', true)
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao carregar ONGs para mapa (RSC):', error.message)
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
        <Navbar />
        <div className="pt-32 pb-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Mapa de <span className="text-primary">ONGs</span>
              </h1>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
                <p className="text-gray-600 mb-4">Erro ao carregar ONGs. Tente novamente.</p>
                <Link
                  href="/mapa"
                  prefetch={false}
                  className="inline-block bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-4 py-2"
                >
                  Tentar novamente
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return <MapaClient initialOngs={(data ?? []) as ONG[]} />
}
