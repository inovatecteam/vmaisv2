# Integração Técnica · Catálogo de ONGs → OVP

Guia **passo a passo** para a equipe técnica da **Rede Atados** assumir o catálogo de ONGs do
Voluntária+. A base da OVP passa a ser a oficial e `voluntariamais.com.br` aponta para a Atados.

**Inclui:** catálogo de ONGs aprovadas (`ongs` + contato do dono + logos).
**Não inclui:** voluntários, interações, doação de sangue, senhas.

@@INDEX@@

---

## Passo 1 · Preparar

> **Responsável:** [Atados] · **Pronto quando:** IDs de causes preenchidos e canal seguro combinado.

A única preparação antes de começar:

- [Atados] confirmar os **IDs de `causes`** em `de-para-causas.csv` — já vem com a causa sugerida para cada categoria.
- [ambos] combinar o **canal seguro** para a entrega dos dados (gerenciador de senhas / link protegido).

---

## Passo 2 · Exportar e entregar

> **Responsável:** [V+] · ~10 min · **Pronto quando:** a pasta `export/` é entregue à Atados.

Exportar **somente as ONGs aprovadas** e entregar pelo canal seguro:

```bash
# .env.local com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (uso local)
node docs/integracao-atados/export-ongs.mjs --dry-run   # confere o plano
node docs/integracao-atados/export-ongs.mjs             # exporta as aprovadas
```

Gera `ongs.json`, `ongs.csv`, `ovp-preview.json` (já no formato da OVP) e `resumo.json`.

*Alternativa: em vez de entregar arquivos, conceder um acesso read-only temporário à base — revogado no Passo 8.*

---

## Passo 3 · Importar na OVP

> **Responsável:** [Atados] · **Pronto quando:** nº de Organizations = nº de ONGs entregues.

A Atados importa na **própria OVP** (as credenciais da OVP ficam só do lado dela). O de-para já vem aplicado no `ovp-preview.json` — ver a referência ao final.

1. Preencher `CAUSES_MAP` (do Passo 1) e as credenciais da OVP no template.
2. Rodar `importar-ovp.template.mjs` (dry-run → `--commit`).
3. Guardar o mapa **`id Voluntária+ ↔ id OVP`** para reconciliação.

---

## Passo 4 · Migrar as logos

> **Responsável:** [Atados] · **Pronto quando:** cada ONG com logo tem `image` na OVP.

Para cada ONG: baixar a logo de `thumbnail_url` (URLs públicas do bucket `ongs`), subir no endpoint de upload da OVP e vincular ao campo `image`.

---

## Passo 5 · Validar

> **Responsável:** [ambos] · **Pronto quando:** contagens e amostragem batem.

- **Contagem:** Organizations criadas = total do `resumo.json`.
- **Amostra:** revisar 10–20 ONGs (nome, descrição, contato, categorias, logo, publicação).
- **Obrigatórios da OVP:** todas têm `name`, `owner` e `type`.

---

## Passo 6 · Oficializar a base

> **Ponto crítico** · **Responsável:** [ambos] · **Pronto quando:** a OVP é oficial e o Supabase está em read-only.

A partir daqui, **o catálogo vive oficialmente na OVP** — nunca duas bases concorrentes.

- [V+] congelar a escrita no Supabase (**read-only**) — nenhuma edição nova entra ali.
- [Atados] a OVP assume como base única e oficial.
- [V+] manter o Supabase como **backup por 90 dias** e então descomissionar.

---

## Passo 7 · Apontar o domínio

> **Responsável:** [ambos] · rollback: reverter o DNS · **Pronto quando:** `voluntariamais.com.br` abre o site da Atados e o e-mail autentica.

Executar **somente após** os Passos 5–6. Mantemos o registro do domínio e **delegamos o DNS** (sem transferir o registro).

1. [V+] reduzir o **TTL de DNS** (ex.: 300s) 24–48h antes.
2. [V+] apontar os nameservers de `voluntariamais.com.br` para a **Cloudflare da Atados**.
3. [Atados] configurar o DNS de `voluntariamais.com.br` e `www` para o frontend (Vercel/Cloudflare) e validar **SSL**.
4. [Atados] configurar e-mail no **Sparkpost** (SPF/DKIM/DMARC) e testar — hoje é Resend, remetente `info@voluntariamais.com.br`.

---

## Passo 8 · Encerrar

> **Responsável:** [ambos] · **Pronto quando:** o catálogo está 100% na Atados e os acessos temporários foram revogados.

- [Atados] o catálogo passa a ser gerido inteiramente na OVP.
- [V+] **revogar** o acesso temporário e quaisquer credenciais de transição.
- [V+] descomissionar o Supabase após os 90 dias de backup.

O Voluntária+ **não** mantém conta nem token na OVP — encerrada a transferência, a operação é toda da Atados.

---

## Referência · de-para (`ongs` → `Organization`)

Versão completa: `de-para-ongs-ovp.csv`.

| Origem (Voluntária+) | Destino OVP | Regra |
|---|---|---|
| `nome` | `name` | cópia |
| `short_description` / `descricao` | `description` / `details` | truncar 160 / 3000 |
| `how_to_help`, `doações`, `necessidades`, `horários` | `details` | concatenados com rótulos |
| `whatsapp` / dono `telefone` | `contact_phone` | normalizar +55 |
| dono `nome` / `email` | `contact_name` / `contact_email` + `owner` | criar usuário pelo e-mail |
| `endereco_fisico` + `lat`/`lng` | `address` | texto + coords; geocodificar o que faltar |
| `tipo[]` + `additional_categories[]` | `causes` | de-para de causas (Atados confirma IDs) |
| `thumbnail_url` | `image` | re-upload (Passo 4) |
| `admin_approved` | `published` | só aprovadas → publicadas |
| — | `document` (CNPJ) | vazio agora; coletar depois |
| — | `type` | `0` (padrão) |

**Arquivos do pacote:** `de-para-ongs-ovp.csv` · `de-para-causas.csv` · `export-ongs.mjs` (lado Voluntária+) · `importar-ovp.template.mjs` (lado Atados) · `build-pdf.mjs`.

> **Segurança:** segredos só por canal seguro; nunca no git, e-mail ou PDF. **LGPD:** o catálogo é majoritariamente dado de PJ/contato público; a base legal cobre o compartilhamento dos dados de contato do dono com a Atados (operadora).

---

*Voluntária+ 💛 × Rede Atados · Origem: `inovatecteam/vmaisv2` · Supabase `jrovakzvlhvbzyftphxl` · `voluntariamais.com.br`*
