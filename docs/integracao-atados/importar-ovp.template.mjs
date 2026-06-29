#!/usr/bin/env node
/**
 * importar-ovp.template.mjs — ESQUELETO (template) de importação para a API da OVP (Atados).
 *
 * Este arquivo é um ponto de partida. Antes de usar, a Atados precisa fornecer:
 *   - OVP_API_URL    base da API (ex.: https://api.atados.com.br)
 *   - OVP_API_TOKEN  token de autenticação (SECRETO)
 *   - o endpoint exato de criação de Organization e de upload de imagem
 *   - o de-para de causas preenchido (de-para-causas.csv) com os IDs reais
 *
 * Lê docs/integracao-atados/export/ovp-preview.json (gerado por export-ongs.mjs) e
 * faz POST de cada organização. Por padrão roda em DRY-RUN (não envia nada).
 *
 * Uso:
 *   node docs/integracao-atados/importar-ovp.template.mjs            # dry-run (default)
 *   node docs/integracao-atados/importar-ovp.template.mjs --commit   # envia de verdade
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT = join(__dirname, 'export', 'ovp-preview.json')

const COMMIT = process.argv.slice(2).includes('--commit')
const OVP_API_URL = process.env.OVP_API_URL
const OVP_API_TOKEN = process.env.OVP_API_TOKEN

// TODO(Atados): preencher a partir de de-para-causas.csv  { "Educacao": 1, ... }
const CAUSES_MAP = {}

// TODO(Atados): confirmar caminhos reais da API da OVP.
const ORGANIZATIONS_PATH = '/organizations/'
// const UPLOAD_IMAGE_PATH = '/uploads/images/'

function log(m) { process.stdout.write(m + '\n') }

/** Converte o preview do de-para (já com as decisões aplicadas) no payload da API da OVP. */
function toOvpPayload(o) {
  return {
    name: o.name,
    description: o.description,
    details: o.details,
    type: o.type,                                 // 0 (organização padrão)
    contact_name: o.contact_name,
    contact_email: o.contact_email,
    contact_phone: o.contact_phone,
    website: o.website,
    published: o.published,
    document: o.document,                         // vazio agora; coletar depois
    address: o.address,                           // { typed_address, lat, lng } — confirmar formato da OVP
    causes: (o.causes_origem || []).map((c) => CAUSES_MAP[c]).filter((v) => v != null),
    // image: <id retornado pelo upload de o.image_url_origem>,  // TODO(Atados): upload primeiro (Passo 4)
    _ref_voluntaria_id: o._ref_voluntaria_id,     // para reconciliação
  }
}

async function postOrganization(payload) {
  const res = await fetch(OVP_API_URL.replace(/\/$/, '') + ORGANIZATIONS_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO(Atados): confirmar o esquema de auth (Bearer? Token? ApiKey?)
      Authorization: 'Bearer ' + OVP_API_TOKEN,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + (await res.text()))
  return res.json()
}

async function main() {
  const items = JSON.parse(readFileSync(INPUT, 'utf8'))
  log('Organizações a importar: ' + items.length + (COMMIT ? '  [COMMIT]' : '  [DRY-RUN]'))

  if (COMMIT && (!OVP_API_URL || !OVP_API_TOKEN)) {
    log('ERRO: defina OVP_API_URL e OVP_API_TOKEN para --commit.'); process.exit(1)
  }

  const results = []
  for (const [i, o] of items.entries()) {
    const payload = toOvpPayload(o)
    if (!COMMIT) {
      if (i < 3) log('\n[preview ' + (i + 1) + '] ' + JSON.stringify(payload, null, 2))
      continue
    }
    try {
      const created = await postOrganization(payload)
      results.push({ ref: o._ref_voluntaria_id, ovp_id: created?.id ?? null, ok: true })
      log('OK  ' + o.name)
    } catch (e) {
      results.push({ ref: o._ref_voluntaria_id, ok: false, erro: String(e.message || e) })
      log('ERRO ' + o.name + ' :: ' + e.message)
    }
    await new Promise((r) => setTimeout(r, 250)) // rate-limit gentil
  }

  if (!COMMIT) {
    log('\nDRY-RUN: nada foi enviado. Preencha CAUSES_MAP, confirme endpoints/auth e rode com --commit.')
  } else {
    log('\nImportadas: ' + results.filter((r) => r.ok).length + ' / ' + results.length)
    log('Salve o mapa de IDs (ref -> ovp_id) para reconciliação.')
  }
}

main().catch((e) => { log('FALHA: ' + (e?.stack || e)); process.exit(1) })
