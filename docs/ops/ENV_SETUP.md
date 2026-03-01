# ENV_SETUP.md
> MD Connect App — Environment Variable Setup Guide
> Last updated: 2026-03-01

---

## Overview

The app uses **two separate env contexts** with different setup paths:

| Context | Variables | Where to set |
|---------|-----------|--------------|
| Vite (frontend) | `VITE_*` | `.env.local` in repo root |
| Supabase Edge Functions (Deno) | `SUPABASE_*`, `OPENAI_API_KEY` | Supabase secrets (auto-injected or `supabase secrets set`) |

---

## Step 1 — Create `.env.local`

```bash
cp .env.example .env.local
```

> `.env.local` is git-ignored. Never commit it. Never commit real keys.

---

## Step 2 — Fill in Required Variables

Open `.env.local` and set at minimum:

| Variable | Where to get | Required |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | **YES** |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key | **YES** |

The app will **fail silently or show network errors** if these are missing or wrong.

---

## Step 3 — Optional Vite Variables

These have safe defaults — the app works without them:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_APP_ENV` | `development` | Shown in error reports |
| `VITE_APP_VERSION` | `1.0.0` | Shown in error reports |
| `VITE_PUBLIC_BASE_URL` | `http://localhost:5173` | OG/SEO meta tags |
| `VITE_API_BASE_URL` | _(empty)_ | Error reporting endpoint |
| `VITE_GA_MEASUREMENT_ID` | _(empty)_ | Disables Google Analytics |
| `VITE_ANALYTICS_ENABLED` | `false` | Disables event tracking |
| `VITE_ENABLE_BACKEND_ANALYTICS` | `false` | Disables Supabase event tracking |
| `VITE_ERROR_REPORTING_ENABLED` | `false` | Disables error reports to backend |

---

## Step 4 — Supabase Edge Function Secrets

**Auto-injected (no action needed for local dev):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Must be set manually for AI features:**

```bash
# Set OpenAI key for AI-powered functions
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

Affected functions:
- `devotionals-generate-cover` — generates AI cover images
- `generate-verse-commentary` — AI Bible verse commentary
- `generate-book-context` — AI Bible book context

> For cloud (production), set secrets in: **Supabase Dashboard → Edge Functions → Secrets**

---

## Verifying Your Setup

```bash
# 1 — Dev server should start without errors
pnpm dev

# 2 — Open browser DevTools console — look for:
#   Supabase connection errors → VITE_SUPABASE_URL or _ANON_KEY wrong
#   Analytics disabled → expected unless VITE_GA_MEASUREMENT_ID set

# 3 — Build gate must pass (no env var type errors)
pnpm type-check
pnpm build
```

---

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank page or auth errors | Wrong/missing `VITE_SUPABASE_URL` | Check Supabase Dashboard → Settings → API |
| "Network request failed" on login | Wrong `VITE_SUPABASE_ANON_KEY` | Copy anon key from Supabase Dashboard |
| OG images broken in staging | `VITE_PUBLIC_BASE_URL` not set | Set to your staging domain |
| AI functions return 500 | `OPENAI_API_KEY` not set in secrets | `supabase secrets set OPENAI_API_KEY=...` |
| `pnpm install` fails | Wrong Node version | Run `fnm use` (reads `.nvmrc` → Node 24.12.0) |

---

## Local Development Env Example

```env
# .env.local (never commit this file)
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
VITE_PUBLIC_BASE_URL=http://localhost:5173
VITE_ERROR_REPORTING_ENABLED=false
VITE_ANALYTICS_ENABLED=false
```
