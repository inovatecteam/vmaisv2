import { Card, CardContent } from '@/components/ui/card'
import { ImageOff } from 'lucide-react'

/**
 * Par de fotos antes/depois da reforma, lado a lado, com legenda explícita.
 *
 * NÃO ESTÁ EM USO AINDA. As fotos do antes e do depois não existem no repo, e
 * as imagens publicadas pelas reportagens pertencem aos veículos. O acervo
 * próprio é do Instituto Socioeducativo Afrolaboratório e da Negra Jaque (o
 * Jornal da Capital credita "acervo Afrolaboratório" na foto que publicou),
 * então elas precisam ser pedidas com autorização de uso.
 *
 * Quando chegarem: otimize a largura para o layout (máximo ~800px), salve em
 * public/images/tio-trampo/, escreva um alt descritivo de verdade e renderize
 * este componente em app/impacto/page.tsx.
 */

type Foto = {
  src: string
  alt: string
}

type AntesDepoisProps = {
  antes?: Foto
  depois?: Foto
  creditoFoto?: string
}

function Moldura({ foto, legenda }: { foto?: Foto; legenda: string }) {
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-xl bg-gray-100">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element -- o projeto usa <img> cru em todas as imagens
          <img src={foto.src} alt={foto.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center p-4 text-center text-gray-400">
            <ImageOff className="mb-2 h-8 w-8" aria-hidden="true" />
            <span className="text-sm">Foto pendente de autorização de uso</span>
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-sm font-medium text-gray-700">{legenda}</figcaption>
    </figure>
  )
}

export function AntesDepois({ antes, depois, creditoFoto }: AntesDepoisProps) {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <Moldura foto={antes} legenda="Antes da reforma" />
          <Moldura foto={depois} legenda="Depois da reforma" />
        </div>
        {creditoFoto && <p className="mt-4 text-xs text-gray-500">Fotos: {creditoFoto}</p>}
      </CardContent>
    </Card>
  )
}
