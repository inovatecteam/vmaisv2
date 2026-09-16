import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import { APARICOES_NA_MIDIA } from '@/lib/midia'

/**
 * Grid das coberturas que nomeiam a Voluntaria+.
 *
 * Mostra veículo, programa e data, que são verificáveis. Estimativas internas
 * de alcance não entram: não vêm de dado público das emissoras.
 */
export function NaMidia() {
  const aparicoes = [...APARICOES_NA_MIDIA].sort((a, b) => b.ordem - a.ordem)

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {aparicoes.map((item) => (
        <a
          key={item.link}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Card className="h-full rounded-2xl shadow-lg transition-shadow group-hover:shadow-xl">
            <CardContent className="flex h-full flex-col p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary font-semibold text-black">{item.veiculo}</Badge>
                <span className="text-sm text-gray-500">{item.data}</span>
              </div>

              <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-primary">
                {item.assunto}
              </h3>

              <p className="text-sm text-gray-600">{item.programa}</p>

              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                Ver a matéria
                <ExternalLink className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  )
}
