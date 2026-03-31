# Voluntária+ 💛

Plataforma web que conecta ONGs a voluntários no Rio Grande do Sul, facilitando o encontro entre organizações que precisam de ajuda e pessoas dispostas a fazer a diferença.

**Produção:** [voluntariamais.com.br](https://voluntariamais.com.br)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Banco de Dados | Supabase (PostgreSQL gerenciado) |
| Autenticação | Supabase Auth via `@supabase/ssr` |
| Mapas | Google Maps JavaScript API |
| Forms | React Hook Form + Zod |
| Email | Resend (via Supabase Edge Function) |
| Analytics | Vercel Analytics + Google Ads |
| Deploy | Vercel (deploy automático via GitHub) |

---

## Pré-requisitos

- Node.js 18+
- npm
- Conta no [Supabase](https://supabase.com) (projeto já existente)
- Chave da Google Maps API (opcional — mapa não carrega sem ela)

---

## Configuração Local

### 1. Clonar e instalar

```bash
git clone https://github.com/inovatecteam/vmaisv2.git
cd vmaisv2
npm install
```

### 2. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Obrigatórias — encontre no Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Opcional — mapa interativo das ONGs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Opcional — tracking Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17507836658
```

### 3. Rodar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Outros comandos

```bash
npm run build     # Build de produção
npm start         # Servidor de produção
npm run lint      # ESLint
```

---

## Estrutura do Projeto

```
vmaisv2/
├── app/                          # Páginas (App Router)
│   ├── page.tsx                 # Landing page
│   ├── entrar/                  # Login
│   ├── cadastrar/               # Cadastro
│   ├── esqueci-senha/           # Reset de senha
│   ├── oportunidades/           # Listagem de ONGs com filtros e paginação
│   ├── mapa/                    # Mapa interativo (Google Maps)
│   ├── dashboard/               # Painel do voluntário (protegido)
│   ├── perfil/                  # Edição de perfil (protegido)
│   ├── configuracoes/           # Configurações e exclusão de conta (protegido)
│   ├── onboarding/              # Setup obrigatório pós-cadastro (protegido)
│   ├── sobre/, ajuda/, privacidade/, termos/   # Páginas estáticas
│   └── api/auth/callback/       # Callback OAuth do Supabase
│
├── components/
│   ├── ui/                      # Componentes shadcn/ui (gerados via CLI)
│   ├── auth/                    # Modal de autenticação
│   ├── layout/                  # Navbar e Footer
│   ├── providers/               # AuthProvider (Context API)
│   └── map/                     # LocationPickerMap
│
├── lib/
│   ├── supabase.ts              # Cliente Supabase (browser, singleton)
│   ├── supabase-server.ts       # Cliente Supabase (server components)
│   ├── auth.ts                  # signUp, signIn, signOut, getCurrentUser
│   ├── api.ts                   # sendContactEmail (com retry)
│   ├── google-maps-loader.ts    # Loader lazy do Google Maps
│   └── utils.ts                 # cn(), formatPhone(), retryWithBackoff()
│
├── types/
│   ├── database.ts              # Tipos gerados do Supabase (manter sincronizado)
│   └── index.ts                 # User, ONG, Interacao
│
├── supabase/
│   ├── migrations/              # Migrações SQL (aplicar manualmente no Supabase)
│   └── functions/               # Edge Functions (send-whatsapp-contact-email)
│
├── middleware.ts                 # Proteção de rotas + refresh de sessão
└── tailwind.config.ts            # Cores, animações, tema
```

---

## Autenticação

A autenticação usa **Supabase Auth** com `@supabase/ssr`:

- **Browser**: `lib/supabase.ts` → `createBrowserClient` (usado em componentes client)
- **Server**: `lib/supabase-server.ts` → `createServerClient` (usado em route handlers e server components)
- **Middleware**: `middleware.ts` → refresh de sessão via cookies em **todas as rotas**, proteção de `/dashboard`, `/perfil`, `/configuracoes`, `/onboarding`

### Fluxo do usuário

1. Cadastro em `/cadastrar` → email de confirmação
2. Login em `/entrar` → sessão persistida via cookies
3. Primeiro login → redirecionado para `/onboarding` (obrigatório)
4. Após onboarding → acesso ao dashboard e funcionalidades completas

### Rotas protegidas

Definidas no `middleware.ts`. O middleware verifica sessão e status de onboarding. Se o perfil não existir no banco, é criado automaticamente no primeiro login (`lib/auth.ts`).

---

## Banco de Dados

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Perfis de voluntários e ONGs |
| `ongs` | Organizações cadastradas (requer `admin_approved = true` para exibição) |
| `interacoes` | Histórico de contatos entre voluntários e ONGs |
| `blood_donation_registrations` | Campanha de doação de sangue |

### Segurança (RLS)

Row Level Security está habilitado em todas as tabelas:
- **users**: cada usuário só lê/edita seu próprio perfil
- **ongs**: somente ONGs aprovadas são visíveis publicamente; donos veem suas próprias ONGs
- **interacoes**: usuários inserem e leem suas próprias interações

### Migrações

As migrações ficam em `supabase/migrations/`. Para aplicar uma nova migração:

1. Abra o **SQL Editor** no [Supabase Dashboard](https://supabase.com/dashboard)
2. Cole o conteúdo do arquivo `.sql`
3. Clique **Run**

**Importante:** migrações não são aplicadas automaticamente pelo deploy. Sempre aplique manualmente após merge.

---

## Supabase Edge Functions

### `send-whatsapp-contact-email`

Envia emails quando um voluntário contata uma ONG via WhatsApp. Usa **Resend** como provider.

**Variáveis de ambiente necessárias no Supabase:**

| Variável | Descrição |
|----------|-----------|
| `RESEND_API_KEY` | Chave da API do Resend |
| `ADMIN_EMAIL` | Email admin (fallback: voluntariamaisrs@gmail.com) |

Para deploy de funções:
```bash
npx supabase functions deploy send-whatsapp-contact-email
```

---

## Deploy (Vercel)

O projeto está conectado à Vercel via GitHub. Todo push na branch `main` dispara deploy automático.

### Variáveis de ambiente na Vercel

Configure no [Vercel Dashboard](https://vercel.com) > Project Settings > Environment Variables:

| Variável | Tipo |
|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Pública |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Pública (opcional) |

### Checklist pós-deploy

- [ ] Verificar que o login persiste após refresh
- [ ] Verificar que o mapa carrega no Chrome e Safari
- [ ] Verificar que "Sobre Nós" aparece no menu quando logado
- [ ] Verificar que o botão "Reportar" funciona em `/oportunidades`
- [ ] Aplicar migrações SQL pendentes no Supabase

---

## Funcionalidades

### Para Voluntários
- Buscar ONGs por localização, tipo e causa
- Visualizar ONGs no mapa interativo
- Contato direto via WhatsApp (com envio de email à ONG)
- Dashboard com histórico de interações
- Reportar ONGs com problemas

### Para ONGs
- Cadastro completo da organização
- Publicação nas oportunidades (após aprovação admin)
- Recebimento de contatos qualificados por email
- Presença no mapa da região

---

## Contato

- Email: voluntariamaisrs@gmail.com
- GitHub: [inovatecteam/vmaisv2](https://github.com/inovatecteam/vmaisv2)

## Licença

MIT — ver [LICENSE](LICENSE)
