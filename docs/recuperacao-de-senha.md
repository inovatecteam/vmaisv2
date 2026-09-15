# Recuperação de senha

Fluxo completo e onde ele aparece na interface.

## Onde o usuário encontra

| Ponto de entrada | Comportamento |
|---|---|
| `/entrar` → "Esqueci minha senha" | Leva para `/esqueci-senha` |
| `/entrar` após errar a senha | Mostra atalho "Enviar link de recuperação por email" |
| `/entrar?error=<motivo>` | Banner explicando o motivo + link para pedir novo email |
| **AuthModal** (clique numa ONG deslogado em `/`, `/mapa`, `/oportunidades`) | "Esqueci minha senha" abre o modo de recuperação **dentro do modal** |

O modal recupera sem navegar para outra página de propósito: sair da página
descartaria o `sessionStorage` que guarda a ONG clicada para reabrir os
detalhes depois do login.

## Fluxo técnico

1. `resetPasswordForEmail(email, { redirectTo: '/auth/callback?next=/redefinir-senha' })`
2. Usuário clica no link do email → cai em `/auth/callback` (ou `/auth/confirm`)
3. `lib/auth-callback.ts` troca o token por uma sessão e redireciona para `/redefinir-senha`
4. `/redefinir-senha` só renderiza o formulário se houver sessão; senão mostra o motivo da falha
5. `updatePasswordAction` grava a nova senha

O handler aceita os três formatos que os templates do Supabase podem gerar:

- `?token_hash=...&type=recovery` → `verifyOtp` **(funciona em qualquer navegador)**
- `?code=...` → PKCE, template padrão `{{ .ConfirmationURL }}` **(só no mesmo navegador)**
- `?error=...&error_code=...` → Supabase recusou o token
- `#access_token=...` (flow implícito) → tratado no cliente por `link-invalido.tsx`

## ⚠️ Pendência no Dashboard do Supabase

O código já suporta o formato que funciona entre aparelhos, mas o template de
email ainda precisa ser trocado no Dashboard — **isso não é feito por deploy**.

**Authentication → Email Templates → Reset Password**, trocar o corpo para:

```html
<h2>Redefinir sua senha</h2>
<p>Clique no link abaixo para criar uma nova senha:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/redefinir-senha">
    Redefinir senha
  </a>
</p>
<p>Se você não pediu isso, ignore este email. O link vale por 1 hora.</p>
```

Por que trocar: com `{{ .ConfirmationURL }}` (padrão) o Supabase usa PKCE, que
exige o *code verifier* guardado no navegador que pediu a recuperação. Quem pede
no desktop e abre o email no celular recebe "link inválido" mesmo com um link
válido — hoje o caso mais comum de falha. `{{ .TokenHash }}` não depende de
estado local e funciona em qualquer aparelho.

**Authentication → URL Configuration → Redirect URLs**, conferir se existem:

```
https://voluntariamais.com.br/auth/callback
https://voluntariamais.com.br/auth/confirm
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
```

Sem isso o Supabase ignora o `redirect_to` e manda o usuário para a Site URL,
quebrando o fluxo silenciosamente.
