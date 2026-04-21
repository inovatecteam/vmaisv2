# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Voluntária+ is a Portuguese-language web platform connecting NGOs (ONGs) with volunteers in Rio Grande do Sul, Brazil. Volunteers discover ONGs by location/type and contact them via WhatsApp; ONGs register and appear publicly once approved by an admin. Production: https://voluntariamais.com.br

## Commands

All commands run from `vmaisv2/` (the Next.js app lives in this subdirectory; the workspace root `Voluntaria+/` contains sibling folders for assets, docs, and campaign materials).

```bash
npm run dev       # Dev server on localhost:3000
npm run build     # Production build
npm start         # Production server
npm run lint      # ESLint (next/core-web-vitals)
```

`next.config.js` sets `eslint.ignoreDuringBuilds: true` — `npm run build` does **not** lint. Run `npm run lint` explicitly before shipping.

Regenerate `types/database.ts` after a schema change:

```bash
npx supabase gen types typescript --project-id <project-ref> --schema public > types/database.ts
```

No test framework is configured.

## Stack

- **Next.js 15** App Router + TypeScript, React 18
- **Supabase** (`@supabase/ssr`) for auth, PostgreSQL, and Edge Functions
- **Google Maps JS API** for the interactive ONG map
- **shadcn/ui** (Radix UI + Tailwind CSS 3) for components
- **React Hook Form + Zod** for forms
- **Resend** (via Supabase Edge Function) for transactional email
- Deployed on **Vercel**, auto-deploy from `main`

## Architecture

### Supabase clients (three environments)

Because the app uses `@supabase/ssr`, there are three distinct client entry points — pick the right one:

- [lib/supabase.ts](lib/supabase.ts) — `createBrowserClient` wrapped in a lazy-singleton `Proxy`. Use in client components.
- [lib/supabase-server.ts](lib/supabase-server.ts) — `createServerClient` for server components and route handlers.
- [middleware.ts](middleware.ts) — its own `createServerClient` with cookie `getAll`/`setAll` wiring. **Must** call `supabase.auth.getUser()` before any auth check so cookies refresh.

### Auth & route protection

Middleware runs on **every** request (matcher excludes only static assets) to refresh session cookies. Protected routes: `/dashboard`, `/perfil`, `/configuracoes`, `/onboarding`.

Flow enforced in [middleware.ts](middleware.ts):
1. Unauthenticated → redirect to `/entrar?redirect=<path>`
2. Failed profile lookup → redirect to `/entrar?error=session`
3. Authenticated but `users.onboarded !== true` → redirect to `/onboarding`
4. Already onboarded but visiting `/onboarding` → redirect to `/perfil`

Client-side auth state lives in `components/providers/auth-provider.tsx` (`AuthProvider` context); components consume via `useAuth()` → `{ user, loading, signOut, refreshUser }`. Auth helpers (`signUp`/`signIn`/`signOut`/`getCurrentUser`) are in [lib/auth.ts](lib/auth.ts); on first sign-in it auto-creates the `users` row if missing.

### Database

Four main tables in the public schema:

| Table | Notes |
|---|---|
| `users` | Volunteer/ONG profiles. `onboarded` flag gates protected routes. |
| `ongs` | Only rows with `admin_approved = true` are visible publicly. |
| `interacoes` | WhatsApp contact history between volunteers and ONGs. |
| `blood_donation_registrations` | Blood drive campaign sign-ups. |

RLS is enabled on every table — writes are restricted to `auth.uid()`-owned rows. Types live in [types/database.ts](types/database.ts) (generated from Supabase) and [types/index.ts](types/index.ts) (app-level).

**Migrations in [supabase/migrations/](supabase/migrations/) are NOT applied automatically.** After merging a new `.sql` file, paste it into the Supabase Dashboard SQL Editor and run it manually. Deployments do not touch the database.

### Edge Function

[supabase/functions/send-whatsapp-contact-email](supabase/functions/send-whatsapp-contact-email) sends an email to the ONG (via Resend) whenever a volunteer uses the WhatsApp contact button. Requires `RESEND_API_KEY` and `ADMIN_EMAIL` secrets set in Supabase. Deploy with `npx supabase functions deploy send-whatsapp-contact-email`.

### Key patterns

- Direct Supabase queries from components — no REST API layer (only route handler is `/app/api/auth/callback` for the OAuth redirect).
- Google Maps is lazy-loaded through a singleton in [lib/google-maps-loader.ts](lib/google-maps-loader.ts) so the API only loads on `/mapa` and `LocationPickerMap`.
- [lib/utils.ts](lib/utils.ts) exports `cn()` (class merging), `formatPhone()`, and `retryWithBackoff()` — reuse these instead of re-implementing.
- [lib/api.ts](lib/api.ts) wraps `sendContactEmail` with retry logic.
- Toast notifications use **Sonner**.
- Primary brand color is `#FBBF24` (yellow). Custom animations `fadeIn`, `slideUp`, `bounceGentle` are defined in [tailwind.config.ts](tailwind.config.ts). Dark mode classes exist but the theme is not fully implemented.

## Routes (Portuguese)

- `/entrar`, `/cadastrar`, `/esqueci-senha` — auth pages
- `/oportunidades` — ONG listing with filters + pagination
- `/mapa` — Google Maps view of approved ONGs
- `/dashboard`, `/perfil`, `/configuracoes`, `/onboarding` — protected
- `/sobre`, `/ajuda`, `/privacidade`, `/termos` — static
- `/app/api/auth/callback` — Supabase OAuth callback

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY   # optional — /mapa fails to load without it
NEXT_PUBLIC_GOOGLE_ADS_ID         # optional — Google Ads tracking
```

Configure the same variables in Vercel > Project Settings > Environment Variables.
