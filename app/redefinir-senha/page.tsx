import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { RedefinirSenhaForm } from './form'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ code?: string; erro?: string }>
}

export default async function RedefinirSenhaPage({ searchParams }: PageProps) {
  const { code, erro } = await searchParams

  // Se veio com ?code=... do email, troca no servidor (o server client
  // tem acesso ao cookie code_verifier que o client-side não alcança de forma confiável)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      redirect('/redefinir-senha?erro=link_invalido')
    }
    // Strip code da URL antes de renderizar o form
    redirect('/redefinir-senha')
  }

  // Sem code → precisa de sessão ativa (já trocou) ou é erro
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (erro || !user) {
    return <LinkInvalido />
  }

  return <RedefinirSenhaForm />
}

function LinkInvalido() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="p-2 bg-primary rounded-md group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Voluntaria<span className="text-primary">+</span>
            </span>
          </Link>
        </div>
        <Card className="rounded-2xl shadow-xl border-0">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Link inválido ou expirado</h2>
            <p className="text-gray-600">
              O link de recuperação de senha já foi usado, expirou, ou foi aberto em um navegador
              diferente de onde a recuperação foi solicitada. Peça um novo email.
            </p>
            <Link href="/esqueci-senha">
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
      </div>
    </div>
  )
}
