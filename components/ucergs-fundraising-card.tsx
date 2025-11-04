'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, DollarSign, Printer, ExternalLink, Heart, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function UcergsFundraisingCard() {
  // Link externo para a página de arrecadação
  const fundraisingLink = "https://www.vakinha.com.br/5679745" 

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%) scaleX(0);
            opacity: 0;
          }
          50% {
            transform: translateX(-50%) scaleX(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0) scaleX(1);
            opacity: 1;
          }
        }
        
        @keyframes loadingShimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          }
          25% {
            opacity: 0.8;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          }
          50% {
            opacity: 1;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
          }
          75% {
            opacity: 0.8;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          }
        }
      `}</style>
    <Card className="rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-yellow-100 backdrop-blur-sm rounded-xl">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              Arrecadação para a UCERGS
            </CardTitle>
            <Badge className="bg-green-100 text-green-700 mt-2 text-xs border border-green-200 flex items-center gap-1.5 w-fit">
              <CheckCircle className="h-3 w-3" />
               Meta Superada!
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-700 text-sm leading-relaxed">
          🎉 Parabéns a todos que contribuíram! A União de Cegos do Rio Grande do Sul atingiu e superou a meta para aquisição do móvel para a impressora braille. Um gesto que transforma vidas!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 flex flex-col flex-1">
        {/* Meta de arrecadação */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-700">Meta Atingida! 🎉</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Sucesso!
            </Badge>
          </div>
          
          {/* Valores arrecadados e meta */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">R$ 6.300</div>
              <div className="text-xs text-green-600 font-medium">Arrecadado</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">R$ 6.000</div>
              <div className="text-xs text-gray-600 font-medium">Meta Inicial</div>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-green-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                105%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
              {/* Progress bar with sliding animation - full */}
              <div 
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out relative shadow-lg"
                style={{
                  width: '100%',
                  animation: 'slideInFromLeft 2s ease-out',
                  animationDelay: '0.3s',
                  animationFillMode: 'both',
                  zIndex: 10,
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                }}
              >
                {/* Sparkle effect overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'loadingShimmer 2s ease-in-out infinite'
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-green-600 text-center font-medium">✨ Meta superada em R$ 300! Obrigado a todos! ✨</p>
          </div>
        </div>

        {/* Informações sobre o projeto */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Heart className="h-4 w-4 text-primary mr-2 fill-current" />
              O impacto da sua contribuição
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
            Graças à solidariedade de todos, a UCERGS agora poderá adquirir o móvel adequado para a impressora braille Índex DV5, garantindo seu uso pleno, seguro e eficiente. Essa conquista significa o fortalecimento da autonomia para pessoas com deficiência visual. Cada contribuição fez a diferença e tornou possível essa importante realização!</p>
          </div>
        </div>

        {/* Botão para ver mais (opcional) */}
        <div className="mt-auto">
          <Link href={fundraisingLink} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl py-4 text-md shadow-lg flex items-center justify-center gap-2 border-0 transition-all duration-300">
              <ExternalLink className="h-5 w-5" />
              Ver Campanha Completa
            </Button>
          </Link>
        </div>

        {/* Informações adicionais */}
        <div className="text-center pt-3 border-t border-gray-200/50">
          <p className="text-xs text-gray-500">
            ✨ Obrigado por fazer parte dessa conquista • Juntos transformamos vidas
          </p>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
