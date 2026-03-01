# QA_ENV_AND_SMOKE.md
> Repo: aistudio-md-connect-app
> Commit: `chore(ops): document env requirements + add smoke gate script`
> Date: 2026-03-01T08:35 BRT

---

## Environment

| Tool | Version |
|------|---------|
| Node.js | v24.12.0 |
| pnpm | 10.30.3 |

---

## Phase A — ENV Audit Results

### Vite frontend (`src/`) — 11 variables found

| Variable | File | Required | In old .env.example |
|----------|------|----------|---------------------|
| `VITE_SUPABASE_URL` | `supabase.ts`, `analytics.ts`, pages | **YES** | ✅ |
| `VITE_SUPABASE_ANON_KEY` | `supabase.ts`, `analytics.ts`, pages | **YES** | ✅ |
| `VITE_APP_ENV` | `errorReporter.ts` | Optional | ❌ missing |
| `VITE_APP_VERSION` | `errorReporter.ts` | Optional | ❌ missing |
| `VITE_PUBLIC_BASE_URL` | `seo.ts` | Optional | ❌ missing |
| `VITE_API_BASE_URL` | `errorReporter.ts` | Optional | ❌ missing |
| `VITE_ERROR_REPORTING_ENABLED` | `errorReporter.ts` | Optional | ❌ missing |
| `VITE_GA_MEASUREMENT_ID` | `analytics.ts` | Optional | ❌ missing |
| `VITE_ANALYTICS_ENABLED` | `analytics.ts` | Optional | ❌ missing |
| `VITE_ENABLE_BACKEND_ANALYTICS` | `analytics.ts` | Optional | ❌ missing |
| `import.meta.env.DEV` | various | Built-in | N/A |

**9 of 11 vars were missing from `.env.example`.**

### Supabase Edge Functions (Deno) — env vars found

| Variable | Functions | Source |
|----------|-----------|--------|
| `SUPABASE_URL` | All functions | Auto-injected by Supabase |
| `SUPABASE_ANON_KEY` | Public functions | Auto-injected by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged functions | Auto-injected by Supabase |
| `OPENAI_API_KEY` | `devotionals-generate-cover`, `generate-verse-commentary`, `generate-book-context` | **Must be set manually** |

**Set OPENAI_API_KEY:** `supabase secrets set OPENAI_API_KEY=sk-...`

---

## Files Changed

| File | Action | Summary |
|------|--------|---------|
| `.env.example` | Updated | 2 → 11 vars: added all VITE_* + Deno secret notes |
| `docs/ops/ENV_SETUP.md` | New | Full env guide: required/optional split, pitfalls, verification |
| `scripts/smoke.ps1` | New | Full gate: pnpm check + type-check + build |
| `docs/README.md` | Updated | Added `ENV_SETUP.md` link + `smoke.ps1` to scripts table |
| `docs/qa/QA_ENV_AND_SMOKE.md` | New | This file |

---

## Gate Evidence (verbatim)

### pnpm type-check
```
> member-app@0.0.0 type-check
> tsc -b --noEmit

Exit code: 0
```

### pnpm build
```
> member-app@0.0.0 build
> tsc -b && vite build

✓ built in 9.69s
Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 `pnpm build` | ✅ exit 0 — 9.69s |
| `pnpm type-check` | ✅ exit 0 |
| No `src/` logic changed | ✅ confirmed — `.env.example` + docs only |
| No `supabase/functions/` changed | ✅ confirmed |

---

**QA Sign-off:** AGV — 2026-03-01T08:35 BRT
