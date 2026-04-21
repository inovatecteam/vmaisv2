'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function OportunidadesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Oportunidades error boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Oportunidades</span> de Voluntariado
            </h1>
          </div>
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
              <p className="text-gray-600 mb-4">Algo deu errado. Tente novamente.</p>
              <Button onClick={reset} className="bg-primary hover:bg-primary/90">
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
