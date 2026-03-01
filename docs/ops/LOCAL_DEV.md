# LOCAL_DEV.md
> MD Connect App — Local Development Guide
> Last updated: 2026-03-01

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | **24.12.0** (see `.nvmrc`) | [nodejs.org](https://nodejs.org) |
| pnpm | **10.30.3** | `npm install -g pnpm@10.30.3` or `corepack enable` |
| Supabase CLI | ≥ 1.x | [Supabase CLI docs](https://supabase.com/docs/guides/cli) |
| Docker Desktop | latest | Required by Supabase local stack |
| Android Studio | latest | Required only for mobile builds |

> **Windows note:** Use fnm (Fast Node Manager) for easy `.nvmrc` support.
> Install: `winget install Schniz.fnm` then `fnm use` in this repo.

---

## Step 1 — Activate Correct Node Version

```bash
# With fnm (Windows)
fnm use

# With nvm (Linux/macOS)
nvm use

node -v   # must output v24.12.0
pnpm -v   # must output 10.30.3
```

---

## Step 2 — Install Dependencies

```bash
pnpm install
```

> Do NOT use `npm install` or `yarn install`. Only pnpm is supported.

---

## Step 3 — Configure Environment

```bash
cp .env.example .env.local
```

| Key | Description |
|-----|-------------|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `VITE_APP_ENV` | `development` |
| `VITE_APP_VERSION` | `0.0.0` |

---

## Step 4 — Start Local Supabase Stack

Docker Desktop must be running.

```bash
pnpm supabase:start
# Studio: http://localhost:54323
# REST API: http://localhost:54321
```

Stop: `pnpm supabase:stop` | Status: `pnpm supabase:status`

---

## Step 5 — Run Dev Server

```bash
pnpm dev
# → http://localhost:5173
```

---

## Step 6 — Serve Edge Functions

```bash
pnpm functions:serve
# → http://localhost:54321/functions/v1/<name>
```

---

## Step 7 — Validate Build (CONNECT STOP-03)

```bash
pnpm type-check   # tsc -b --noEmit — must exit 0
pnpm build        # tsc -b + vite build — must exit 0
```

Or use the PS1 wrappers:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\build.ps1
powershell -ExecutionPolicy Bypass -File scripts\typecheck.ps1
```

---

## Quick Reference

```bash
pnpm dev                    # Vite dev server
pnpm build                  # Production build
pnpm type-check             # TypeScript check only
pnpm lint                   # ESLint
pnpm smoke:build            # Alias for pnpm build
pnpm check:sprint0          # Security + architecture gate
pnpm supabase:start/stop    # Supabase local stack
pnpm functions:serve        # Serve Edge Functions
pnpm mobile:build           # Build + cap sync
pnpm mobile:android         # Run on Android
```

---

## Troubleshooting

### `pnpm install` fails
```bash
pnpm store prune && pnpm install
```

### `pnpm build` TS errors
```bash
npx tsc -b --noEmit    # Full error list
```

### Supabase port conflict
```bash
supabase stop --no-backup && supabase start
```

### Edge Functions missing env vars
```bash
supabase functions serve --env-file .env.local
```
