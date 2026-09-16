'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { NaMidia } from '@/components/impacto/na-midia'
import { EscolaTioTrampoCard } from '@/components/impacto/escola-tio-trampo-card'
import { BloodDonationCard } from '@/components/blood-donation-card'
import { UcergsFundraisingCard } from '@/components/ucergs-fundraising-card'

/**
 * Reúne as entregas concretas do Voluntaria+: a Escola Tio Trampo e as duas
 * campanhas já concluídas, que antes ficavam em /oportunidades (página de
 * oportunidades abertas, onde campanha encerrada não faz mais sentido).
 *
 * O componente AntesDepois existe em components/impacto/antes-depois.tsx e
 * ainda não é renderizado: faltam as fotos do antes e do depois, que precisam
 * vir do acervo do Afrolaboratório com autorização de uso.
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
          <div id="na-midia" className="scroll-mt-28">
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
