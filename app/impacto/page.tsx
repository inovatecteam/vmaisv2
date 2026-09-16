import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Quote, ArrowLeft } from 'lucide-react'
import { NaMidia } from '@/components/impacto/na-midia'

export const metadata: Metadata = {
  title: 'Impacto | Voluntaria+',
  description:
    'A Escola de Graffiti e Artes Visuais Tio Trampo, no Morro da Cruz, e as aparições da Voluntaria+ na imprensa.',
}

/**
 * O componente AntesDepois existe em components/impacto/antes-depois.tsx e
 * ainda não é renderizado aqui: faltam as fotos do antes e do depois, que
 * precisam vir do acervo do Afrolaboratório com autorização de uso.
 */
export default function ImpactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />

      <div className="px-4 pb-20 pt-28 sm:pt-32 md:pt-36 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          {/* Cabeçalho */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2">
              <span className="text-sm font-medium text-primary sm:text-base">
                Primeira entrega de 2026
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Escola de Graffiti e Artes Visuais Tio Trampo
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              A reforma do espaço no Morro da Cruz teve parte dos recursos obtidos por meio da
              Voluntaria+.
            </p>
          </div>

          {/* Ficha */}
          <Card className="mb-8 rounded-2xl shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-3 text-gray-600 sm:flex-row sm:flex-wrap sm:gap-6">
                <div className="flex items-start">
                  <Calendar className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                  <span>Inaugurada na sexta-feira, 10 de julho de 2026, às 15h</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                  <span>Rua 9 de Junho, 878, Morro da Cruz, zona leste de Porto Alegre</span>
                </div>
              </div>

              <div className="space-y-4 leading-relaxed text-gray-700">
                <p>
                  A Escola de Graffiti e Artes Visuais Tio Trampo foi inaugurada na antiga sede do
                  Galpão Cultural. Quem inaugurou o espaço foi o Instituto Socioeducativo
                  Afrolaboratório. O local abriga a primeira galeria de arte da região.
                </p>
                <p>
                  A coordenação pedagógica é de Negra Jaque, fundadora do Galpão Cultural. A
                  curadoria artística é de Geovane Trindade Pereira, o Getri. O nome da escola
                  homenageia Luis Flávio Vitola, o Tio Trampo, um dos precursores do graffiti no Rio
                  Grande do Sul e no Brasil.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Antes e depois, em texto */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h2 className="mb-3 text-xl font-semibold text-gray-900">O que havia antes</h2>
                <p className="leading-relaxed text-gray-700">
                  Antes da intervenção, o local sofria com destelhamento e problemas crônicos que
                  impediam as atividades em dias de chuva ou de calor extremo.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h2 className="mb-3 text-xl font-semibold text-gray-900">
                  O que a Voluntaria+ fez
                </h2>
                <p className="leading-relaxed text-gray-700">
                  O Instituto Socioeducativo Afrolaboratório foi um dos primeiros a se cadastrar na
                  plataforma em busca de apoio. A reforma do espaço teve parte dos recursos obtidos
                  por meio da Voluntaria+. A equipe do Afrolaboratório nivelou o terreno e executou a
                  alvenaria; os recursos reunidos pela plataforma cobriram o acabamento: parede,
                  piso novo e janelas onde não havia.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Citações */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-l-4 border-l-primary shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <Quote className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <blockquote className="leading-relaxed text-gray-700">
                  &ldquo;Foi lindo porque a nossa equipe conseguiu nivelar e fazer a parte de
                  alvenaria, e o Voluntaria+ angariou recursos para o acabamento: parede, piso novo,
                  janelas onde não tinha. Foi incrível. Hoje temos uma sala de primeiro
                  mundo.&rdquo;
                </blockquote>
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Negra Jaque</span>, coordenadora
                  pedagógica e fundadora do Galpão Cultural, ao Brasil de Fato
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-l-4 border-l-primary shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <Quote className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <blockquote className="leading-relaxed text-gray-700">
                  &ldquo;Garantir o acesso à cultura no topo do morro é dar voz às nossas potências
                  e democratizar o direito à expressão.&rdquo;
                </blockquote>
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Negra Jaque</span>, à GZH
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Apoio, como creditado pelas reportagens */}
          <Card className="mb-16 rounded-2xl shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">Quem apoiou</h2>
              <p className="leading-relaxed text-gray-700">
                A iniciativa conta com apoiadores, entre eles as ONGs Moradia e Cidadania RS, Suve e
                Memória Tia Duca, além do Colégio Farroupilha, que viabilizou a reforma do local por
                meio de um projeto de alunos.
              </p>
              <p className="mt-4 leading-relaxed text-gray-700">
                A plataforma segue em operação e recebendo cadastros de novas organizações.
              </p>
            </CardContent>
          </Card>

          {/* Na mídia */}
          <div id="na-midia" className="scroll-mt-28">
            <div className="mb-8 text-center">
              <Badge className="mb-4 bg-primary font-semibold text-black">Na mídia</Badge>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                A Voluntaria+ na imprensa
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Reportagens que citam a plataforma, da mais recente para a mais antiga.
              </p>
            </div>

            <NaMidia />
          </div>

          {/* Voltar */}
          <div className="mt-12 text-center">
            <Link
              href="/oportunidades"
              className="inline-flex items-center text-gray-600 transition-colors hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Ver as ONGs cadastradas
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
