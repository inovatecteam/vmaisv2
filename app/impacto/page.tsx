'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Heart,
  Target,
  Lightbulb,
  Shield,
  Globe,
  Users,
  Mail,
  MapPin,
} from 'lucide-react'
import { NaMidia } from '@/components/impacto/na-midia'
import { EscolaTioTrampoCard } from '@/components/impacto/escola-tio-trampo-card'
import { BloodDonationCard } from '@/components/blood-donation-card'
import { UcergsFundraisingCard } from '@/components/ucergs-fundraising-card'

/**
 * Página única de Impacto. Absorveu a antiga /sobre (que agora redireciona
 * para cá, ver next.config.js): primeiro o que já foi entregue, depois quem
 * faz o Voluntaria+.
 *
 * O componente AntesDepois existe em components/impacto/antes-depois.tsx e
 * ainda não é renderizado: faltam as fotos do antes e do depois, que precisam
 * vir do acervo do Afrolaboratório com autorização de uso.
 */
export default function ImpactoPage() {
  const valores = [
    { icon: Heart, title: 'Solidariedade', description: 'A união e a ajuda mútua transformam comunidades.' },
    { icon: Shield, title: 'Transparência', description: 'Clareza nos processos e na conexão entre voluntários e ONGs.' },
    { icon: Globe, title: 'Impacto social', description: 'Mudanças positivas e duradouras na sociedade.' },
    { icon: Users, title: 'Inclusão', description: 'Ambiente acolhedor para todos, independente de origem ou condição.' },
  ]

  const marcos = [
    { year: '2024', title: 'Fundação do Voluntaria+', description: 'Início do projeto para conectar voluntários e ONGs no Rio Grande do Sul.' },
    { year: '2024', title: 'Primeira versão da plataforma', description: 'Lançamento da versão beta com cadastro e busca.' },
    { year: '2025', title: 'Expansão de funcionalidades', description: 'Mapa interativo e contato direto via WhatsApp.' },
    { year: '2025', title: 'Repercussão na imprensa', description: 'A plataforma apareceu no RBS Notícias, no SBT RS e no portal do Colégio Farroupilha.' },
    { year: '2026', title: 'Escola de Graffiti e Artes Visuais Tio Trampo', description: 'Primeira entrega de 2026 por meio da plataforma: a reforma do espaço no Morro da Cruz, inaugurado pelo Instituto Socioeducativo Afrolaboratório.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />

      <div className="px-4 pb-20 pt-28 sm:pt-32 md:pt-36 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          {/* Cabeçalho */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2">
              <span className="text-sm font-medium text-primary sm:text-base">
                O que já saiu do papel
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Impacto
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              As entregas e campanhas que passaram pelo Voluntaria+, e as reportagens que contaram
              cada uma delas.
            </p>
          </div>

          {/* Entregas e campanhas */}
          <div className="mb-16 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <EscolaTioTrampoCard />
            <BloodDonationCard />
            <UcergsFundraisingCard />
          </div>

          {/* Na mídia */}
          <div id="na-midia" className="mb-20 scroll-mt-28">
            <div className="mb-8 text-center">
              <Badge className="mb-4 bg-primary font-semibold text-black">Na mídia</Badge>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                O Voluntaria+ na imprensa
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Reportagens que citam a plataforma, da mais recente para a mais antiga.
              </p>
            </div>

            <NaMidia />
          </div>

          {/* ================= Sobre nós ================= */}
          <div id="sobre" className="scroll-mt-28 border-t border-gray-200 pt-16">
            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2">
                <Heart className="mr-2 h-4 w-4 fill-current text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-primary sm:text-base">Nossa história</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                Sobre o Voluntaria+
              </h2>
              <p className="mx-auto max-w-3xl text-gray-600">
                Somos uma iniciativa estudantil sem fins lucrativos. O Voluntaria+ é uma ponte
                digital entre quem quer ajudar e as ONGs que precisam de apoio, com foco no Rio
                Grande do Sul.
              </p>
            </div>

            {/* Equipe */}
            <div className="mx-auto mb-10 max-w-4xl">
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="group relative mb-6 w-full overflow-hidden rounded-xl bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element -- o projeto usa <img> cru em todas as imagens */}
                    <img
                      src="/images/team/inovatec-team-single.png"
                      alt="Equipe InovaTec, estudantes que criaram o Voluntaria+"
                      className="h-auto max-h-80 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-96 sm:max-h-none sm:object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="mb-1 text-xl font-semibold">Equipe InovaTec</h3>
                    <p className="mb-4 font-medium text-primary">Desenvolvedores e idealizadores</p>
                    <p className="mx-auto max-w-3xl leading-relaxed text-gray-600">
                      Estudantes do Ensino Médio do Colégio Farroupilha. O objetivo é facilitar a
                      sua entrada em centros de ajuda comunitária e encorajar o voluntariado no Rio
                      Grande do Sul.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Missão e visão */}
            <div className="mb-10 grid gap-4 sm:gap-6 md:grid-cols-2">
              <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className="mr-3 rounded-lg bg-blue-500 p-2">
                      <Target className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    Missão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-gray-700">
                    Democratizar o acesso ao voluntariado, conectando quem quer ajudar às
                    organizações que precisam de apoio.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className="mr-3 rounded-lg bg-green-500 p-2">
                      <Lightbulb className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    Visão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-gray-700">
                    Facilitar conexões que gerem entregas concretas e contribuir para uma sociedade
                    mais justa e solidária.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Valores */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {valores.map((valor) => (
                <Card key={valor.title} className="rounded-2xl text-center shadow-lg">
                  <CardContent className="p-4 sm:p-5">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <valor.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="mb-1.5 font-semibold">{valor.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{valor.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Linha do tempo */}
            <div className="mb-10">
              <h3 className="mb-6 text-center text-xl font-bold text-gray-900">Nossa jornada</h3>
              <div className="mx-auto max-w-4xl space-y-3">
                {marcos.map((marco) => (
                  <Card key={marco.title} className="rounded-2xl shadow-lg">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start space-x-4">
                        <Badge className="flex-shrink-0 bg-primary px-3 py-1 font-semibold text-black">
                          {marco.year}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <h4 className="mb-1 font-semibold">{marco.title}</h4>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {marco.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contato */}
            <Card className="mx-auto max-w-4xl rounded-2xl shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4 text-center">
                  <h3 className="flex items-center justify-center text-xl font-semibold">
                    <Mail className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    Entre em contato
                  </h3>
                  <p className="text-gray-700">
                    Tem dúvida, sugestão ou quer saber mais sobre o projeto? Escreva para a gente.
                  </p>
                  <div className="space-y-2 rounded-xl bg-gray-50 p-5">
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span className="font-medium">voluntariamaisrs@gmail.com</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Porto Alegre, RS</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Respondemos todas as mensagens em até 48 horas úteis.
                  </p>
                </div>
              </CardContent>
            </Card>
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
