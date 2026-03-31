# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Voluntária+ is a web platform (Portuguese-language) connecting NGOs with volunteers in Rio Grande do Sul, Brazil. Volunteers discover ONGs by location/type, contact via WhatsApp, and track interactions. ONGs register and list volunteer opportunities.

## Commands

```bash
npm run dev       # Dev server on localhost:3000
npm run build     # Production build
npm start         # Production server
npm run lint      # ESLint (next/core-web-vitals)
```

No test framework is configured.

## Architecture

- **Next.js 15** App Router with TypeScript
- **Supabase** for auth, PostgreSQL database, and serverless functions
- **Google Maps** API for interactive ONG map view
- **shadcn/ui** (Radix UI + Tailwind CSS) for components
- **React Hook Form + Zod** for form validation

### Auth Flow

`middleware.ts` protects `/dashboard`, `/perfil`, `/configuracoes`, `/onboarding` using Supabase session checks. Auth state is managed client-side via `AuthProvider` context (`components/providers/auth-provider.tsx`). The `useAuth()` hook provides `user`, `loading`, `signOut()`, and `refreshUser()`.

Users must complete onboarding before accessing protected routes — middleware enforces this redirect.

### Database

Four main tables: `users`, `ongs`, `interacoes`, `blood_donation_registrations`. RLS policies restrict writes to own data via `auth.uid()`. Types are in `types/database.ts` (auto-generated) and `types/index.ts` (custom).

Migrations live in `supabase/migrations/`.

### Key Patterns

- Supabase client is initialized in `lib/supabase.ts` using `createClientComponentClient`
- Direct Supabase queries in components (no REST API layer except `api/auth/callback`)
- `lib/utils.ts` has `cn()` (class merging), `formatPhone()`, `retryWithBackoff()`
- Google Maps lazy-loaded via singleton in `lib/google-maps-loader.ts`
- Toast notifications via Sonner

### Styling

Primary color is `#FBBF24` (yellow). Dark mode configured but not fully implemented. Custom animations: `fadeIn`, `slideUp`, `bounceGentle` in `tailwind.config.ts`.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

## Routes (Portuguese)

- `/entrar`, `/cadastrar`, `/esqueci-senha` — auth pages
- `/oportunidades` — browse ONGs with filters and pagination
- `/mapa` — Google Maps view of ONGs
- `/dashboard`, `/perfil`, `/configuracoes` — protected user pages
- `/onboarding` — required first-login setup
- `/sobre`, `/ajuda`, `/privacidade`, `/termos` — static pages
