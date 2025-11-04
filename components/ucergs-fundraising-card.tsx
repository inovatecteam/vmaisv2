'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, DollarSign, Printer, ExternalLink, Heart } from 'lucide-react'
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
    <Card className="rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-primary/15 rounded-xl">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              Arrecadação para a UCERGS
            </CardTitle>
            <Badge className="bg-yellow-100 text-yellow-700 mt-2 text-xs">
              Campanha Especial
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-700 text-sm leading-relaxed">
          Apoie a União de Cegos do Rio Grande do Sul na aquisição de um móvel que permita o uso ideal e seguro da impressora braille Índex DV5, essencial para a produção de materiais táteis e inclusão de pessoas com deficiência visual.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Meta de arrecadação */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-700">Arrecadação</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Printer className="h-3 w-3 mr-1" />
              Impressora Braille
            </Badge>
          </div>
          
          {/* Valores arrecadados e meta */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">R$ 6.300</div>
              <div className="text-xs text-green-600 font-medium">Arrecadado</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">R$ 6.000</div>
              <div className="text-xs text-green-600 font-medium">Meta Atingida!</div>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-green-800">105%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
              {/* Progress bar with sliding animation */}
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: '105%',
                  animation: 'slideInFromLeft 2s ease-out',
                  animationDelay: '0.3s',
                  animationFillMode: 'both',
                  zIndex: 10
                }}
              ></div>

              {/* Loading animation for remaining space */}
              <div
                className="absolute top-0 right-0 h-3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{
                  width: '0%',
                  animation: 'loadingShimmer 1.5s ease-in-out infinite',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)'
                }}
              ></div>
            </div>
            <p className="text-xs text-green-600 text-center font-medium">🎉 Meta atingida! Arrecadação ultrapassada em R$ 300</p>
          </div>
        </div>

        {/* Informações sobre o projeto */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Heart className="h-4 w-4 text-green-600 mr-2 fill-current" />
              🎉 Meta Atingida com Sucesso!
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
            Obrigado a todos que contribuíram! A UCERGS arrecadou R$ 6.300, ultrapassando a meta de R$ 6.000. Com este apoio, adquiriremos o móvel adequado para a impressora braille Índex DV5, que permitirá expandir a produção de livros e materiais táteis em braille.
            </p>
          </div>

          <div className="bg-green-50/70 p-4 rounded-xl border border-green-200/50">
            <h4 className="font-semibold text-green-800 mb-3 text-sm">Impacto conquistado:</h4>
            <ul className="text-xs text-green-700 space-y-1.5">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">✅</span>
                <span>Equipamento de impressão braille totalmente equipado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">✅</span>
                <span>Maior autonomia e inclusão para pessoas com deficiência visual</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">✅</span>
                <span>Continuidade dos 40+ anos de trabalho da UCERGS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Botão para acompanhar */}
        <Link href={fundraisingLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full bg-green-600 hover:bg-green-700 font-medium rounded-xl py-3 text-base shadow-md hover:shadow-lg transition-all duration-300">
            <ExternalLink className="h-4 w-4 mr-2" />
            Acompanhar Projeto
          </Button>
        </Link>

        {/* Informações adicionais */}
        <div className="text-center pt-3 border-t border-gray-200/50">
          <p className="text-xs text-green-600 font-medium">
            🎉 Meta atingida • Obrigado a todos que contribuíram!
          </p>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
