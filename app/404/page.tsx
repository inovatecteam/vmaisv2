'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, ArrowLeft, Heart } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center space-x-2 group mb-8">
          <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Voluntaria<span className="text-primary">+</span></span>
        </Link>

        {/* Error Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Search className="h-16 w-16 text-primary/40" />
          </div>
        </div>

        {/* Error Message */}
        <Card className="rounded-2xl shadow-lg border-0 mb-8">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Oops! Página não encontrada
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              A página que você está procurando pode ter sido movida, removida ou não existe. 
              Mas não se preocupe, você pode encontrar o que precisa através dos links abaixo.
            </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 font-semibold rounded-xl px-8 py-3">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="rounded-xl px-8 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Página Anterior
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-8">
          Precisa de ajuda? Entre em contato conosco através do email{' '}
          <a href="mailto:voluntariamaisrs@gmail.com" className="text-primary hover:underline">
            voluntariamaisrs@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}