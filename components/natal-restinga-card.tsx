'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Heart, Copy, Check, Sparkles, Target } from 'lucide-react'
import { toast } from 'sonner'

// Mesmo layout do card da UCERGS (components/ucergs-fundraising-card.tsx).
// Para atualizar o valor arrecadado, altere só ARRECADADO: a barra e a
// porcentagem se recalculam sozinhas.
const ARRECADADO = 0
const META = 4000
const CNPJ = '92.858.000/0034-03'

const formatBRL = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function NatalRestingaCard() {
  const [copiado, setCopiado] = useState(false)
  const porcentagem = Math.round((ARRECADADO / META) * 100)
  const faltam = Math.max(0, META - ARRECADADO)

  const copiarCnpj = async () => {
    try {
      await navigator.clipboard.writeText(CNPJ.replace(/\D/g, ''))
      setCopiado(true)
      toast.success('CNPJ copiado! Cole no app do seu banco para doar.')
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      toast.error('Não foi possível copiar. Copie o CNPJ manualmente.')
    }
  }

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
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              Natal no Centro Social Aparecida Restinga
            </CardTitle>
            <Badge className="bg-green-100 text-green-700 mt-2 text-xs border border-green-200 flex items-center gap-1.5 w-fit">
              <Heart className="h-3 w-3" />
               Arrecadação Aberta!
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-700 text-sm leading-relaxed">
          🎄 Vamos levar um Natal especial para as mais de 230 crianças e jovens atendidos diariamente pelo Centro Social Aparecida Restinga. Cada doação faz a diferença!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex flex-col flex-1">
        {/* Meta de arrecadação */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-700">Meta: {formatBRL(META)} 🎁</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Natal 2026
            </Badge>
          </div>

          {/* Valores arrecadados e meta */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{formatBRL(ARRECADADO)}</div>
              <div className="text-xs text-green-600 font-medium">Arrecadado</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">{formatBRL(META)}</div>
              <div className="text-xs text-gray-600 font-medium">Meta</div>
            </div>
          </div>

          {/* Barra de progresso visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-semibold text-green-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {porcentagem}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out relative shadow-lg"
                style={{
                  width: `${Math.min(100, porcentagem)}%`,
                  animation: 'slideInFromLeft 2s ease-out',
                  animationDelay: '0.3s',
                  animationFillMode: 'both',
                  zIndex: 10,
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'loadingShimmer 2s ease-in-out infinite'
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-green-600 text-center font-medium">
              {faltam > 0
                ? `✨ Faltam ${formatBRL(faltam)} para a meta! ✨`
                : '✨ Meta atingida! Obrigado a todos! ✨'}
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
            O Centro Social Aparecida Restinga é uma iniciativa que atende crianças, adolescentes, adultos e pessoas idosas em situação de vulnerabilidade social, promovendo acolhimento, educação e cidadania.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Gift className="h-4 w-4 text-primary mr-2" />
              Como doar
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              CNPJ para doação: <span className="font-semibold text-gray-900 select-all">{CNPJ}</span>
            </p>
          </div>
        </div>

        {/* Botão de doação */}
        <div className="mt-auto">
          <Button
            type="button"
            onClick={copiarCnpj}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl py-4 text-md shadow-lg flex items-center justify-center gap-2 border-0 transition-all duration-300"
          >
            {copiado ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copiado ? 'CNPJ Copiado!' : 'Copiar CNPJ para Doar'}
          </Button>
        </div>

        {/* Informações adicionais */}
        <div className="text-center pt-3 border-t border-gray-200/50">
          <p className="text-xs text-gray-500">
            🎄 Obrigado por fazer parte desse Natal • Juntos transformamos vidas
          </p>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
