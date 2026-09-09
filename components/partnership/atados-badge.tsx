'use client'

import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ATADOS_SITE, getDestinoCta } from '@/lib/atados'

/**
 * A arte da Atados é azul sobre fundo transparente, então some em fundo escuro.
 * O container branco garante contraste no rodapé (bg-gray-900) e é inofensivo
 * nos fundos claros.
 */
function LogoAtados({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md bg-white px-2 py-1.5', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- o projeto usa <img> cru em todas as imagens */}
      <img src="/atados-logo.png" alt="Rede Atados" className="h-4 w-auto sm:h-5" />
    </span>
  )
}

function LogoVoluntariaMais({ escuro }: { escuro: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold',
        escuro ? 'text-white' : 'text-gray-900'
      )}
    >
      <span className="p-1 bg-primary rounded">
        <Heart className="h-3.5 w-3.5 text-white" />
      </span>
      {/* O "+" fica no mesmo span do nome: solto, o gap do flex o separaria. */}
      <span>
        Voluntaria<span className="text-primary">+</span>
      </span>
    </span>
  )
}

interface AtadosBadgeProps {
  /**
   * `inline` — lockup discreto para rodapé e páginas de auth.
   * `destaque` — card explicativo com CTAs, para a home.
   */
  variant?: 'inline' | 'destaque'
  tema?: 'claro' | 'escuro'
  className?: string
}

export function AtadosBadge({
  variant = 'inline',
  tema = 'claro',
  className,
}: AtadosBadgeProps) {
  const escuro = tema === 'escuro'

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <LogoVoluntariaMais escuro={escuro} />
          <span aria-hidden="true" className={escuro ? 'text-gray-500' : 'text-gray-400'}>
            ×
          </span>
          <a
            href={ATADOS_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <LogoAtados />
          </a>
        </div>
        <p className={cn('text-xs', escuro ? 'text-gray-400' : 'text-gray-500')}>
          Parceria oficial com a Rede Atados
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 sm:p-8',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 mb-6">
        <LogoVoluntariaMais escuro={false} />
        <span aria-hidden="true" className="text-gray-400 text-lg">
          ×
        </span>
        <a
          href={ATADOS_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <LogoAtados className="px-3 py-2 shadow-sm" />
        </a>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">
        Agora somos parceiros da Rede Atados
      </h3>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6 leading-relaxed">
        A Rede Atados é a maior plataforma de voluntariado do Brasil. O Voluntária+ agora
        tem um espaço dentro dela: as ONGs do Rio Grande do Sul ganham alcance nacional e
        você encontra ainda mais formas de ajudar — sem perder o que construímos aqui.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={getDestinoCta('voluntario')}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
        >
          Quero ser voluntário
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={getDestinoCta('ong')}
          className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
        >
          Represento uma ONG
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
