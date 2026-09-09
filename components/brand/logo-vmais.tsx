import { cn } from '@/lib/utils'

/**
 * Marca oficial do Voluntária+ — wordmark manuscrito em amarelo.
 *
 * Substitui o lockup improvisado (ícone `Heart` do lucide + texto) que era
 * usado como marca antes de o arquivo oficial existir no projeto.
 *
 * O arquivo em `public/logo-vmais.svg` tem viewBox justo ao desenho, então a
 * altura definida aqui é a altura real da marca — sem espaço morto. A
 * proporção é ~6.5:1, bem horizontal: em espaços estreitos prefira limitar
 * pela largura.
 */
export function LogoVMais({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- o projeto usa <img> cru em todas as imagens
    <img
      src="/logo-vmais.svg"
      alt="Voluntária+"
      className={cn('w-auto', className)}
    />
  )
}
