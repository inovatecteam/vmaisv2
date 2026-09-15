// Rota do template de email baseado em `{{ .TokenHash }}`.
// Compartilha o handler com /auth/callback — ver lib/auth-callback.ts.
import { handleAuthCallback } from '@/lib/auth-callback'

export async function GET(request: Request) {
  return handleAuthCallback(request)
}
