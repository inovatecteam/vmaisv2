/**
 * Integração Rede Atados — parceria de encaminhamento.
 *
 * O Voluntária+ passa a ser porta de entrada co-branded: voluntários e ONGs que
 * chegam aqui são encaminhados para a Rede Atados, que assume os cadastros.
 *
 * As URLs de destino vivem em variáveis de ambiente (Vercel > Environment
 * Variables) para poderem ser ligadas sem novo deploy de código. Enquanto
 * estiverem vazias, `getAtadosUrl` devolve `null` e o site inteiro mantém o
 * fluxo de cadastro interno que existe hoje — nenhum botão morto, nenhum link
 * quebrado.
 *
 * Este é o único arquivo que lê as variáveis da integração.
 */

export type PerfilAtados = 'voluntario' | 'ong'

/** Site institucional da parceira — usado nos selos de co-branding. */
export const ATADOS_SITE = 'https://www.atados.com.br'

/**
 * As chaves `process.env.NEXT_PUBLIC_*` precisam aparecer literalmente no
 * código: o Next substitui a expressão em tempo de build para embarcar o valor
 * no bundle do browser. Um acesso dinâmico (`process.env[chave]`) não é
 * substituído e chegaria como `undefined` no client.
 */
const URLS: Record<PerfilAtados, string | undefined> = {
  voluntario: process.env.NEXT_PUBLIC_ATADOS_URL_VOLUNTARIO,
  ong: process.env.NEXT_PUBLIC_ATADOS_URL_ONG,
}

/** Identifica a origem do tráfego para a Atados atribuir a parceria. */
const REF = 'voluntariamais'

/** Fluxo interno preservado enquanto o redirecionamento não está ligado. */
const ROTA_INTERNA: Record<PerfilAtados, string> = {
  voluntario: '/cadastrar',
  ong: '/cadastrar?tipo=ong',
}

/**
 * URL de destino na Atados para um perfil, com os parâmetros de rastreio da
 * parceria. Devolve `null` quando a integração ainda não foi configurada ou
 * quando a variável contém uma URL inválida.
 */
export function getAtadosUrl(perfil: PerfilAtados): string | null {
  const base = URLS[perfil]?.trim()
  if (!base) return null

  try {
    const url = new URL(base)
    url.searchParams.set('utm_source', REF)
    url.searchParams.set('utm_medium', 'parceria')
    url.searchParams.set('utm_campaign', `parceria-atados-${perfil}`)
    url.searchParams.set('ref', REF)
    return url.toString()
  } catch {
    // URL malformada na variável de ambiente: em vez de quebrar a página,
    // o site cai no fluxo interno e registra o problema no console.
    console.warn(`[atados] NEXT_PUBLIC_ATADOS_URL_${perfil.toUpperCase()} inválida: ${base}`)
    return null
  }
}

/** `true` quando o encaminhamento para a Atados está configurado para o perfil. */
export function isRedirectAtivo(perfil: PerfilAtados): boolean {
  return getAtadosUrl(perfil) !== null
}

/**
 * Destino dos CTAs do site: a página-ponte quando o encaminhamento está ligado,
 * o cadastro interno quando não está. Concentra a decisão aqui para o JSX das
 * páginas não precisar de condicional.
 */
export function getDestinoCta(perfil: PerfilAtados): string {
  return isRedirectAtivo(perfil) ? `/parceria-atados?perfil=${perfil}` : ROTA_INTERNA[perfil]
}

/**
 * Destino do CTA genérico (o "Começar Agora" do hero), onde ainda não se sabe
 * se a pessoa é voluntária ou ONG: a página-ponte pergunta antes de encaminhar.
 */
export function getDestinoEntradaGeral(): string {
  return isRedirectAtivo('voluntario') || isRedirectAtivo('ong')
    ? '/parceria-atados'
    : ROTA_INTERNA.voluntario
}

/** Caminho de cadastro dentro do próprio Voluntária+. */
export function getRotaInterna(perfil: PerfilAtados): string {
  return ROTA_INTERNA[perfil]
}

export function isPerfilAtados(valor: string | null): valor is PerfilAtados {
  return valor === 'voluntario' || valor === 'ong'
}
