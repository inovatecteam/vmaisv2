/**
 * Coberturas de imprensa que nomeiam o Voluntaria+.
 *
 * Só entram aqui matérias que citam a plataforma. As reportagens sobre a
 * inauguração da Escola Tio Trampo que não mencionam o Voluntaria+ servem de
 * contexto e fonte, mas ficam de fora: um card aqui sugeriria um crédito que a
 * matéria não dá.
 *
 * `data` é o texto exibido; `ordem` (AAAAMMDD) existe só para ordenar, já que
 * a veiculação no SBT não tem dia registrado publicamente.
 */
export type AparicaoNaMidia = {
  veiculo: string
  programa: string
  assunto: string
  data: string
  ordem: number
  link: string
}

export const APARICOES_NA_MIDIA: AparicaoNaMidia[] = [
  {
    veiculo: 'RBS TV',
    programa: 'Bom Dia Rio Grande, reportagem de Mary Silva',
    assunto:
      'A escola no Morro da Cruz, mostrando o Voluntaria+ como o que viabilizou parte da reforma.',
    data: '10 de julho de 2026',
    ordem: 20260710,
    link: 'https://www.facebook.com/rbstv/videos/1007908015562388',
  },
  {
    veiculo: 'GZH / Zero Hora',
    programa: 'Coluna Juliana Bublitz',
    assunto:
      'Porto Alegre vai ganhar uma escola de grafite e artes visuais no Morro da Cruz.',
    data: '9 de julho de 2026',
    ordem: 20260709,
    link: 'https://gauchazh.clicrbs.com.br/colunistas/juliana-bublitz/noticia/2026/07/porto-alegre-vai-ganhar-uma-escola-de-grafite-e-artes-visuais-no-morro-da-cruz-cmrdq2uvz01h801316sz6s9ys.html',
  },
  {
    veiculo: 'Brasil de Fato',
    programa: 'Redação',
    assunto:
      'Estudantes viabilizam reforma de espaço cultural no Morro da Cruz, em Porto Alegre.',
    data: '8 de julho de 2026',
    ordem: 20260708,
    link: 'https://www.brasildefato.com.br/2026/07/08/estudantes-viabilizam-reforma-de-espaco-cultural-no-morro-da-cruz-em-porto-alegre',
  },
  {
    veiculo: 'SBT RS',
    programa: 'Reportagem sobre o InovaTec e o Voluntaria+',
    assunto:
      'A plataforma, com 15 ONGs cadastradas na época, e a campanha da UCERGS.',
    data: 'Outubro de 2025',
    ordem: 20251001,
    link: 'https://www.instagram.com/reel/DPWI_YvEYNq',
  },
  {
    veiculo: 'RBS TV',
    programa: 'RBS Notícias',
    assunto:
      'Reportagem do Dia Nacional do Voluntariado, com o Voluntaria+ entre as iniciativas.',
    data: '28 de agosto de 2025',
    ordem: 20250828,
    link: 'https://www.facebook.com/SouFarroupilha/videos/1470912627490790',
  },
  {
    veiculo: 'Colégio Farroupilha',
    programa: 'Portal institucional',
    assunto:
      'Plataforma criada por alunos do Colégio Farroupilha conecta voluntários com instituições que precisam de ajuda.',
    data: '28 de agosto de 2025',
    ordem: 20250827,
    link: 'https://colegiofarroupilha.poa.br/2025/08/28/plataforma-criada-por-alunos-conecta-voluntarios-com-instituicoes-que-precisam-de-ajuda/',
  },
  {
    veiculo: 'Correio do Povo',
    programa: 'Notícias / Ensino',
    assunto: 'Ações de solidariedade mobilizam alunos, com fala sobre o aplicativo.',
    data: '15 de julho de 2024',
    ordem: 20240715,
    link: 'https://www.correiodopovo.com.br/not%C3%ADcias/ensino/a%C3%A7%C3%B5es-de-solidariedade-mobilizam-alunos-1.1512834',
  },
]
