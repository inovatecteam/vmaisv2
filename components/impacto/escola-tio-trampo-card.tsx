import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, CheckCircle, Calendar, MapPin, Quote, ExternalLink } from 'lucide-react'
import Link from 'next/link'

/**
 * Card da Escola Tio Trampo, no mesmo formato das campanhas de doação de
 * sangue e da arrecadação da UCERGS.
 *
 * Limite factual: o Voluntaria+ reuniu parte dos recursos da reforma. Nada
 * aqui pode dizer ou sugerir que a plataforma reconstruiu, financiou ou é
 * responsável pela escola. Quem fez foi o Instituto Socioeducativo
 * Afrolaboratório. Ver docs e o texto da GZH antes de reescrever.
 */
export function EscolaTioTrampoCard() {
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-gray-200 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-4">
        <div className="mb-3 flex items-center space-x-3">
          <div className="rounded-xl bg-yellow-100 p-3 backdrop-blur-sm">
            <Palette className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              Escola de Graffiti e Artes Visuais Tio Trampo
            </CardTitle>
            <Badge className="mt-2 flex w-fit items-center gap-1.5 border border-green-200 bg-green-100 text-xs text-green-700">
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              Primeira entrega de 2026
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed text-gray-700">
          A reforma do espaço no Morro da Cruz teve parte dos recursos obtidos por meio do
          Voluntaria+. Quem inaugurou a escola foi o Instituto Socioeducativo Afrolaboratório.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-6">
        {/* Ficha */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <Calendar className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
              <span>Inaugurada na sexta-feira, 10 de julho de 2026, às 15h</span>
            </div>
            <div className="flex items-start">
              <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
              <span>Rua 9 de Junho, 878, Morro da Cruz, zona leste de Porto Alegre</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="text-xs font-semibold text-gray-700">Antes</div>
              <p className="mt-1 text-xs text-gray-600">
                Destelhamento e problemas crônicos que impediam as atividades em dias de chuva ou de
                calor extremo.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="text-xs font-semibold text-green-700">Depois</div>
              <p className="mt-1 text-xs text-green-700">
                Parede, piso novo e janelas onde não havia. O espaço abriga a primeira galeria de
                arte da região.
              </p>
            </div>
          </div>
        </div>

        {/* Quem fez */}
        <div>
          <h3 className="mb-2 flex items-center font-semibold text-gray-800">
            <Palette className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
            Quem fez a escola
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            A coordenação pedagógica é de Negra Jaque, fundadora do Galpão Cultural. A curadoria
            artística é de Geovane Trindade Pereira, o Getri. O nome homenageia Luis Flávio Vitola,
            o Tio Trampo, um dos precursores do graffiti no Rio Grande do Sul e no Brasil. A
            iniciativa conta com apoiadores, entre eles as ONGs Moradia e Cidadania RS, Suve e
            Memória Tia Duca, além do Colégio Farroupilha, que viabilizou a reforma do local por
            meio de um projeto de alunos.
          </p>
        </div>

        {/* Citação */}
        <div className="rounded-xl border-l-4 border-l-primary bg-white p-4 shadow-sm">
          <Quote className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
          <blockquote className="text-sm leading-relaxed text-gray-700">
            &ldquo;Foi lindo porque a nossa equipe conseguiu nivelar e fazer a parte de alvenaria, e
            o Voluntaria+ angariou recursos para o acabamento: parede, piso novo, janelas onde não
            tinha. Foi incrível. Hoje temos uma sala de primeiro mundo.&rdquo;
          </blockquote>
          <p className="mt-3 text-xs text-gray-600">
            <span className="font-semibold text-gray-900">Negra Jaque</span>, coordenadora
            pedagógica e fundadora do Galpão Cultural, ao Brasil de Fato
          </p>
        </div>

        <div className="mt-auto">
          <Link href="#na-midia" className="block">
            <Button className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-yellow-500 to-orange-500 py-4 text-md font-medium text-white shadow-lg transition-all duration-300 hover:from-yellow-600 hover:to-orange-600">
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
              Ver as reportagens
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
