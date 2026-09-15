'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  AUTH_ERROR_MESSAGES,
  reasonFromSupabaseError,
  type AuthErrorReason,
} from '@/lib/auth-errors'
import { LogoVMais } from '@/components/brand/logo-vmais'
import { AtadosBadge } from '@/components/partnership/atados-badge'

/**
 * Tela mostrada quando o usuário chega em /redefinir-senha sem sessão.
 *
 * Antes de desistir, tenta a rede de segurança do flow implícito: se o projeto
 * Supabase devolver os tokens no fragmento (`#access_token=...`), o servidor
 * nunca os enxerga e o link válido apareceria como inválido. Lemos o fragmento
 * aqui, estabelecemos a sessão e recarregamos — aí o Server Component vê o
 * usuário e renderiza o formulário.
 */
export function LinkInvalido({ motivoInicial }: { motivoInicial: AuthErrorReason }) {
  const [motivo, setMotivo] = useState<AuthErrorReason>(motivoInicial)
  // Começa em `false` de propósito: o caso comum é não haver fragmento nenhum,
  // e aí o card precisa sair já no HTML do servidor (sem flash de spinner e
  // funcionando mesmo se o JS falhar). O spinner só entra em cena quando
  // realmente encontramos tokens no fragmento para trocar por uma sessão.
  const [validandoHash, setValidandoHash] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return

    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const erro = params.get('error')

    const limparHash = () => history.replaceState(null, '', window.location.pathname)

    if (erro) {
      setMotivo(reasonFromSupabaseError(params.get('error_code'), erro))
      limparHash()
      return
    }

    if (!accessToken || !refreshToken) return

    let cancelado = false
    setValidandoHash(true)
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (cancelado) return
        if (error) {
          setMotivo('link-invalido')
          limparHash()
          setValidandoHash(false)
          return
        }
        // Recarrega sem o fragmento: agora o servidor enxerga a sessão.
        window.location.replace('/redefinir-senha')
      })

    return () => {
      cancelado = true
    }
  }, [])

  if (validandoHash) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="sr-only">Validando link de recuperação…</span>
      </div>
    )
  }

  const copy = AUTH_ERROR_MESSAGES[motivo]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <LogoVMais className="h-7" />
          </Link>
        </div>
        <Card className="rounded-2xl shadow-xl border-0">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{copy.titulo}</h2>
            <p className="text-gray-600">{copy.descricao}</p>
            <Link href="/esqueci-senha" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl">
                Pedir novo email
              </Button>
            </Link>
            <Link
              href="/entrar"
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao login
            </Link>
          </CardContent>
        </Card>

        {/* Selo da parceria — inline porque o Footer nao renderiza nesta rota */}
        <AtadosBadge variant="inline" className="mt-8" />
      </div>
    </div>
  )
}
