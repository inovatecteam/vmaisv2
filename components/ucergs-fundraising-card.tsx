'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, DollarSign, Printer, ExternalLink, Heart, CheckCircle, Sparkles, Trophy } from 'lucide-react'
import Link from 'next/link'

export function UcergsFundraisingCard() {
  // Link externo para a página de arrecadação
  const fundraisingLink = "https://www.vakinha.com.br/5679745" 

  // Valores atualizados
  const valorArrecadado = 6300;
  const meta = 6000;
  const percentual = 105; // 6300 / 6000 * 100 = 105%
  const valorExcedente = valorArrecadado - meta;

  return (
    <Card className="rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-yellow-50/80 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Trophy className="h-6 w-6 text-green-600" fill="currentColor" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              Arrecadação para a UCERGS
            </CardTitle>
            <Badge className="bg-green-500 text-white mt-2 text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Meta Superada!
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-700 text-sm leading-relaxed">
          A União de Cegos do Rio Grande do Sul conseguiu adquirir o móvel necessário para a impressora braille Índex DV5, essencial para a produção de materiais táteis e inclusão de pessoas com deficiência visual. A campanha foi um sucesso!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mensagem de sucesso */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-5 rounded-xl border-2 border-green-300 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-700" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-green-800 text-lg">Meta Atingida e Superada!</h4>
              <p className="text-sm text-green-700">A campanha foi um sucesso absoluto</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            Graças à generosidade de todos os contribuintes, não apenas atingimos a meta, mas também a superamos! A UCERGS agora pode adquirir o móvel adequado para a impressora braille, garantindo ainda mais recursos para a produção de materiais inclusivos.
          </p>
        </div>

        {/* Meta de arrecadação */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-700">Arrecadação Final</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
              <Trophy className="h-3 w-3 mr-1" />
              Meta Superada
            </Badge>
          </div>
          
          {/* Valores arrecadados e meta */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 shadow-sm">
              <div className="text-2xl font-bold text-green-700">R$ 6.300</div>
              <div className="text-xs text-green-600 font-medium">Arrecadado</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">R$ 6.000</div>
              <div className="text-xs text-gray-600 font-medium">Meta</div>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-green-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {percentual}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
              {/* Progress bar completo */}
              <div 
                className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: '100%',
                }}
              ></div>
              
              {/* Indicador de meta excedida */}
              <div 
                className="absolute top-0 right-0 h-3 w-1 bg-yellow-400 shadow-lg"
                style={{
                  left: `${(meta / valorArrecadado) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-green-600 text-center font-semibold">
              🎉 Meta superada em R$ {valorExcedente.toLocaleString('pt-BR')}! Obrigado por fazer a diferença!
            </p>
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
              A UCERGS há mais de 40 anos habilita e reabilita pessoas cegas. Com a impressora braille Índex DV5 e o móvel adequado, a instituição pode expandir ainda mais a produção de livros e textos táteis, garantindo acesso à alfabetização e fortalecendo a inclusão social.
            </p>
          </div>

          <div className="bg-green-50/70 p-4 rounded-xl border border-green-200/50">
            <h4 className="font-semibold text-green-800 mb-3 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resultados alcançados:
            </h4>
            <ul className="text-xs text-green-700 space-y-1.5">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">•</span>
                <span>Móvel adquirido para a impressora braille Índex DV5</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">•</span>
                <span>Expansão da produção de livros e materiais em braille</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">•</span>
                <span>Fortalecimento da autonomia e inclusão social</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Botão para ver a vakinha (ainda disponível mas não pedindo ajuda) */}
        <Link href={fundraisingLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl py-3 text-base shadow-md hover:shadow-lg transition-all duration-300">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Detalhes da Campanha
          </Button>
        </Link>

        {/* Informações adicionais */}
        <div className="text-center pt-3 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 text-green-500" />
            Campanha concluída com sucesso • Obrigado por fazer a diferença!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
