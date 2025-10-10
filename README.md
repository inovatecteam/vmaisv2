# Voluntaria+ 💛

Uma plataforma web moderna que conecta ONGs a voluntários, facilitando o encontro entre organizações que precisam de ajuda e pessoas dispostas a fazer a diferença em suas comunidades.

## 🌟 Características

- **Interface Moderna**: Design limpo com bordas arredondadas e paleta branco/amarela
- **Responsivo**: Mobile-first com experiência otimizada para todos os dispositivos
- **Autenticação Completa**: Sistema seguro com Supabase Auth
- **Mapa Interativo**: Visualização geográfica das ONGs (com Google Maps API)
- **Dashboard Intuitivo**: Métricas e atividades do usuário
- **Conexão Direta**: Integração com WhatsApp para comunicação

## 🚀 Tecnologias

- **Frontend**: Next.js 14 com App Router, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + APIs)
- **Mapas**: Google Maps JavaScript API
- **Deploy**: Vercel

## 📋 Funcionalidades

### Para Voluntários
- ✅ Buscar ONGs por localização, tipo e causa
- ✅ Visualizar ONGs no mapa interativo
- ✅ Ver detalhes completos das organizações
- ✅ Contato direto via WhatsApp
- ✅ Dashboard com histórico de interações
- ✅ Gerenciamento de perfil e interesses

### Para ONGs
- ✅ Cadastro completo da organização
- ✅ Publicação nas oportunidades públicas
- ✅ Definição de necessidades de voluntariado
- ✅ Recebimento de contatos qualificados
- ✅ Presença no mapa da região

## 🏗️ Estrutura do Projeto

```
├── app/                    # Páginas do Next.js App Router
│   ├── oportunidades/          # Oportunidades de Voluntariado
│   ├── mapa/              # Mapa interativo
│   ├── dashboard/         # Dashboard do usuário
│   └── perfil/            # Perfil e configurações
├── components/            # Componentes React
│   ├── auth/              # Componentes de autenticação
│   ├── layout/            # Layout e navegação
│   ├── providers/         # Context providers
│   └── ui/                # Componentes shadcn/ui
├── lib/                   # Utilitários e configurações
├── types/                 # Tipos TypeScript
└── supabase/             # Migrações do banco
```

## 🗄️ Banco de Dados

### Tabelas Principais

**users**
- Dados pessoais dos usuários (voluntários e ONGs)
- Interesses, disponibilidade, localização

**ongs**
- Informações das organizações
- Descrição, necessidades, contato
- Coordenadas para o mapa

**interacoes**
- Histórico de conexões entre usuários e ONGs
- Métricas de engajamento

## ⚙️ Configuração

### 1. Pré-requisitos

```bash
Node.js 18+
npm ou yarn
Conta no Supabase
Conta no Google Cloud (para Maps API)
```

### 2. Instalação

```bash
# Clone o repositório
  git clone https://github.com/inovatecteam/vmaisv2
cd voluntaria-mais

# Instale as dependências
npm install
```

### 3. Configuração do Ambiente

Copie `.env.example` para `.env.local` e configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

# Google Maps (opcional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_do_google_maps
```

### 4. Configuração do Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Execute as migrações SQL (disponíveis na pasta `supabase/migrations/`)
3. Configure as políticas RLS (Row Level Security)
4. Obtenha as chaves de API

### 5. Migrações do Banco

Execute as migrações SQL no painel do Supabase:

```sql
-- Criar tabelas users, ongs, interacoes, tarefas
-- Habilitar RLS e criar políticas
-- Configurar triggers e funções (se necessário)
```

### 6. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 🎨 Customização

### Cores e Tema

As cores podem ser ajustadas em `tailwind.config.ts`:

```typescript
colors: {
  primary: '#FBBF24', // Amarelo principal
  secondary: '#FFFFFF', // Branco
  // ... outras cores
}
```

### Componentes UI

Todos os componentes utilizam shadcn/ui e podem ser customizados individualmente.

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Digital Ocean App Platform

## 🔒 Segurança

- ✅ Autenticação via Supabase Auth
- ✅ Row Level Security (RLS) habilitado
- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs
- ✅ Rotas protegidas com middleware

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Breakpoints otimizados
- ✅ Touch-friendly na mobile
- ✅ Navegação adaptativa

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contato: voluntariamaisrs@gmail.com

---

**Voluntaria+** | Conectando corações e causas para um mundo melhor 💛
