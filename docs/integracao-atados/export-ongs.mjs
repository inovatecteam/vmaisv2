#!/usr/bin/env node
/**
 * export-ongs.mjs — Exporta o catálogo de ONGs do Voluntária+ (Supabase) para
 * arquivos normalizados (JSON + CSV), prontos para o de-para → API da OVP (Atados).
 *
 * Migra APENAS o catálogo de ONGs (tabela `ongs` + dados do dono em `users`).
 * Não migra voluntários, interações, doação de sangue ou tarefas.
 *
 * Uso:
 *   node docs/integracao-atados/export-ongs.mjs --dry-run   # valida sem conectar
 *   node docs/integracao-atados/export-ongs.mjs             # exporta de verdade
 *   node docs/integracao-atados/export-ongs.mjs --all       # inclui ONGs não aprovadas
 *
 * Variáveis de ambiente (ver .env.example):
 *   NEXT_PUBLIC_SUPABASE_URL      URL do projeto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY     chave service-role (SECRETA — ignora RLS p/ ler tudo)
 *
 * Saída: docs/integracao-atados/export/  (ignorado pelo git — contém dados de ONGs)
 */

import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, 'export')

const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')
const INCLUDE_UNAPPROVED = args.has('--all')

// Colunas do catálogo que pretendemos exportar (ver de-para-ongs-ovp.csv).
const ONG_COLUMNS = [
  'id', 'user_id', 'nome', 'tipo', 'descricao', 'short_description',
  'how_to_help', 'doacoes', 'necessidades', 'localizacao_tipo', 'endereco_online',
  'whatsapp', 'endereco_fisico', 'lat', 'lng', 'thumbnail_url',
  'additional_categories', 'admin_approved', 'horarios_funcionamento',
  'created_at', 'updated_at',
]
const OWNER_COLUMNS = ['id', 'nome', 'email', 'telefone', 'foto', 'bio']

function log(msg) { process.stdout.write(msg + '\n') }

