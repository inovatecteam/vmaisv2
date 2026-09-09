'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { AtadosBadge } from '@/components/partnership/atados-badge'
import { ArrowLeft, ArrowRight, ExternalLink, Building, User } from 'lucide-react'
import {
  getAtadosUrl,
  getRotaInterna,
  isPerfilAtados,
  type PerfilAtados,
} from '@/lib/atados'

const COPY: Record<PerfilAtados, { titulo: string; texto: string; cta: string }> = {
  voluntario: {
    titulo: 'As oportunidades de voluntariado agora estão na Rede Atados',
    texto:
      'Unimos forças com a Rede Atados, a maior plataforma de voluntariado do Brasil. Você continua no espaço do Voluntária+, agora dentro da plataforma deles, com as ONGs que você já conhece e muitas outras.',
    cta: 'Continuar para o Voluntária+ na Rede Atados',
  },
  ong: {
    titulo: 'Os cadastros de ONG agora são feitos na Rede Atados',
    texto:
      'Unimos forças com a Rede Atados, a maior plataforma de voluntariado do Brasil. Sua organização é cadastrada no espaço do Voluntária+ dentro da plataforma deles e passa a ser vista por voluntários de todo o país.',
    cta: 'Cadastrar minha ONG na Rede Atados',
  },
}

/** Tela mostrada quando a URL não traz `?perfil=` — a pessoa escolhe o caminho. */
function EscolhaPerfil() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Link
        href="/parceria-atados?perfil=voluntario"
        className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-colors"
      >
        <User className="h-8 w-8 text-primary" />
        <span className="font-semibold text-gray-900">Quero ser voluntário</span>
      </Link>
      <Link
        href="/parceria-atados?perfil=ong"
        className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-colors"
      >
        <Building className="h-8 w-8 text-primary" />
        <span className="font-semibold text-gray-900">Represento uma ONG</span>
      </Link>
    </div>
  )
}

/**
 * Lê `?perfil=` de forma REATIVA. Um useEffect com deps [] lendo
 * window.location.search não serve aqui: a tela de escolha navega de
 * /parceria-atados para /parceria-atados?perfil=... — mesma rota, então o
 * componente não remonta e o efeito não rodaria de novo, deixando a página
 * presa na escolha. useSearchParams reage à mudança de query; o <Suspense> do
 * componente pai é exigido pelo Next para páginas pré-renderizadas.
 */
function ConteudoParceria() {
  const searchParams = useSearchParams()
  const param = searchParams.get('perfil')
  const perfil: PerfilAtados | null = isPerfilAtados(param) ? param : null

  const urlAtados = perfil ? getAtadosUrl(perfil) : null
  const copy = perfil ? COPY[perfil] : null

  return (
    <>
  {!copy || !perfil ? (
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Voluntária+ e Rede Atados, juntos
          </h1>
          <p className="text-gray-600 mb-8">
            Escolha por onde você quer continuar.
          </p>
          <EscolhaPerfil />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {copy.titulo}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-8">{copy.texto}</p>

          {urlAtados ? (
            <a
              href={urlAtados}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              {copy.cta}
              <ExternalLink className="h-5 w-5" />
            </a>
          ) : (
            /* Integração ainda não configurada: mantém o cadastro interno
               em vez de mostrar um botão que não leva a lugar nenhum. */
            <Link
              href={getRotaInterna(perfil)}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              {perfil === 'ong' ? 'Cadastrar minha ONG' : 'Criar minha conta'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}

          <p className="text-sm text-gray-500 mt-6">
            Ficou com dúvida?{' '}
            <Link href="/ajuda" className="text-primary hover:underline">
              Fale com a gente
            </Link>
            .
          </p>
        </div>
      )}
    </>
  )
}

export default function ParceriaAtadosPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <AtadosBadge variant="inline" className="mb-8" />

          {/* O fallback é a própria tela de escolha: é o que aparece no HTML
              pré-renderizado, antes de a query string ser conhecida. */}
          <Suspense
            fallback={
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Voluntária+ e Rede Atados, juntos
                </h1>
                <p className="text-gray-600 mb-8">Escolha por onde você quer continuar.</p>
                <EscolhaPerfil />
              </div>
            }
          >
            <ConteudoParceria />
          </Suspense>

          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
