# 🚀 Setup Guide - Voluntaria+

## 🔧 Configuração do Ambiente

### 1. Variáveis de Ambiente Obrigatórias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Supabase Configuration (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Key (OPCIONAL - para página /mapa)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Configuração do Supabase

1. **Criar projeto no Supabase:**
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Aguarde a criação do banco de dados

2. **Obter as chaves de API:**
   - No dashboard do projeto, vá para **Settings > API**
   - Copie a **Project URL** para `NEXT_PUBLIC_SUPABASE_URL`
   - Copie a **anon public** key para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Executar migrações:**
   - Vá para **SQL Editor** no dashboard
   - Execute as migrações da pasta `supabase/migrations/`

### 3. Configuração do Google Maps (Opcional)

1. **Criar projeto no Google Cloud:**
   - Acesse [console.cloud.google.com](https://console.cloud.google.com)
   - Crie um novo projeto ou selecione um existente

2. **Habilitar Maps JavaScript API:**
   - Vá para **APIs & Services > Library**
   - Procure por "Maps JavaScript API" e habilite

3. **Criar chave de API:**
   - Vá para **APIs & Services > Credentials**
   - Clique em **Create Credentials > API Key**
   - Copie a chave para `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 4. Testando a Configuração

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Verifique as páginas:**
   - `/oportunidades` - Deve carregar a lista de ONGs
   - `/mapa` - Deve mostrar o mapa ou um placeholder informativo
   - `/entrar` - Deve permitir login

3. **Verifique o console do navegador:**
   - Abra as ferramentas de desenvolvedor (F12)
   - Vá para a aba Console
   - Procure por erros relacionados ao Supabase

## 🐛 Solução de Problemas

### Página fica carregando infinitamente

**Causa:** Variáveis de ambiente do Supabase não configuradas
**Solução:** Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Erro "Configuração do Supabase não encontrada"

**Causa:** Arquivo `.env.local` não existe ou variáveis incorretas
**Solução:** Verifique se o arquivo `.env.local` está na raiz do projeto

### Página /mapa mostra placeholder

**Causa:** Chave da API do Google Maps não configurada
**Solução:** Configure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` ou deixe como está (funcionalidade opcional)

### Login não funciona

**Causa:** Supabase não configurado corretamente
**Solução:** Verifique as variáveis de ambiente e a configuração do projeto Supabase

## 📱 Funcionalidades

### Com Supabase configurado:
- ✅ Autenticação de usuários
- ✅ Lista de ONGs em `/oportunidades`
- ✅ Sistema de login/logout
- ✅ Perfil de usuário

### Com Google Maps configurado:
- ✅ Mapa interativo em `/mapa`
- ✅ Marcadores das ONGs no mapa
- ✅ Filtros por localização

### Sem Google Maps:
- ✅ Página `/mapa` funciona com placeholder informativo
- ✅ Todas as outras funcionalidades funcionam normalmente

## 🔒 Segurança

- As variáveis de ambiente são públicas (NEXT_PUBLIC_*)
- O Supabase gerencia a segurança do banco de dados
- Row Level Security (RLS) está habilitado
- Autenticação via JWT tokens

## 📞 Suporte

Se ainda houver problemas após seguir este guia:

1. Verifique o console do navegador para erros
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se o projeto Supabase está ativo
4. Teste com um novo projeto Supabase se necessário