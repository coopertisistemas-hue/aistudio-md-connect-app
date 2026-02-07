# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MD Connect App — a mobile-first React PWA for church members (IPDA denomination). Uses a strict BFF architecture where the client **never** calls `supabase.from()` directly; all data flows through Supabase Edge Functions.

- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4 + Radix UI
- **Package manager:** pnpm
- **Deployment:** Vercel (frontend) + Supabase (auth, edge functions, database)
- **Language:** Portuguese (PT-BR) interface

## Commands

```bash
pnpm dev              # Dev server on port 5173
pnpm build            # TypeScript check + Vite build (tsc -b && vite build)
pnpm lint             # ESLint
pnpm preview          # Preview production build

# Supabase local dev (requires Docker)
pnpm supabase:start   # Start local Supabase
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:status  # Check status

# Quality gates
node scripts/audit-internal-pages.mjs   # Verify all internal pages use InternalPageLayout
node scripts/check-sprint0.mjs          # Sprint 0 validation gate (used in CI)
```

No automated test framework is configured. Quality is enforced via audit scripts and `docs/QA_CHECKLIST_FASE1.md`.

## Architecture

### Two-Layout System

The app has two distinct layout contexts, both defined in `src/App.tsx`:

1. **PublicLayout** (`/`) — Unauthenticated pages (landing, Bible, devotionals, prayer, public content)
2. **ChurchLayout** (`/c/:slug`) — Authenticated, church-scoped pages wrapped in `ProtectedRoute` > `ChurchScopedRoute` > `ChurchProvider` > `MembershipProvider`

### BFF Pattern (Critical Rule)

All data access goes through Supabase Edge Functions via `src/lib/bff.ts`:

```
Page → Service (src/services/*.ts) → invokeBff() → Edge Function → Database
```

- `invokeBff<T>(functionName, body?)` — calls `supabase.functions.invoke()`, unwraps the standard envelope
- Edge functions live in `supabase/functions/` (Deno/TypeScript)
- Standard response envelope: `{ ok, data, error, meta: { request_id, ts } }`
- Edge function naming: `public_*` (no auth), `auth_*` (login), `church_*` (login + church context), `admin_*` (elevated)

### Context Providers

- `AuthContext` (`useAuth()`) — user session via `auth-me` edge function
- `ChurchContext` (`useChurch()`) — church data from URL slug, cached in localStorage
- `MembershipContext` — permissions/membership gating within church scope

### Route Definitions

Central route constants in `src/lib/routes.ts` (`APP_ROUTES`). All routes are defined in `src/App.tsx`.

### Feature Flags

`src/lib/flags.ts` — static boolean flags (`FLAGS.FEATURE_*`) that gate UI features.

### Key Patterns

- **InternalPageLayout** — standard wrapper for all internal pages (title, subtitle, icon, back navigation, sponsor/donate blocks). Compliance checked by `audit-internal-pages.mjs`.
- **Lazy loading** — critical pages (LandingPage, Home) are eager-loaded; all others use `React.lazy()` with `<Suspense>`.
- **Path alias:** `@/*` maps to `./src/*`
- **Data fetching:** `useEffect` + `useState` (no react-query/SWR)
- **Forms:** React Hook Form
- **Toasts:** Sonner (`sonner`)
- **Icons:** Lucide React
- **UI primitives:** Radix UI (don't edit `src/components/ui/` directly — create new components instead)

## Mandatory Documentation

These docs define the current governance and must be followed:

- `docs/90_shared_standards/API_CONTRACT.md` — BFF rules, endpoint specs, response envelope. **Zero `supabase.from` in client code.**
- `docs/90_shared_standards/AI_RULES.md` — Tech stack conventions
- `docs/10_app_web_cliente/MD_CONNECT_APP_MASTER_PLAN.md` — Product SSOT ("Bible" of the app)
- `docs/QA_CHECKLIST_FASE1.md` — Quality gate for PRs
- `docs/ROADMAP_FASE1.md` — Sprint planning and Definition of Done

## Security

- CORS allowlist enforced on all edge functions (not wildcard)
- JWT verification on every authenticated edge function
- RLS on all database tables
- Pre-commit hook prevents `.env` file commits
- Environment variables prefixed with `VITE_` for client exposure

## Tailwind Theme

Primary colors: `primary` (#1e3a8a blue), `secondary` (#10b981 green), `highlight` (#f59e0b amber), `alert` (#ef4444 red). Fonts: Inter, Montserrat.