/** Serializa um array de objetos para CSV com aspas e arrays unidos por "; ". */
function toCsv(rows, columns) {
  const esc = (v) => {
    if (v === null || v === undefined) return ''
    const s = Array.isArray(v) ? v.join('; ') : String(v)
    return '"' + s.replace(/"/g, '""') + '"'
  }
  const header = columns.map(esc).join(',')
  const body = rows.map((r) => columns.map((c) => esc(r[c])).join(',')).join('\n')
  return header + '\n' + body + '\n'
}

/** Monta o objeto OVP a partir de uma ONG + dono, JÁ com as decisões aplicadas
 *  (ver "Decisões adotadas" no manual). */
function toOvpPreview(ong, owner) {
  // categorias unidas e deduplicadas -> mapear para IDs via de-para-causas.csv
  const categorias = [...new Set([...(ong.tipo || []), ...(ong.additional_categories || [])])]

  // details = descrição + campos sem par 1:1, concatenados com rótulos
  const parts = []
  if (ong.descricao) parts.push(ong.descricao)
  if (ong.how_to_help) parts.push('Como ajudar: ' + ong.how_to_help)
  if (ong.doacoes) parts.push('Doações: ' + ong.doacoes)
  if (ong.necessidades?.length) parts.push('Necessidades: ' + ong.necessidades.join('; '))
  if (ong.horarios_funcionamento) parts.push('Horários: ' + ong.horarios_funcionamento)
  const details = parts.join('\n\n').slice(0, 3000)

  return {
    _ref_voluntaria_id: ong.id,
    name: (ong.nome || '').slice(0, 150),
    description: (ong.short_description || ong.descricao || '').slice(0, 160),
    details,
    type: 0,                                      // organização padrão
    contact_name: owner?.nome ?? null,
    contact_email: owner?.email ?? null,          // também usado para criar o owner
    contact_phone: ong.whatsapp || owner?.telefone || null,
    website: Array.isArray(ong.endereco_online) ? (ong.endereco_online[0] ?? null) : null,
    image_url_origem: ong.thumbnail_url,          // re-upload no endpoint da OVP (Passo 4)
    address: { typed_address: ong.endereco_fisico ?? null, lat: ong.lat ?? null, lng: ong.lng ?? null },
    causes_origem: categorias,                    // mapear via de-para-causas.csv
    published: ong.admin_approved === true,       // só aprovadas migram (já filtrado na query)
    document: null,                               // CNPJ: vazio agora, coletar depois
    cover: null,                                  // sem capa na origem
  }
}

async function main() {
  log('— export-ongs.mjs — catálogo de ONGs Voluntária+ → Atados/OVP —\n')

  if (DRY_RUN) {
    log('MODO DRY-RUN (não conecta ao Supabase).')
    log('Colunas de ONG a exportar (' + ONG_COLUMNS.length + '): ' + ONG_COLUMNS.join(', '))
    log('Colunas do dono (users): ' + OWNER_COLUMNS.join(', '))
    log('Filtro: ' + (INCLUDE_UNAPPROVED ? 'todas as ONGs' : 'somente admin_approved = true (use --all p/ todas)'))
    log('Saída prevista: ' + OUT_DIR + '/{ongs.json, ongs.csv, ovp-preview.json, resumo.json}')
    log('\nPara exportar de verdade, defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY e rode sem --dry-run.')
    return
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    log('ERRO: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente (.env.local).')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  // 1) ONGs
  let q = supabase.from('ongs').select('*')
  if (!INCLUDE_UNAPPROVED) q = q.eq('admin_approved', true)
  const { data: ongs, error: ongErr } = await q
  if (ongErr) { log('ERRO ao ler ongs: ' + ongErr.message); process.exit(1) }
  log('ONGs lidas: ' + ongs.length)

  // 2) Donos (users) referenciados
  const ownerIds = [...new Set(ongs.map((o) => o.user_id).filter(Boolean))]
  const { data: owners, error: usrErr } = await supabase
    .from('users').select(OWNER_COLUMNS.join(',')).in('id', ownerIds)
  if (usrErr) { log('ERRO ao ler users: ' + usrErr.message); process.exit(1) }
  const ownerById = Object.fromEntries((owners || []).map((u) => [u.id, u]))

  // 3) Saídas
  mkdirSync(OUT_DIR, { recursive: true })
  const ovpPreview = ongs.map((o) => toOvpPreview(o, ownerById[o.user_id]))
  writeFileSync(join(OUT_DIR, 'ongs.json'), JSON.stringify(ongs, null, 2))
  writeFileSync(join(OUT_DIR, 'ongs.csv'), toCsv(ongs, ONG_COLUMNS))
  writeFileSync(join(OUT_DIR, 'ovp-preview.json'), JSON.stringify(ovpPreview, null, 2))

  // 4) Resumo de qualidade (campos vazios, contagens) p/ a seção de validação
  const resumo = {
    geradoEm: new Date().toISOString(),
    total: ongs.length,
    aprovadas: ongs.filter((o) => o.admin_approved).length,
    semThumbnail: ongs.filter((o) => !o.thumbnail_url).length,
    semEnderecoFisico: ongs.filter((o) => !o.endereco_fisico).length,
    semWhatsappEnemContato: ongs.filter((o) => !o.whatsapp && !ownerById[o.user_id]?.telefone).length,
    semCategorias: ongs.filter((o) => !(o.tipo?.length) && !(o.additional_categories?.length)).length,
    donosDistintos: ownerIds.length,
  }
  writeFileSync(join(OUT_DIR, 'resumo.json'), JSON.stringify(resumo, null, 2))

  log('\nResumo: ' + JSON.stringify(resumo, null, 2))
  log('\nArquivos gerados em: ' + OUT_DIR)
}

main().catch((e) => { log('FALHA: ' + (e?.stack || e)); process.exit(1) })
