#!/usr/bin/env node
/**
 * build-pdf.mjs — Converte manual-integracao-atados.md em PDF visual (A4).
 *
 * Reaproveita o Chromium do Playwright (já é devDependency do projeto). Renderiza
 * o Markdown com marked + diagramas Mermaid (via CDN) e imprime em PDF.
 *
 * Uso:  node docs/integracao-atados/build-pdf.mjs
 * Requer: acesso à internet (CDN do marked/mermaid) e o Chromium do Playwright
 *         (se faltar:  npx playwright install chromium).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MD_PATH = join(__dirname, 'manual-integracao-atados.md')
const PDF_PATH = join(__dirname, 'manual-integracao-atados.pdf')
const BRAND = '#FBBF24'

// 1) Lê o markdown e EXTRAI os blocos mermaid aqui no Node (fora do <script>),
//    substituindo por placeholders. Assim não dependemos da API do marked p/ mermaid.
const rawMd = readFileSync(MD_PATH, 'utf8')
const mermaidBlocks = []
let mdPlaceheld = rawMd.replace(/```mermaid\r?\n([\s\S]*?)```/g, (_, code) => {
  mermaidBlocks.push(code)
  return '\n@@MERMAID' + (mermaidBlocks.length - 1) + '@@\n'
})
// "## Passo N · Título" -> cabeçalho com badge; coleta os passos para o índice
const steps = []
mdPlaceheld = mdPlaceheld.replace(
  /^##\s+Passo\s+(\d+)\s*[·•:.\-—]\s*(.+)$/gm,
  (_, n, t) => {
    steps.push({ n, t: t.trim() })
    return `<h2 class="step"><span class="badge">${n}</span><span class="t">${t.trim()}</span></h2>`
  },
)

// índice enxuto dos passos (substitui o placeholder @@INDEX@@)
const indexHtml = '<ol class="index">' +
  steps.map((s) => `<li><span class="i-num">${s.n}</span><span class="i-t">${s.t}</span></li>`).join('') +
  '</ol>'
mdPlaceheld = mdPlaceheld.replace('@@INDEX@@', indexHtml)

// pills de responsável no lugar de emojis genéricos
mdPlaceheld = mdPlaceheld
  .replace(/\[V\+\]/g, '<span class="role role-v">Voluntária+</span>')
  .replace(/\[Atados\]/g, '<span class="role role-a">Atados</span>')
  .replace(/\[ambos\]/g, '<span class="role role-both">os dois</span>')

// Embute strings com segurança dentro do HTML/JS (evita fechar <script>).
const enc = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')
const mdLiteral = enc(mdPlaceheld)
const blocksLiteral = enc(mermaidBlocks)

const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 19mm 17mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
         color: #44403c; line-height: 1.62; font-size: 10.5pt; }

  /* Capa / título — com eyebrow da marca */
  #content h1 { color: #1c1917; font-size: 23pt; line-height: 1.15; margin: 0 0 10px;
       padding-bottom: 12px; border-bottom: 3px solid ${BRAND}; }
  #content h1::before { content: "Voluntária+ 💛"; display: block; font-size: 9.5pt;
       font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
       color: #d97706; margin-bottom: 9px; }

  /* Índice dos passos */
  ol.index { list-style: none; margin: 16px 0 4px; padding: 0; }
  ol.index li { display: flex; align-items: center; gap: 11px; padding: 7px 2px;
       border-bottom: 1px solid #f3ecdd; font-size: 10.5pt; }
  ol.index li:last-child { border-bottom: none; }
  ol.index .i-num { flex: none; width: 21px; height: 21px; border-radius: 50%;
       background: #fef3c7; color: #b45309; font-weight: 800; font-size: 8.5pt;
       display: inline-flex; align-items: center; justify-content: center; }
  ol.index .i-t { font-weight: 600; color: #44403c; }

  /* Cabeçalhos de seção (Referência) */
  h2 { color: #1c1917; font-size: 13.5pt; margin: 24px 0 10px; padding-left: 11px;
       border-left: 4px solid #f0d488; page-break-after: avoid; }

  /* Passos (badge em círculo) */
  h2.step { display: flex; align-items: center; gap: 13px; border-left: none;
            padding: 0; margin: 30px 0 6px; page-break-after: avoid; }
  h2.step .badge { flex: none; width: 30px; height: 30px; border-radius: 50%;
            background: ${BRAND}; color: #4a3500; font-weight: 800; font-size: 13pt;
            display: flex; align-items: center; justify-content: center; }
  h2.step .t { font-size: 14pt; font-weight: 700; color: #1c1917; }

  h3 { color: #1c1917; font-size: 11pt; margin: 14px 0 6px; }
  p { margin: 7px 0; }
  a { color: #b45309; text-decoration: none; }
  strong { color: #292524; }

  /* Pills de responsável (substituem 🟡/🔵) */
  .role { display: inline-block; font-size: 8pt; font-weight: 700; padding: 1px 8px;
          border-radius: 999px; vertical-align: middle; letter-spacing: .01em; }
  .role-v { background: ${BRAND}; color: #4a3500; }
  .role-a { background: #ffffff; color: #475569; border: 1.3px solid #cbd5e1; }
  .role-both { background: #f1f5f9; color: #475569; }

  code { background: #f7f3ea; padding: 1px 5px; border-radius: 4px; font-size: 9pt;
         font-family: "SF Mono", Menlo, Consolas, monospace; color: #b45309; }
  pre { background: #fcfaf4; color: #44403c; padding: 12px 14px; border: 1px solid #eee2c8;
        border-left: 3px solid ${BRAND}; border-radius: 8px; overflow-x: auto;
        font-size: 8.8pt; page-break-inside: avoid; }
  pre code { background: transparent; color: #44403c; padding: 0; }

  /* Linha "responsável / pronto quando" — leve, sem caixa pesada */
  blockquote { margin: 6px 0 10px; padding: 3px 0 3px 13px; border-left: 3px solid ${BRAND};
               color: #78716c; font-size: 9.5pt; page-break-inside: avoid; }
  blockquote p { margin: 2px 0; }

  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9pt;
          page-break-inside: avoid; }
  th, td { border: 1px solid #f0ebe0; padding: 6px 9px; text-align: left; vertical-align: top; }
  th { background: #fef3c7; color: #44403c; font-weight: 700; border-bottom: 2px solid ${BRAND}; }
  tr:nth-child(even) td { background: #fdfbf6; }

  hr { border: none; border-top: 1px solid #f0ebe0; margin: 4px 0; }
  ul, ol { margin: 7px 0; padding-left: 20px; }
  li { margin: 4px 0; }
  .mermaid { text-align: center; margin: 14px 0; page-break-inside: avoid; }
</style>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head><body><div id="content"></div>
<script>
  var SRC = ${mdLiteral};
  var BLOCKS = ${blocksLiteral};
  marked.setOptions({ gfm: true, breaks: false });
  var out = marked.parse(SRC);
  // troca os placeholders por divs do mermaid (com e sem o <p> que o marked adiciona)
  for (var i = 0; i < BLOCKS.length; i++) {
    var token = '@@MERMAID' + i + '@@';
    var div = '<div class="mermaid">' + BLOCKS[i] + '</div>';
    out = out.split('<p>' + token + '</p>').join(div).split(token).join(div);
  }
  document.getElementById('content').innerHTML = out;
  window.__ready = false;
  mermaid.initialize({ startOnLoad: false, theme: 'base',
    themeVariables: { primaryColor: '#fffbeb', primaryBorderColor: '${BRAND}', lineColor: '#9ca3af' } });
  (async function () {
    try { await mermaid.run({ querySelector: '.mermaid' }); } catch (e) { console.error(e); }
    window.__ready = true;
  })();
</script></body></html>`

async function main() {
  let chromium
  try {
    ({ chromium } = await import('@playwright/test'))
  } catch {
    console.error('Playwright não encontrado. Rode `npm install` e `npx playwright install chromium`.')
    process.exit(1)
  }
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__ready === true, { timeout: 30000 }).catch(() => {})
    await page.pdf({
      path: PDF_PATH, format: 'A4', printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-size:8px;color:#a8a29e;padding:0 17mm;text-align:right;">' +
        'Voluntária+ 💛 Rede Atados · pág. <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
    })
    writeFileSync(PDF_PATH.replace(/\.pdf$/, '.preview.html'), html) // útil para revisar no browser
    console.log('PDF gerado: ' + PDF_PATH)
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
