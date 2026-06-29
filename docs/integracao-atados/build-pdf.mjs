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
// "## Passo N · Título" -> cabeçalho HTML com badge numerado (marked passa HTML adiante)
mdPlaceheld = mdPlaceheld.replace(
  /^##\s+Passo\s+(\d+)\s*[·•:.\-—]\s*(.+)$/gm,
  (_, n, t) => `<h2 class="step"><span class="badge">${n}</span><span class="t">${t.trim()}</span></h2>`,
)

// Embute strings com segurança dentro do HTML/JS (evita fechar <script>).
const enc = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')
const mdLiteral = enc(mdPlaceheld)
const blocksLiteral = enc(mermaidBlocks)

const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
         color: #374151; line-height: 1.6; font-size: 10.5pt; }

  /* Capa / título */
  h1 { color: #111827; font-size: 25pt; line-height: 1.2; margin: 0 0 4px;
       padding-bottom: 12px; border-bottom: 3px solid ${BRAND}; }

  /* Cabeçalhos de seção (Roteiro, Anexos) */
  h2 { color: #111827; font-size: 14pt; margin: 26px 0 10px; padding-left: 10px;
       border-left: 4px solid #e5e7eb; page-break-after: avoid; }

  /* Passos numerados (transformados no JS) */
  h2.step { display: flex; align-items: center; gap: 12px; border-left: none;
            padding: 0; margin: 30px 0 12px; page-break-after: avoid; }
  h2.step .badge { flex: none; width: 32px; height: 32px; border-radius: 9px;
            background: ${BRAND}; color: #1f2937; font-weight: 800; font-size: 15pt;
            display: flex; align-items: center; justify-content: center; }
  h2.step .t { font-size: 14pt; font-weight: 700; color: #111827; }

  h3 { color: #111827; font-size: 11.5pt; margin: 16px 0 6px; page-break-after: avoid; }
  p { margin: 7px 0; }
  a { color: #b45309; text-decoration: none; }
  strong { color: #1f2937; }

  code { background: #f3f4f6; padding: 1px 5px; border-radius: 4px; font-size: 9pt;
         font-family: "SF Mono", Menlo, Consolas, monospace; color: #b45309; }
  pre { background: #f8fafc; color: #1f2937; padding: 12px 14px; border: 1px solid #e5e7eb;
        border-left: 3px solid ${BRAND}; border-radius: 8px; overflow-x: auto;
        font-size: 8.8pt; page-break-inside: avoid; }
  pre code { background: transparent; color: #1f2937; padding: 0; }

  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9pt;
          page-break-inside: avoid; }
  th, td { border: 1px solid #eceff3; padding: 6px 9px; text-align: left; vertical-align: top; }
  th { background: #fef3c7; color: #1f2937; font-weight: 700; border-bottom: 2px solid ${BRAND}; }
  tr:nth-child(even) td { background: #fbfcfe; }

  /* Callout (linha "Quem / Pronto quando" e notas) */
  blockquote { margin: 10px 0; padding: 9px 14px; background: #fffdf5;
               border: 1px solid #fde9b0; border-left: 4px solid ${BRAND};
               border-radius: 6px; color: #4b5563; page-break-inside: avoid; }
  blockquote p { margin: 3px 0; }

  hr { border: none; border-top: 1px solid #eceff3; margin: 4px 0; }
  ul, ol { margin: 7px 0; padding-left: 20px; }
  li { margin: 3px 0; }
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
      footerTemplate: '<div style="width:100%;font-size:8px;color:#9ca3af;padding:0 16mm;text-align:right;">' +
        'Voluntária+ × Rede Atados — Manual de Integração · pág. <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
    })
    writeFileSync(PDF_PATH.replace(/\.pdf$/, '.preview.html'), html) // útil para revisar no browser
    console.log('PDF gerado: ' + PDF_PATH)
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
