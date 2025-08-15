'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, DollarSign, Printer, ExternalLink, Heart } from 'lucide-react'
import Link from 'next/link'

export function UcergsFundraisingCard() {
  // Link externo para a página de arrecadação (substitua por um link real)
  const fundraisingLink = "https://example.com/ucergs-arrecadacao" 

  return (
    <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Arrecadação para a UCERGS
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-700 mt-1">
              Campanha Especial
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-700 text-base leading-relaxed">
          Apoie a União de Cegos do Rio Grande do Sul na aquisição de um móvel adequado para a impressora braille Índex DV5.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Meta de arrecadação */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-700">Meta: R$ 6.000</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Printer className="h-3 w-3 mr-1" />
              Impressora Braille
            </Badge>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Campanha iniciada recentemente</p>
        </div>

        {/* Informações sobre o projeto */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Heart className="h-4 w-4 text-primary mr-2 fill-current" />
              Por que sua ajuda é importante?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A impressora braille Índex DV5 é essencial para a produção de materiais didáticos e informativos, 
              promovendo a autonomia e inclusão de pessoas cegas. Um móvel adequado garante a eficácia e 
              durabilidade do equipamento, otimizando o trabalho da UCERGS.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Impacto esperado:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Melhoria na qualidade dos materiais impressos</li>
              <li>• Maior durabilidade e proteção do equipamento</li>
              <li>• Aumento da eficiência na produção de conteúdo</li>
              <li>• Benefício direto para a comunidade de pessoas cegas</li>
            </ul>
          </div>
        </div>

        {/* Botão de contribuição */}
        <Link href={fundraisingLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <ExternalLink className="h-5 w-5 mr-2" />
            Contribuir Agora
          </Button>
        </Link>

        {/* Informações adicionais */}
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Toda contribuição faz a diferença • Transparência total no uso dos recursos
          </p>
        </div>
      </CardContent>
    </Card>
  )
}