# REPO_OPERATIONS.md
> MD Connect App — aistudio-md-connect-app
> Last updated: 2026-02-28 (Node pinned v24.12.0)

---

## Environment Requirements

| Tool | **Pinned Version** | Check |
|------|-------------------|-------|
| Node.js | **24.12.0** (see `.nvmrc`) | `node --version` |
| pnpm | **10.30.3** | `pnpm --version` |
| Supabase CLI | ≥ 1.x | `supabase --version` |
| Capacitor CLI | ≥ 8.x | `npx cap --version` |

> Node version is pinned in `.nvmrc`. Using a different Node major version **will cause lockfile churn**.

### Activating the pinned Node version

```bash
# With nvm (Linux/macOS)
nvm use           # reads .nvmrc automatically

# With fnm (Windows-friendly)
fnm use           # reads .nvmrc automatically

# With Volta
volta pin node@24.12.0
```

### Enforcing pnpm version via Corepack (recommended)

```bash
corepack enable
corepack prepare pnpm@10.30.3 --activate
```

---

## Initial Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env.local
# Then fill in required keys (see section below)

# 3. Start local Supabase instance
pnpm supabase:start

# 4. Start development server
pnpm dev
```

---

## Required `.env.local` Keys

| Key | Description | Source |
|-----|-------------|--------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase dashboard → Project Settings → API |
| `VITE_APP_ENV` | Environment name (`development` / `staging` / `production`) | Set manually |
| `VITE_APP_VERSION` | App version string | Set manually (e.g. `1.0.0`) |

> ⚠️ Never commit `.env.local` or `.env.production`. Verified by `pnpm check:sprint0`.

---

## Common Commands

### Development

```bash
pnpm dev                    # Start Vite dev server (localhost:5173)
pnpm preview                # Preview production build locally
```

### Build & Validation

```bash
pnpm build                  # TypeScript compile + Vite production build
pnpm lint                   # ESLint across entire project
pnpm check:sprint0          # Run Sprint 0 validation gate (fast, <5s)
pnpm check:sprint0:full     # Full validation: build + lint + security checks
pnpm audit:internal-pages   # Audit internal pages for InternalPageLayout compliance
```

> **CONNECT STOP-03:** `pnpm build` must exit 0 before any commit to `main` or `staging`.

### Supabase

```bash
pnpm supabase:start         # Start local Supabase stack
pnpm supabase:stop          # Stop local Supabase stack
pnpm supabase:status        # Show local Supabase service status
pnpm supabase:functions     # Serve Edge Functions locally
pnpm supabase:logs          # Tail Edge Function logs (--follow)
```

### Mobile (Capacitor / Android)

```bash
pnpm mobile:build           # TS compile + Vite build + cap sync
pnpm mobile:sync            # Sync web build to native projects
pnpm mobile:copy            # Copy web assets without syncing plugins
pnpm mobile:android         # Run on Android device / emulator
pnpm mobile:android:studio  # Open in Android Studio
```

---

## Git Workflow

```bash
# Before any work
git status                  # Check working tree state
git pull                    # Sync with origin

# Before any commit
pnpm build                  # MUST pass (CONNECT STOP-03)
git diff --stat             # Review scope of changes
git add -p                  # Stage hunks interactively — never git add .
git commit -m "type(scope): description"

# Commit message format: Conventional Commits
# Types: feat | fix | refactor | style | perf | docs | chore | migration | security
# Scopes: auth | members | edge | rls | i18n | ui | cors | deps | config
```

> See `CONNECT_AGENT.md` and `C:\Users\<you>\.connect\CONNECT_COMMIT_STANDARD.md` for full standards.

---

## Project Structure

```
aistudio-md-connect-app/
├── src/                    # React app source
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components (route-level)
│   └── services/           # Service layer (API calls)
├── supabase/
│   ├── functions/          # Deno Edge Functions
│   │   └── _shared/        # Shared utilities (cors.ts)
│   └── migrations/         # SQL migration files
├── scripts/                # Build/validation Node scripts
├── docs/                   # Documentation
│   ├── sprints/            # Sprint reports and summaries
│   ├── qa/                 # QA evidence documents
│   ├── ops/                # Local dev and operational guides
│   └── reports/            # Security, CORS, remediation reports
├── android/                # Capacitor Android project
├── public/                 # Static assets
├── .nvmrc                  # Pinned Node.js version (24.12.0)
├── CONNECT_AGENT.md        # CONNECT global bootstrap (mandatory)
├── REPO_OPERATIONS.md      # This file
├── .env.example            # Environment variable template
└── package.json
```

---

## Architecture Principles

1. **RLS-First**: Every Supabase table has RLS enabled. All rows are protected by policy.
2. **Edge Functions Only**: Frontend never calls sensitive tables directly via `supabase.from()`. All sensitive data access goes through `supabase/functions/`.
3. **i18n from v1**: All user-facing strings use `react-i18next`. Locales: PT (primary), EN, ES.
4. **CORS via `_shared`**: All Edge Functions use `handleCors()` from `supabase/functions/_shared/cors.ts`.

> See `CONNECT_AGENT.md` for full operational rules reference.

---

## Troubleshooting

### `pnpm build` fails with TS errors
```bash
pnpm lint                   # Check for lint issues first
npx tsc --noEmit            # Type-check without building
```

### Supabase local not starting
```bash
supabase stop --no-backup   # Clean stop
supabase start              # Restart
```

### Android build fails
```bash
pnpm mobile:sync            # Re-sync Capacitor
# Then open Android Studio and rebuild
pnpm mobile:android:studio
```
