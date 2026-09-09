# Integração Técnica · Catálogo de ONGs → OVP

Guia **passo a passo** para a equipe técnica da **Rede Atados** assumir o catálogo de ONGs do
Voluntária+. A base da OVP passa a ser a oficial e `voluntariamais.com.br` **permanece com o
Voluntária+**, operando como porta de entrada co-branded que encaminha voluntários e ONGs
para a Atados.

**Inclui:** catálogo de ONGs aprovadas (`ongs` + contato do dono + logos).
**Não inclui:** voluntários, interações, doação de sangue, senhas.

@@INDEX@@

---

## Passo 1 · Preparar

> **Responsável:** [ambos] · **Pronto quando:** a Atados está com o pacote e os IDs de causes preenchidos.

- [V+] **entregar o pacote de integração** à Atados — a pasta `docs/integracao-atados/` (este manual + `de-para-ongs-ovp.csv`, `de-para-causas.csv` e os scripts). Pode ser por **acesso de leitura ao repositório** `inovatecteam/vmaisv2` ou por uma **pasta/zip compartilhada** pelo canal seguro.
- [Atados] abrir o **`de-para-causas.csv`** desse pacote e preencher os **IDs de `causes`** da OVP (já vem com a causa sugerida para cada categoria).
- [ambos] combinar o **canal seguro** para a entrega dos dados exportados no Passo 2.

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

*Alternativa: em vez de entregar arquivos, conceder um acesso read-only temporário à base — revogado no Passo 6.*

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

## Passo 5 · Validar e oficializar a base

> **Ponto crítico** · **Responsável:** [ambos] · **Pronto quando:** os dados conferem, a OVP é oficial e o Supabase está em read-only.

**Validar:**

- **Contagem:** Organizations criadas = total do `resumo.json`.
- **Amostra:** revisar 10–20 ONGs (nome, descrição, contato, categorias, logo, publicação).
- **Obrigatórios da OVP:** todas têm `name`, `owner` e `type`.

**Oficializar** (após a validação) — a partir daqui o catálogo vive oficialmente na OVP, nunca duas bases concorrentes:

- [V+] congelar a escrita no Supabase (**read-only**) — nenhuma edição nova entra ali.
- [Atados] a OVP assume como base única e oficial.
- [V+] manter o Supabase como **backup por 90 dias** e então descomissionar.

---

## Passo 6 · Ligar o encaminhamento e encerrar

> **Responsável:** [ambos] · rollback: esvaziar as variáveis de ambiente · **Pronto quando:** os CTAs do `voluntariamais.com.br` levam à Atados e os acessos temporários foram revogados.

Executar **somente após** o Passo 5. O domínio **não é transferido nem delegado**: o site do
Voluntária+ continua no ar como porta de entrada co-branded e encaminha os dois públicos para
a Atados.

**Encaminhamento:**

1. [Atados] entregar as **URLs de destino** — uma para voluntários e uma para a criação de perfil de ONG — e a convenção de parâmetros de rastreio que a plataforma aceita.
2. [V+] preencher `NEXT_PUBLIC_ATADOS_URL_VOLUNTARIO` e `NEXT_PUBLIC_ATADOS_URL_ONG` na Vercel. Vazio = fluxo interno preservado; preenchido = encaminhamento ativo. Não requer deploy de código.
3. [ambos] validar em staging antes de ligar em produção: home → `/parceria-atados` → destino na Atados, com os parâmetros de rastreio chegando do outro lado.
4. [Atados] exibir a marca Voluntária+ na página de criação de perfil de ONG, para dar continuidade à experiência de quem vem daqui.

**Origem do tráfego (para a Atados liberar/reconhecer):**

```
https://voluntariamais.com.br/parceria-atados?perfil=voluntario
https://voluntariamais.com.br/parceria-atados?perfil=ong
Referrer: voluntariamais.com.br
```

**E-mail:** o remetente `info@voluntariamais.com.br` (Resend) permanece com o Voluntária+, já
que o domínio não muda de mãos.

**Encerrar:**

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
